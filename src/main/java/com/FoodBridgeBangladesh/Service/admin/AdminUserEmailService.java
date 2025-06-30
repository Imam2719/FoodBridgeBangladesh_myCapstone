package com.FoodBridgeBangladesh.Service.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class AdminUserEmailService {

    @Autowired
    private JavaMailSender mailSender;

    private static final String FROM_EMAIL = "sfms0674@gmail.com";
    private static final String FROM_NAME = "FoodBridge Bangladesh Admin Team";

    /**
     * Send email to user with optional attachments
     */
    public boolean sendEmailToUser(String toEmail, String subject, String content,
                                   String template, String adminName, List<MultipartFile> attachments) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(FROM_EMAIL, FROM_NAME);
            helper.setTo(toEmail);
            helper.setSubject(subject);

            // Build email content based on template
            String emailContent = buildEmailContent(content, template, adminName, toEmail);
            helper.setText(emailContent, true);

            // Add attachments if any
            if (attachments != null && !attachments.isEmpty()) {
                for (MultipartFile attachment : attachments) {
                    if (!attachment.isEmpty()) {
                        helper.addAttachment(attachment.getOriginalFilename(), attachment);
                    }
                }
            }

            mailSender.send(mimeMessage);
            System.out.println("Email sent successfully to: " + toEmail + " by admin: " + adminName);
            return true;

        } catch (Exception e) {
            System.err.println("Error sending email to user: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Build email content based on template
     */
    private String buildEmailContent(String content, String template, String adminName, String userEmail) {
        String templateContent = getTemplateContent(template, content, adminName);

        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Message from FoodBridge Bangladesh</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #4CAF50 0%%, #45a049 100%%); color: white; padding: 30px; text-align: center;">
                        <h1 style="margin: 0; font-size: 28px; font-weight: 700;">🍽️ FoodBridge Bangladesh</h1>
                        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Connecting Communities Through Food</p>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 40px 30px;">
                        %s
                        
                        <!-- Footer Message -->
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e0e0e0; text-align: center;">
                            <p style="margin: 0 0 5px 0; font-weight: 600; color: #333;">Best regards,</p>
                            <p style="margin: 0 0 5px 0; color: #4CAF50; font-weight: 600; font-size: 16px;">%s</p>
                            <p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">FoodBridge Bangladesh Admin Team</p>
                            
                            <div style="background: linear-gradient(135deg, #4CAF50, #45a049); color: white; padding: 15px; border-radius: 8px; display: inline-block; margin-top: 10px;">
                                <p style="margin: 0; font-size: 14px; font-weight: 500;">🌟 Together, we can eliminate food waste and fight hunger! 🌟</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background-color: #f8f9fa; padding: 25px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #e9ecef;">
                        <p style="margin: 0 0 8px 0; font-weight: 500;">This message was sent by FoodBridge Bangladesh Administration.</p>
                        <p style="margin: 0 0 10px 0;">If you have any questions, please contact our support team.</p>
                        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #dee2e6;">
                            <span style="color: #4CAF50; font-weight: 500;">📧</span> Email: support@foodbridgebd.org | 
                            <span style="color: #4CAF50; font-weight: 500;">🌐</span> Website: www.foodbridgebd.org |
                            <span style="color: #4CAF50; font-weight: 500;">📱</span> Phone: +880-XXX-XXXXX
                        </div>
                        <p style="margin: 15px 0 0 0; font-size: 11px; color: #999;">
                            Sent on %s
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """,
                templateContent,
                adminName,
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' hh:mm a"))
        );
    }

    /**
     * Get template content based on template type
     */
    private String getTemplateContent(String template, String content, String adminName) {
        return switch (template.toLowerCase()) {
            case "action_against_report" -> buildActionAgainstReportTemplate(content);
            case "welcome_message" -> buildWelcomeMessageTemplate(content);
            case "system_issues" -> buildSystemIssuesTemplate(content);
            case "account_verification" -> buildAccountVerificationTemplate(content);
            case "policy_update" -> buildPolicyUpdateTemplate(content);
            default -> buildCustomTemplate(content);
        };
    }

    /**
     * Action Against Report Template
     */
    private String buildActionAgainstReportTemplate(String content) {
        return String.format("""
            <div style="background: linear-gradient(135deg, #fff3cd 0%%, #ffeaa7 100%%); border-left: 5px solid #f39c12; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                <h2 style="margin: 0 0 15px 0; color: #e67e22; font-size: 22px; display: flex; align-items: center;">
                    ⚠️ Important Notice: Action Required
                </h2>
                <p style="margin: 0; color: #8b4513; font-size: 16px; line-height: 1.6;">
                    We have identified some concerns regarding your account activity that require your immediate attention.
                </p>
            </div>
            
            <div style="background-color: #ffffff; padding: 25px; border: 1px solid #e0e0e0; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">📋 Details:</h3>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #f39c12;">
                    %s
                </div>
            </div>
            
            <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; border: 1px solid #c3e6c3;">
                <h4 style="margin: 0 0 10px 0; color: #2e7d32; font-size: 16px;">🛡️ Next Steps:</h4>
                <ul style="margin: 0; padding-left: 20px; color: #2e7d32; line-height: 1.8;">
                    <li>Please review the details mentioned above</li>
                    <li>Contact our support team if you have any questions</li>
                    <li>Take appropriate action to resolve any issues</li>
                    <li>Reply to this email with your response</li>
                </ul>
            </div>
            """, content);
    }

    /**
     * Welcome Message Template
     */
    private String buildWelcomeMessageTemplate(String content) {
        return String.format("""
            <div style="background: linear-gradient(135deg, #e3f2fd 0%%, #bbdefb 100%%); border-left: 5px solid #2196f3; padding: 25px; border-radius: 8px; margin-bottom: 25px; text-align: center;">
                <h2 style="margin: 0 0 15px 0; color: #1976d2; font-size: 26px;">
                    🎉 Welcome to FoodBridge Bangladesh! 🎉
                </h2>
                <p style="margin: 0; color: #1565c0; font-size: 18px; line-height: 1.6;">
                    We're thrilled to have you join our mission to reduce food waste and help those in need!
                </p>
            </div>
            
            <div style="background-color: #ffffff; padding: 25px; border: 1px solid #e0e0e0; border-radius: 8px; margin-bottom: 25px;">
                <h3 style="margin: 0 0 20px 0; color: #333; font-size: 20px; text-align: center;">💝 Personal Message</h3>
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3; font-size: 16px; line-height: 1.7; color: #333;">
                    %s
                </div>
            </div>
            
            <div style="background: linear-gradient(135deg, #e8f5e8 0%%, #c8e6c8 100%%); padding: 25px; border-radius: 8px; border: 1px solid #4caf50;">
                <h4 style="margin: 0 0 15px 0; color: #2e7d32; font-size: 18px; text-align: center;">🚀 Get Started</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px;">
                    <div style="background: white; padding: 15px; border-radius: 6px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <div style="font-size: 24px; margin-bottom: 5px;">🍽️</div>
                        <div style="font-size: 14px; color: #2e7d32; font-weight: 500;">Donate Food</div>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 6px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <div style="font-size: 24px; margin-bottom: 5px;">🤝</div>
                        <div style="font-size: 14px; color: #2e7d32; font-weight: 500;">Find Food</div>
                    </div>
                </div>
            </div>
            """, content);
    }

    /**
     * System Issues Template
     */
    private String buildSystemIssuesTemplate(String content) {
        return String.format("""
            <div style="background: linear-gradient(135deg, #ffebee 0%%, #ffcdd2 100%%); border-left: 5px solid #f44336; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                <h2 style="margin: 0 0 15px 0; color: #d32f2f; font-size: 22px; display: flex; align-items: center;">
                    🔧 System Notification
                </h2>
                <p style="margin: 0; color: #c62828; font-size: 16px; line-height: 1.6;">
                    We want to inform you about some system-related updates or issues.
                </p>
            </div>
            
            <div style="background-color: #ffffff; padding: 25px; border: 1px solid #e0e0e0; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">📢 System Update Details:</h3>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #f44336;">
                    %s
                </div>
            </div>
            
            <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; border: 1px solid #ffb74d;">
                <h4 style="margin: 0 0 10px 0; color: #ef6c00; font-size: 16px;">💡 What you need to know:</h4>
                <ul style="margin: 0; padding-left: 20px; color: #ef6c00; line-height: 1.8;">
                    <li>Check for any service interruptions</li>
                    <li>Update your app if required</li>
                    <li>Contact support if you experience issues</li>
                    <li>Follow our updates for more information</li>
                </ul>
            </div>
            """, content);
    }

    /**
     * Account Verification Template
     */
    private String buildAccountVerificationTemplate(String content) {
        return String.format("""
            <div style="background: linear-gradient(135deg, #f3e5f5 0%%, #e1bee7 100%%); border-left: 5px solid #9c27b0; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                <h2 style="margin: 0 0 15px 0; color: #7b1fa2; font-size: 22px;">
                    ✅ Account Verification Update
                </h2>
                <p style="margin: 0; color: #8e24aa; font-size: 16px; line-height: 1.6;">
                    Important information regarding your account verification status.
                </p>
            </div>
            
            <div style="background-color: #ffffff; padding: 25px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #9c27b0;">
                    %s
                </div>
            </div>
            """, content);
    }

    /**
     * Policy Update Template
     */
    private String buildPolicyUpdateTemplate(String content) {
        return String.format("""
            <div style="background: linear-gradient(135deg, #e0f2f1 0%%, #b2dfdb 100%%); border-left: 5px solid #009688; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                <h2 style="margin: 0 0 15px 0; color: #00695c; font-size: 22px;">
                    📋 Policy Update Notification
                </h2>
                <p style="margin: 0; color: #00796b; font-size: 16px; line-height: 1.6;">
                    We have updated our terms and policies. Please review the changes below.
                </p>
            </div>
            
            <div style="background-color: #ffffff; padding: 25px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #009688;">
                    %s
                </div>
            </div>
            """, content);
    }

    /**
     * Custom Template
     */
    private String buildCustomTemplate(String content) {
        return String.format("""
            <div style="background: linear-gradient(135deg, #f5f5f5 0%%, #eeeeee 100%%); border-left: 5px solid #607d8b; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                <h2 style="margin: 0 0 15px 0; color: #455a64; font-size: 22px;">
                    📧 Message from Admin
                </h2>
            </div>
            
            <div style="background-color: #ffffff; padding: 25px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #607d8b; line-height: 1.7; font-size: 16px;">
                    %s
                </div>
            </div>
            """, content);
    }
}