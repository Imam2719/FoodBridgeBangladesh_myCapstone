package com.FoodBridgeBangladesh.Model.admin.dto;

import org.springframework.web.multipart.MultipartFile;

public class AdminEmailDto {

    private Long senderAdminId;
    private Long recipientAdminId;
    private String subject;
    private String content;
    private String template;
    private MultipartFile attachment;

    // Default constructor
    public AdminEmailDto() {}

    // Constructor with required fields
    public AdminEmailDto(Long senderAdminId, Long recipientAdminId, String subject, String content) {
        this.senderAdminId = senderAdminId;
        this.recipientAdminId = recipientAdminId;
        this.subject = subject;
        this.content = content;
    }

    // Getters and Setters
    public Long getSenderAdminId() {
        return senderAdminId;
    }

    public void setSenderAdminId(Long senderAdminId) {
        this.senderAdminId = senderAdminId;
    }

    public Long getRecipientAdminId() {
        return recipientAdminId;
    }

    public void setRecipientAdminId(Long recipientAdminId) {
        this.recipientAdminId = recipientAdminId;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTemplate() {
        return template;
    }

    public void setTemplate(String template) {
        this.template = template;
    }

    public MultipartFile getAttachment() {
        return attachment;
    }

    public void setAttachment(MultipartFile attachment) {
        this.attachment = attachment;
    }

    /**
     * Email Template inner class
     */
    public static class EmailTemplate {
        private String subject;
        private String content;

        public EmailTemplate() {}

        public EmailTemplate(String subject, String content) {
            this.subject = subject;
            this.content = content;
        }

        public String getSubject() {
            return subject;
        }

        public void setSubject(String subject) {
            this.subject = subject;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }
    }

    /**
     * Email History Response inner class
     */
    public static class EmailHistoryResponse {
        private Long id;
        private String senderName;
        private String senderEmail;
        private String recipientName;
        private String recipientEmail;
        private String subject;
        private String content;
        private String template;
        private boolean hasAttachment;
        private String attachmentName;
        private String sentAt;
        private String status;

        // Default constructor
        public EmailHistoryResponse() {}

        // Getters and Setters
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getSenderName() {
            return senderName;
        }

        public void setSenderName(String senderName) {
            this.senderName = senderName;
        }

        public String getSenderEmail() {
            return senderEmail;
        }

        public void setSenderEmail(String senderEmail) {
            this.senderEmail = senderEmail;
        }

        public String getRecipientName() {
            return recipientName;
        }

        public void setRecipientName(String recipientName) {
            this.recipientName = recipientName;
        }

        public String getRecipientEmail() {
            return recipientEmail;
        }

        public void setRecipientEmail(String recipientEmail) {
            this.recipientEmail = recipientEmail;
        }

        public String getSubject() {
            return subject;
        }

        public void setSubject(String subject) {
            this.subject = subject;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public String getTemplate() {
            return template;
        }

        public void setTemplate(String template) {
            this.template = template;
        }

        public boolean isHasAttachment() {
            return hasAttachment;
        }

        public void setHasAttachment(boolean hasAttachment) {
            this.hasAttachment = hasAttachment;
        }

        public String getAttachmentName() {
            return attachmentName;
        }

        public void setAttachmentName(String attachmentName) {
            this.attachmentName = attachmentName;
        }

        public String getSentAt() {
            return sentAt;
        }

        public void setSentAt(String sentAt) {
            this.sentAt = sentAt;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }

    @Override
    public String toString() {
        return "AdminEmailDto{" +
                "senderAdminId=" + senderAdminId +
                ", recipientAdminId=" + recipientAdminId +
                ", subject='" + subject + '\'' +
                ", content='" + content + '\'' +
                ", template='" + template + '\'' +
                ", hasAttachment=" + (attachment != null && !attachment.isEmpty()) +
                '}';
    }
}