package com.FoodBridgeBangladesh.Service.admin;

import com.FoodBridgeBangladesh.Model.admin.adminManagementEntity;
import com.FoodBridgeBangladesh.Repository.admin.adminManagementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.mail.internet.MimeMessage;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.logging.Logger;

@Service
public class AdminEmailService {

    private static final Logger logger = Logger.getLogger(AdminEmailService.class.getName());

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private adminManagementRepository adminRepository;

    /**
     * Get predefined email templates
     */
    public Map<String, Object> getEmailTemplates() {
        Map<String, Object> templates = new HashMap<>();

        // Welcome Template
        Map<String, String> welcomeTemplate = new HashMap<>();
        welcomeTemplate.put("defaultSubject", "Welcome to FoodBridge Admin Team");
        welcomeTemplate.put("defaultContent",
                "Dear {recipientName},\n\n" +
                        "Welcome to the FoodBridge administration team! We're excited to have you on board.\n\n" +
                        "As a {recipientRole}, you'll have access to various administrative features to help manage our platform effectively.\n\n" +
                        "If you have any questions or need assistance, please don't hesitate to reach out.\n\n" +
                        "Best regards,\n" +
                        "{senderName}\n" +
                        "FoodBridge Admin Team\n\n" +
                        "---\n" +
                        "This email was sent on {currentDate} at {currentTime}"
        );

        // Action Against Report Template
        Map<String, String> actionReportTemplate = new HashMap<>();
        actionReportTemplate.put("defaultSubject", "Action Required: Report Review");
        actionReportTemplate.put("defaultContent",
                "Dear {recipientName},\n\n" +
                        "This is to inform you that immediate action is required regarding a recent report in our system.\n\n" +
                        "Report Details:\n" +
                        "- Report requires your attention and review\n" +
                        "- Please log into the admin dashboard to view full details\n" +
                        "- Timely action is appreciated\n\n" +
                        "Please review and take appropriate action as soon as possible.\n\n" +
                        "If you have any questions about this report, please contact me directly.\n\n" +
                        "Best regards,\n" +
                        "{senderName}\n" +
                        "FoodBridge Admin Team\n\n" +
                        "---\n" +
                        "This email was sent on {currentDate} at {currentTime}"
        );

        // System Alert Template
        Map<String, String> systemAlertTemplate = new HashMap<>();
        systemAlertTemplate.put("defaultSubject", "System Alert Notification");
        systemAlertTemplate.put("defaultContent",
                "Dear {recipientName},\n\n" +
                        "This is a system alert notification that requires your attention.\n\n" +
                        "Alert Details:\n" +
                        "- System has detected an issue that needs administrative review\n" +
                        "- Please check the admin dashboard for detailed information\n" +
                        "- Your prompt attention would be appreciated\n\n" +
                        "Thank you for your continued vigilance in maintaining our platform.\n\n" +
                        "Best regards,\n" +
                        "{senderName}\n" +
                        "FoodBridge Admin Team\n\n" +
                        "---\n" +
                        "This email was sent on {currentDate} at {currentTime}"
        );

        // User Management Template
        Map<String, String> userManagementTemplate = new HashMap<>();
        userManagementTemplate.put("defaultSubject", "User Management Action Required");
        userManagementTemplate.put("defaultContent",
                "Dear {recipientName},\n\n" +
                        "A user management action requires your attention and approval.\n\n" +
                        "Action Details:\n" +
                        "- User account requires administrative review\n" +
                        "- Please review the user details in the admin dashboard\n" +
                        "- Your decision and action are needed\n\n" +
                        "Please process this request at your earliest convenience.\n\n" +
                        "Best regards,\n" +
                        "{senderName}\n" +
                        "FoodBridge Admin Team\n\n" +
                        "---\n" +
                        "This email was sent on {currentDate} at {currentTime}"
        );

        // Merchant Approval Template
        Map<String, String> merchantApprovalTemplate = new HashMap<>();
        merchantApprovalTemplate.put("defaultSubject", "Merchant Approval Required");
        merchantApprovalTemplate.put("defaultContent",
                "Dear {recipientName},\n\n" +
                        "A new merchant registration is pending your approval.\n\n" +
                        "Merchant Details:\n" +
                        "- New merchant application submitted\n" +
                        "- Business documentation provided\n" +
                        "- Awaiting your review and approval decision\n\n" +
                        "Please review the merchant application in the admin dashboard.\n\n" +
                        "Best regards,\n" +
                        "{senderName}\n" +
                        "FoodBridge Admin Team\n\n" +
                        "---\n" +
                        "This email was sent on {currentDate} at {currentTime}"
        );

        // General Notification Template
        Map<String, String> generalTemplate = new HashMap<>();
        generalTemplate.put("defaultSubject", "General Admin Notification");
        generalTemplate.put("defaultContent",
                "Dear {recipientName},\n\n" +
                        "This is a general notification from the FoodBridge admin team.\n\n" +
                        "Please review the attached information or check your admin dashboard for more details.\n\n" +
                        "If you have any questions, please feel free to reach out.\n\n" +
                        "Best regards,\n" +
                        "{senderName}\n" +
                        "FoodBridge Admin Team\n\n" +
                        "---\n" +
                        "This email was sent on {currentDate} at {currentTime}"
        );

        templates.put("welcome", welcomeTemplate);
        templates.put("action_report", actionReportTemplate);
        templates.put("system_alert", systemAlertTemplate);
        templates.put("user_management", userManagementTemplate);
        templates.put("merchant_approval", merchantApprovalTemplate);
        templates.put("general", generalTemplate);

        return templates;
    }

    /**
     * Get specific email template by name
     */
    public Map<String, Object> getEmailTemplate(String templateName) {
        Map<String, Object> templates = getEmailTemplates();
        return (Map<String, Object>) templates.get(templateName);
    }

    /**
     * Send email from admin to admin by admin ID
     */
    public boolean sendAdminEmail(Long recipientAdminId, Long senderAdminId, String subject,
                                  String content, String template, MultipartFile[] attachments) {
        try {
            // Get recipient admin details
            Optional<adminManagementEntity> recipientOpt = adminRepository.findById(recipientAdminId);
            if (!recipientOpt.isPresent()) {
                throw new IllegalArgumentException("Recipient admin not found with ID: " + recipientAdminId);
            }

            // Get sender admin details
            Optional<adminManagementEntity> senderOpt = adminRepository.findById(senderAdminId);
            if (!senderOpt.isPresent()) {
                throw new IllegalArgumentException("Sender admin not found with ID: " + senderAdminId);
            }

            adminManagementEntity recipient = recipientOpt.get();
            adminManagementEntity sender = senderOpt.get();

            return sendEmailInternal(recipient, sender, subject, content, template, attachments);

        } catch (Exception e) {
            logger.severe("Error sending admin email: " + e.getMessage());
            return false;
        }
    }

    /**
     * Send email from admin to admin by email address
     */
    public boolean sendAdminEmailByEmail(String recipientEmail, Long senderAdminId, String subject,
                                         String content, String template, MultipartFile[] attachments) {
        try {
            // Get recipient admin details by email
            Optional<adminManagementEntity> recipientOpt = adminRepository.findByEmail(recipientEmail);
            if (!recipientOpt.isPresent()) {
                throw new IllegalArgumentException("Recipient admin not found with email: " + recipientEmail);
            }

            // Get sender admin details
            Optional<adminManagementEntity> senderOpt = adminRepository.findById(senderAdminId);
            if (!senderOpt.isPresent()) {
                throw new IllegalArgumentException("Sender admin not found with ID: " + senderAdminId);
            }

            adminManagementEntity recipient = recipientOpt.get();
            adminManagementEntity sender = senderOpt.get();

            return sendEmailInternal(recipient, sender, subject, content, template, attachments);

        } catch (Exception e) {
            logger.severe("Error sending admin email by email: " + e.getMessage());
            return false;
        }
    }

    /**
     * Internal method to send email
     */
    private boolean sendEmailInternal(adminManagementEntity recipient, adminManagementEntity sender,
                                      String subject, String content, String template,
                                      MultipartFile[] attachments) {
        try {
            // Process email content with placeholders
            String processedContent = processEmailTemplate(content, recipient, sender);
            String processedSubject = processEmailTemplate(subject, recipient, sender);

            // Create mime message
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            // Set email properties
            helper.setTo(recipient.getEmail());
            helper.setFrom(sender.getEmail());
            helper.setSubject(processedSubject);
            helper.setText(processedContent, false); // false for plain text

            // Add attachments if provided
            if (attachments != null && attachments.length > 0) {
                for (MultipartFile attachment : attachments) {
                    if (attachment != null && !attachment.isEmpty()) {
                        helper.addAttachment(
                                attachment.getOriginalFilename() != null ?
                                        attachment.getOriginalFilename() : "attachment",
                                attachment
                        );
                        logger.info("Added attachment: " + attachment.getOriginalFilename());
                    }
                }
            }

            // Send email
            mailSender.send(message);

            logger.info("Email sent successfully from " + sender.getEmail() + " to " + recipient.getEmail());
            return true;

        } catch (Exception e) {
            logger.severe("Error in sendEmailInternal: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Process email template with placeholders
     */
    private String processEmailTemplate(String content, adminManagementEntity recipient, adminManagementEntity sender) {
        if (content == null) return "";

        // Get current date and time
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("MMMM dd, yyyy");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm a");

        // Replace placeholders
        String processedContent = content
                .replace("{recipientName}", recipient.getFirstName() + " " + recipient.getLastName())
                .replace("{recipientFirstName}", recipient.getFirstName())
                .replace("{recipientLastName}", recipient.getLastName())
                .replace("{recipientEmail}", recipient.getEmail())
                .replace("{recipientRole}", recipient.getRole() != null ? recipient.getRole() : "Admin")
                .replace("{senderName}", sender.getFirstName() + " " + sender.getLastName())
                .replace("{senderFirstName}", sender.getFirstName())
                .replace("{senderLastName}", sender.getLastName())
                .replace("{senderEmail}", sender.getEmail())
                .replace("{senderRole}", sender.getRole() != null ? sender.getRole() : "Admin")
                .replace("{currentDate}", now.format(dateFormatter))
                .replace("{currentTime}", now.format(timeFormatter))
                .replace("{currentDateTime}", now.format(DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' hh:mm a")));

        return processedContent;
    }

    /**
     * Validate email address format
     */
    private boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        return email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    }

    /**
     * Validate attachment file
     */
    private boolean isValidAttachment(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return false;
        }

        // Check file size (10MB max)
        if (file.getSize() > 10 * 1024 * 1024) {
            return false;
        }

        // Check file type (allow common file types)
        String contentType = file.getContentType();
        if (contentType == null) {
            return false;
        }

        List<String> allowedTypes = Arrays.asList(
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "text/plain",
                "image/jpeg",
                "image/png",
                "image/gif",
                "application/zip"
        );

        return allowedTypes.contains(contentType.toLowerCase());
    }

    /**
     * Get email sending statistics (for future use)
     */
    public Map<String, Object> getEmailStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalAdmins", adminRepository.count());
        stats.put("activeAdmins", adminRepository.findByStatus("Active").size());
        stats.put("availableTemplates", getEmailTemplates().size());
        stats.put("serviceStatus", "Active");
        stats.put("lastUpdated", LocalDateTime.now().toString());
        return stats;
    }

    public boolean sendAdminEmailByEmailToEmail(String recipientEmail, String senderEmail, String subject,
                                                String content, String template, MultipartFile[] attachments) {
        try {
            // Get recipient admin details by email
            Optional<adminManagementEntity> recipientOpt = adminRepository.findByEmail(recipientEmail);
            if (!recipientOpt.isPresent()) {
                throw new IllegalArgumentException("Recipient admin not found with email: " + recipientEmail);
            }

            // Get sender admin details by email
            Optional<adminManagementEntity> senderOpt = adminRepository.findByEmail(senderEmail);
            if (!senderOpt.isPresent()) {
                throw new IllegalArgumentException("Sender admin not found with email: " + senderEmail);
            }

            adminManagementEntity recipient = recipientOpt.get();
            adminManagementEntity sender = senderOpt.get();

            return sendEmailInternal(recipient, sender, subject, content, template, attachments);

        } catch (Exception e) {
            logger.severe("Error sending admin email by email to email: " + e.getMessage());
            return false;
        }
    }
}