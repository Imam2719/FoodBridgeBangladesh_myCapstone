package com.FoodBridgeBangladesh.Service.admin;

import com.FoodBridgeBangladesh.Model.MessageBoard;
import com.FoodBridgeBangladesh.Repository.MessageBoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
@Transactional
public class AdminMessageReplyService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private MessageBoardRepository messageRepository;

    private static final String FROM_EMAIL = "sfms0674@gmail.com";
    private static final String FROM_NAME = "FoodBridge Bangladesh Admin Team";

    /**
     * Send reply to a message via email
     */
    public boolean sendReplyToMessage(Long messageId, String replyContent, String adminEmail, String adminName) {
        try {
            // Get the original message
            Optional<MessageBoard> messageOpt = messageRepository.findById(messageId);
            if (messageOpt.isEmpty()) {
                System.err.println("Message not found with ID: " + messageId);
                return false;
            }

            MessageBoard originalMessage = messageOpt.get();

            // Create and send email
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(FROM_EMAIL, FROM_NAME);
            helper.setTo(originalMessage.getEmail());
            helper.setSubject("Re: " + originalMessage.getSubject());
            helper.setText(buildHtmlEmailContent(originalMessage, replyContent, adminName), true);

            mailSender.send(mimeMessage);

            System.out.println("Reply sent successfully to: " + originalMessage.getEmail() + " by admin: " + adminEmail);
            return true;

        } catch (Exception e) {
            System.err.println("Error sending reply email: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Send simple reply (text only)
     */
    public boolean sendSimpleReply(String toEmail, String subject, String replyContent, String adminName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(FROM_EMAIL);
            message.setTo(toEmail);
            message.setSubject("Re: " + subject);
            message.setText(buildTextEmailContent(replyContent, adminName));

            mailSender.send(message);

            System.out.println("Simple reply sent successfully to: " + toEmail);
            return true;

        } catch (Exception e) {
            System.err.println("Error sending simple reply: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Send custom reply with custom subject and content
     */
    public boolean sendCustomReply(String toEmail, String customSubject, String replyContent, String adminName) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(FROM_EMAIL, FROM_NAME);
            helper.setTo(toEmail);
            helper.setSubject(customSubject);
            helper.setText(buildCustomHtmlContent(replyContent, adminName), true);

            mailSender.send(mimeMessage);

            System.out.println("Custom reply sent successfully to: " + toEmail + " by admin: " + adminName);
            return true;

        } catch (Exception e) {
            System.err.println("Error sending custom reply: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Build HTML email content for reply
     */
    private String buildHtmlEmailContent(MessageBoard originalMessage, String replyContent, String adminName) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' hh:mm a");
        String formattedDate = originalMessage.getCreatedAt().format(formatter);

        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reply from FoodBridge Bangladesh</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #4CAF50 0%%, #45a049 100%%); color: white; padding: 30px; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px; font-weight: 600;">🍽️ FoodBridge Bangladesh</h1>
                        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Connecting Communities Through Food</p>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 30px;">
                        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #4CAF50;">
                            <h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px;">Thank you for contacting us!</h3>
                            <p style="margin: 0; color: #666; line-height: 1.6;">We have received your message and our admin team has provided a response below.</p>
                        </div>
                        
                        <!-- Original Message Reference -->
                        <div style="background-color: #e3f2fd; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                            <p style="margin: 0 0 8px 0; font-weight: 600; color: #1976d2; font-size: 14px;">📧 Your Original Message (sent on %s):</p>
                            <p style="margin: 0; color: #424242; font-style: italic; line-height: 1.5;">"%s"</p>
                        </div>
                        
                        <!-- Admin Reply -->
                        <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; margin-bottom: 25px;">
                            <p style="margin: 0 0 15px 0; font-weight: 600; color: #4CAF50; font-size: 16px;">💬 Our Response:</p>
                            <div style="line-height: 1.7; color: #333;">
                                %s
                            </div>
                        </div>
                        
                        <!-- Contact Information -->
                        <div style="background-color: #f1f8e9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                            <h4 style="margin: 0 0 10px 0; color: #388e3c;">Need Further Assistance?</h4>
                            <p style="margin: 0; color: #555; line-height: 1.6;">
                                If you have any additional questions or concerns, please don't hesitate to reach out to us again. 
                                We're here to help bridge the gap between food surplus and food need in Bangladesh.
                            </p>
                        </div>
                        
                        <!-- Signature -->
                        <div style="border-top: 2px solid #e0e0e0; padding-top: 20px; text-align: center;">
                            <p style="margin: 0 0 5px 0; font-weight: 600; color: #333;">Best regards,</p>
                            <p style="margin: 0 0 5px 0; color: #4CAF50; font-weight: 600;">%s</p>
                            <p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">FoodBridge Bangladesh Admin Team</p>
                            
                            <div style="background-color: #4CAF50; color: white; padding: 10px; border-radius: 5px; display: inline-block;">
                                <p style="margin: 0; font-size: 12px;">🌟 Together, we can eliminate food waste and fight hunger! 🌟</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background-color: #f5f5f5; padding: 20px; text-align: center; color: #777; font-size: 12px;">
                        <p style="margin: 0 0 5px 0;">This is an automated response from FoodBridge Bangladesh.</p>
                        <p style="margin: 0;">Please do not reply directly to this email.</p>
                        <div style="margin-top: 10px;">
                            <span style="color: #4CAF50;">📧</span> Contact us: support@foodbridgebd.org | 
                            <span style="color: #4CAF50;">🌐</span> Visit: www.foodbridgebd.org
                        </div>
                    </div>
                </div>
            </body>
            </html>
            """,
                formattedDate,
                truncateMessage(originalMessage.getMessage(), 150),
                formatReplyContent(replyContent),
                adminName
        );
    }

    /**
     * Build text email content (fallback)
     */
    private String buildTextEmailContent(String replyContent, String adminName) {
        return String.format("""
            Dear User,
            
            Thank you for contacting FoodBridge Bangladesh. Here is our response to your message:
            
            %s
            
            If you have any further questions, please don't hesitate to contact us.
            
            Best regards,
            %s
            FoodBridge Bangladesh Admin Team
            
            ---
            This is an automated response. Please do not reply to this email.
            Contact us: support@foodbridgebd.org
            """,
                replyContent,
                adminName
        );
    }

    /**
     * Build custom HTML content
     */
    private String buildCustomHtmlContent(String replyContent, String adminName) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #4CAF50 0%%, #45a049 100%%); color: white; padding: 20px; text-align: center;">
                    <h2 style="margin: 0;">🍽️ FoodBridge Bangladesh</h2>
                </div>
                
                <div style="padding: 30px; background: #f9f9f9;">
                    <div style="background: white; padding: 20px; border-radius: 8px;">
                        %s
                    </div>
                    
                    <div style="margin-top: 20px; text-align: center; color: #666;">
                        <p><strong>Best regards,</strong><br>%s<br>FoodBridge Bangladesh</p>
                    </div>
                </div>
            </body>
            </html>
            """,
                formatReplyContent(replyContent),
                adminName
        );
    }

    /**
     * Format reply content to preserve line breaks and basic formatting
     */
    private String formatReplyContent(String content) {
        if (content == null) return "";

        return content
                .replace("\n", "<br>")
                .replace("\r\n", "<br>")
                .replace("\r", "<br>");
    }

    /**
     * Truncate message for display in email
     */
    private String truncateMessage(String message, int maxLength) {
        if (message == null) return "";
        if (message.length() <= maxLength) return message;
        return message.substring(0, maxLength) + "...";
    }

    /**
     * Validate email address format
     */
    private boolean isValidEmail(String email) {
        return email != null && email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    }

    /**
     * Get message by ID for reply context
     */
    public Optional<MessageBoard> getMessageForReply(Long messageId) {
        return messageRepository.findById(messageId);
    }

    /**
     * Send acknowledgment email (when message is first received)
     */
    public boolean sendAcknowledgmentEmail(String toEmail, String subject) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(FROM_EMAIL, FROM_NAME);
            helper.setTo(toEmail);
            helper.setSubject("Message Received - " + subject);
            helper.setText(buildAcknowledgmentContent(), true);

            mailSender.send(mimeMessage);
            return true;

        } catch (Exception e) {
            System.err.println("Error sending acknowledgment: " + e.getMessage());
            return false;
        }
    }

    /**
     * Build acknowledgment email content
     */
    private String buildAcknowledgmentContent() {
        return """
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #4CAF50; color: white; padding: 20px; text-align: center;">
                    <h2>🍽️ FoodBridge Bangladesh</h2>
                    <p>Message Received Successfully</p>
                </div>
                
                <div style="padding: 20px;">
                    <p>Dear User,</p>
                    
                    <p>Thank you for contacting FoodBridge Bangladesh. We have successfully received your message.</p>
                    
                    <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 0;"><strong>✅ Your message has been received and is being reviewed by our admin team.</strong></p>
                    </div>
                    
                    <p>We typically respond within 24-48 hours during business days. If your matter is urgent, please contact us directly.</p>
                    
                    <p>Best regards,<br>FoodBridge Bangladesh Team</p>
                </div>
            </body>
            </html>
            """;
    }
}