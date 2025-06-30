package com.FoodBridgeBangladesh.Service.admin;

import com.FoodBridgeBangladesh.Model.admin.MerchantEntity;
import com.FoodBridgeBangladesh.Repository.admin.MerchantAddRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class MerchantEmailService {

    private static final Logger logger = Logger.getLogger(MerchantEmailService.class.getName());
    private static final int MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024; // 10MB
    private static final String[] ALLOWED_ATTACHMENT_TYPES = {
            "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "image/jpeg", "image/png", "text/plain"
    };

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private MerchantAddRepository merchantRepository;

    /**
     * Send email to a single merchant
     */
    public boolean sendEmailToMerchant(EmailRequest emailRequest) {
        try {
            // Find merchant by database ID
            Optional<MerchantEntity> merchantOpt = merchantRepository.findById(emailRequest.getMerchantId());
            if (!merchantOpt.isPresent()) {
                throw new IllegalArgumentException("Merchant not found with ID: " + emailRequest.getMerchantId());
            }

            MerchantEntity merchant = merchantOpt.get();

            // Create email message
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            // Set email properties
            helper.setFrom(emailRequest.getAdminEmail(), emailRequest.getAdminName());
            helper.setTo(merchant.getEmail());
            helper.setSubject(emailRequest.getSubject());

            // Process email content with merchant-specific placeholders
            String processedContent = processEmailContent(emailRequest.getContent(), merchant);
            helper.setText(processedContent, false); // Set to true for HTML content

            // Add attachments if any
            if (emailRequest.getAttachments() != null && emailRequest.getAttachments().length > 0) {
                addAttachments(helper, emailRequest.getAttachments());
            }

            // Send email
            mailSender.send(message);

            // Log email activity
            logEmailActivity(merchant, emailRequest);

            logger.info("Email sent successfully to merchant: " + merchant.getEmail());
            return true;

        } catch (MessagingException e) {
            logger.log(Level.SEVERE, "Failed to send email: " + e.getMessage(), e);
            return false;
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Unexpected error while sending email: " + e.getMessage(), e);
            return false;
        }
    }

    /**
     * Send bulk emails to multiple merchants
     */
    public Map<String, Object> sendBulkEmail(BulkEmailRequest bulkRequest) {
        Map<String, Object> result = new HashMap<>();
        List<Long> successfulSends = new ArrayList<>();
        List<Map<String, Object>> failedSends = new ArrayList<>();

        for (Long merchantId : bulkRequest.getMerchantIds()) {
            try {
                EmailRequest individualRequest = new EmailRequest();
                individualRequest.setMerchantId(merchantId);
                individualRequest.setSubject(bulkRequest.getSubject());
                individualRequest.setContent(bulkRequest.getContent());
                individualRequest.setTemplate(bulkRequest.getTemplate());
                individualRequest.setAdminName(bulkRequest.getAdminName());
                individualRequest.setAdminEmail(bulkRequest.getAdminEmail());
                individualRequest.setAttachments(bulkRequest.getAttachments());

                boolean success = sendEmailToMerchant(individualRequest);
                if (success) {
                    successfulSends.add(merchantId);
                } else {
                    Map<String, Object> failedSend = new HashMap<>();
                    failedSend.put("merchantId", merchantId);
                    failedSend.put("reason", "Failed to send email");
                    failedSends.add(failedSend);
                }

                // Add small delay between emails to avoid overwhelming the email server
                Thread.sleep(100);

            } catch (Exception e) {
                Map<String, Object> failedSend = new HashMap<>();
                failedSend.put("merchantId", merchantId);
                failedSend.put("reason", e.getMessage());
                failedSends.add(failedSend);
            }
        }

        result.put("totalRequested", bulkRequest.getMerchantIds().length);
        result.put("successful", successfulSends.size());
        result.put("failed", failedSends.size());
        result.put("successfulMerchantIds", successfulSends);
        result.put("failedSends", failedSends);

        return result;
    }

    /**
     * Get available email templates
     */
    public Map<String, Object> getEmailTemplates() {
        Map<String, Object> templates = new HashMap<>();

        Map<String, String> welcomeTemplate = new HashMap<>();
        welcomeTemplate.put("name", "Welcome Message");
        welcomeTemplate.put("description", "Welcome new merchants to the platform");
        welcomeTemplate.put("defaultSubject", "Welcome to FoodBridge - Your Merchant Account is Ready!");
        welcomeTemplate.put("defaultContent", getWelcomeTemplate());

        Map<String, String> approvalTemplate = new HashMap<>();
        approvalTemplate.put("name", "Account Approved");
        approvalTemplate.put("description", "Notify merchants of account approval");
        approvalTemplate.put("defaultSubject", "Congratulations! Your Merchant Account Has Been Approved");
        approvalTemplate.put("defaultContent", getApprovalTemplate());

        Map<String, String> reportActionTemplate = new HashMap<>();
        reportActionTemplate.put("name", "Action Against Report");
        reportActionTemplate.put("description", "Notify merchants about actions taken on reports");
        reportActionTemplate.put("defaultSubject", "Important Notice: Action Required Regarding Recent Report");
        reportActionTemplate.put("defaultContent", getReportActionTemplate());

        Map<String, String> suspensionTemplate = new HashMap<>();
        suspensionTemplate.put("name", "Account Suspension");
        suspensionTemplate.put("description", "Notify merchants of account suspension");
        suspensionTemplate.put("defaultSubject", "Account Suspension Notice - Immediate Action Required");
        suspensionTemplate.put("defaultContent", getSuspensionTemplate());

        Map<String, String> paymentTemplate = new HashMap<>();
        paymentTemplate.put("name", "Payment Reminder");
        paymentTemplate.put("description", "Send payment reminders to merchants");
        paymentTemplate.put("defaultSubject", "Monthly Fee Payment Reminder - {{businessName}}");
        paymentTemplate.put("defaultContent", getPaymentTemplate());

        templates.put("welcome", welcomeTemplate);
        templates.put("account_approved", approvalTemplate);
        templates.put("action_against_report", reportActionTemplate);
        templates.put("account_suspension", suspensionTemplate);
        templates.put("payment_reminder", paymentTemplate);

        return templates;
    }

    /**
     * Get email history for a merchant
     */
    public Map<String, Object> getEmailHistory(Long merchantId) {
        // Find merchant
        Optional<MerchantEntity> merchantOpt = merchantRepository.findById(merchantId);
        if (!merchantOpt.isPresent()) {
            throw new IllegalArgumentException("Merchant not found with ID: " + merchantId);
        }

        // In a real implementation, you would fetch this from an email_logs table
        // For now, return a placeholder response
        Map<String, Object> history = new HashMap<>();
        history.put("merchantId", merchantId);
        history.put("totalEmails", 0);
        history.put("emails", new ArrayList<>());
        history.put("message", "Email history feature will be implemented with email logging");

        return history;
    }

    /**
     * Process email content by replacing placeholders with merchant data
     */
    private String processEmailContent(String content, MerchantEntity merchant) {
        String merchantName = merchant.getOwnerFirstName() + " " + merchant.getOwnerLastName();
        String currentDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy"));
        String dueDate = LocalDateTime.now().plusDays(30).format(DateTimeFormatter.ofPattern("MMMM dd, yyyy"));

        return content
                .replace("{{merchantName}}", merchantName)
                .replace("{{merchantId}}", merchant.getId().toString())
                .replace("{{businessName}}", merchant.getBusinessName())
                .replace("{{currentDate}}", currentDate)
                .replace("{{feeType}}", merchant.getFeeType() != null ? merchant.getFeeType() : "Standard")
                .replace("{{feeAmount}}", merchant.getFeeAmount() != null ? merchant.getFeeAmount().toString() : "0.00")
                .replace("{{dueDate}}", dueDate);
    }

    /**
     * Add attachments to email
     */
    private void addAttachments(MimeMessageHelper helper, MultipartFile[] attachments) throws MessagingException, IOException {
        for (MultipartFile attachment : attachments) {
            if (attachment != null && !attachment.isEmpty()) {
                // Validate file size
                if (attachment.getSize() > MAX_ATTACHMENT_SIZE) {
                    throw new IllegalArgumentException("Attachment " + attachment.getOriginalFilename() + " exceeds maximum size of 10MB");
                }

                // Validate file type
                String contentType = attachment.getContentType();
                if (!Arrays.asList(ALLOWED_ATTACHMENT_TYPES).contains(contentType)) {
                    throw new IllegalArgumentException("Attachment " + attachment.getOriginalFilename() + " has unsupported file type: " + contentType);
                }

                helper.addAttachment(attachment.getOriginalFilename(), attachment);
                logger.info("Added attachment: " + attachment.getOriginalFilename());
            }
        }
    }

    /**
     * Log email activity (in a real implementation, this would save to database)
     */
    private void logEmailActivity(MerchantEntity merchant, EmailRequest emailRequest) {
        // In a real implementation, you would save this to an email_logs table
        logger.info("Email logged - Merchant: " + merchant.getEmail() +
                ", Subject: " + emailRequest.getSubject() +
                ", Template: " + emailRequest.getTemplate() +
                ", Timestamp: " + LocalDateTime.now());
    }

    // Template content methods
    private String getWelcomeTemplate() {
        return "Dear {{merchantName}},\n\n" +
                "Welcome to FoodBridge Bangladesh! We're excited to have you as a merchant partner in our mission to reduce food waste and help those in need.\n\n" +
                "Your merchant account has been successfully set up and is now active. You can now:\n" +
                "- List food donations on our platform\n" +
                "- Connect with local food receivers\n" +
                "- Track your donation impact\n" +
                "- Manage your merchant profile\n\n" +
                "If you have any questions or need assistance, please don't hesitate to contact our support team.\n\n" +
                "Thank you for joining us in making a difference!\n\n" +
                "Best regards,\n" +
                "FoodBridge Team";
    }

    private String getApprovalTemplate() {
        return "Dear {{merchantName}},\n\n" +
                "Congratulations! Your merchant account application has been approved and your account is now active.\n\n" +
                "Account Details:\n" +
                "- Merchant ID: {{merchantId}}\n" +
                "- Business Name: {{businessName}}\n" +
                "- Status: Active\n" +
                "- Approval Date: {{currentDate}}\n\n" +
                "You can now start listing food donations and connecting with local food receivers. Please ensure you follow our community guidelines and food safety standards.\n\n" +
                "Welcome to the FoodBridge community!\n\n" +
                "Best regards,\n" +
                "FoodBridge Team";
    }

    private String getReportActionTemplate() {
        return "Dear {{merchantName}},\n\n" +
                "We are writing to inform you about a recent report filed against your merchant account (ID: {{merchantId}}).\n\n" +
                "Report Details:\n" +
                "- Report Type: Food Safety/Quality Concern\n" +
                "- Date Filed: {{currentDate}}\n" +
                "- Status: Under Review\n\n" +
                "We take all reports seriously and are conducting a thorough investigation. We may need additional information from you to resolve this matter.\n\n" +
                "Please review your recent food donations and ensure all safety guidelines are being followed. If you have any questions or would like to provide additional information, please contact us immediately.\n\n" +
                "We appreciate your cooperation in maintaining the highest standards of food safety on our platform.\n\n" +
                "Best regards,\n" +
                "FoodBridge Admin Team";
    }

    private String getSuspensionTemplate() {
        return "Dear {{merchantName}},\n\n" +
                "We regret to inform you that your merchant account (ID: {{merchantId}}) has been temporarily suspended due to policy violations.\n\n" +
                "Reason for Suspension:\n" +
                "- Multiple unresolved reports\n" +
                "- Safety guideline violations\n" +
                "- Terms of service breach\n\n" +
                "To reactivate your account, please:\n" +
                "1. Review our merchant guidelines\n" +
                "2. Address the issues mentioned in previous communications\n" +
                "3. Contact our support team for account review\n\n" +
                "Your account will remain suspended until these issues are resolved.\n\n" +
                "Best regards,\n" +
                "FoodBridge Admin Team";
    }

    private String getPaymentTemplate() {
        return "Dear {{merchantName}},\n\n" +
                "This is a friendly reminder about your monthly merchant fee payment.\n\n" +
                "Payment Details:\n" +
                "- Merchant ID: {{merchantId}}\n" +
                "- Fee Type: {{feeType}}\n" +
                "- Amount Due: {{feeAmount}}\n" +
                "- Due Date: {{dueDate}}\n\n" +
                "Please ensure your payment is processed by the due date to avoid any service interruptions.\n\n" +
                "If you have any questions about your fees or payment methods, please contact our billing team.\n\n" +
                "Best regards,\n" +
                "FoodBridge Billing Team";
    }

    // Inner classes for email requests
    public static class EmailRequest {
        private Long merchantId;
        private String subject;
        private String content;
        private String template;
        private String adminName;
        private String adminEmail;
        private MultipartFile[] attachments;

        // Getters and setters
        public Long getMerchantId() { return merchantId; }
        public void setMerchantId(Long merchantId) { this.merchantId = merchantId; }

        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }

        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }

        public String getTemplate() { return template; }
        public void setTemplate(String template) { this.template = template; }

        public String getAdminName() { return adminName; }
        public void setAdminName(String adminName) { this.adminName = adminName; }

        public String getAdminEmail() { return adminEmail; }
        public void setAdminEmail(String adminEmail) { this.adminEmail = adminEmail; }

        public MultipartFile[] getAttachments() { return attachments; }
        public void setAttachments(MultipartFile[] attachments) { this.attachments = attachments; }
    }

    public static class BulkEmailRequest {
        private Long[] merchantIds;
        private String subject;
        private String content;
        private String template;
        private String adminName;
        private String adminEmail;
        private MultipartFile[] attachments;

        // Getters and setters
        public Long[] getMerchantIds() { return merchantIds; }
        public void setMerchantIds(Long[] merchantIds) { this.merchantIds = merchantIds; }

        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }

        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }

        public String getTemplate() { return template; }
        public void setTemplate(String template) { this.template = template; }

        public String getAdminName() { return adminName; }
        public void setAdminName(String adminName) { this.adminName = adminName; }

        public String getAdminEmail() { return adminEmail; }
        public void setAdminEmail(String adminEmail) { this.adminEmail = adminEmail; }

        public MultipartFile[] getAttachments() { return attachments; }
        public void setAttachments(MultipartFile[] attachments) { this.attachments = attachments; }
    }
}