package com.FoodBridgeBangladesh.Model.dto;

import org.springframework.web.multipart.MultipartFile;

public class MessageBoardDTO {
    private Long id;
    private String email;
    private String message;
    private String subject;
    private String role;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private String createdAt;

    // NEW: Read status fields
    private Boolean isRead;
    private String readAt;
    private String readBy;

    // For file upload
    private MultipartFile attachment;

    // Default constructor
    public MessageBoardDTO() {
    }

    // Constructor for repository query response (without file data and attachment)
    public MessageBoardDTO(Long id, String email, String message, String subject, String role,
                           String fileName, String fileType, Long fileSize, String createdAt) {
        this.id = id;
        this.email = email;
        this.message = message;
        this.subject = subject;
        this.role = role;
        this.fileName = fileName;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.createdAt = createdAt;
        this.isRead = false; // Default to unread
    }

    // Constructor with read status
    public MessageBoardDTO(Long id, String email, String message, String subject, String role,
                           String fileName, String fileType, Long fileSize, String createdAt,
                           Boolean isRead, String readAt, String readBy) {
        this.id = id;
        this.email = email;
        this.message = message;
        this.subject = subject;
        this.role = role;
        this.fileName = fileName;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.createdAt = createdAt;
        this.isRead = isRead;
        this.readAt = readAt;
        this.readBy = readBy;
    }

    // Full constructor with attachment
    public MessageBoardDTO(Long id, String email, String message, String subject, String role,
                           String fileName, String fileType, Long fileSize, String createdAt,
                           Boolean isRead, String readAt, String readBy, MultipartFile attachment) {
        this.id = id;
        this.email = email;
        this.message = message;
        this.subject = subject;
        this.role = role;
        this.fileName = fileName;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.createdAt = createdAt;
        this.isRead = isRead;
        this.readAt = readAt;
        this.readBy = readBy;
        this.attachment = attachment;
    }

    // Helper methods
    public boolean hasAttachment() {
        return fileName != null && !fileName.trim().isEmpty();
    }

    public String getReadStatusDisplay() {
        return isRead != null && isRead ? "Read" : "Unread";
    }

    public String getAttachmentSizeFormatted() {
        if (fileSize == null) return "No attachment";

        if (fileSize < 1024) {
            return fileSize + " B";
        } else if (fileSize < 1024 * 1024) {
            return String.format("%.1f KB", fileSize / 1024.0);
        } else {
            return String.format("%.1f MB", fileSize / (1024.0 * 1024.0));
        }
    }

    public String getShortMessage(int maxLength) {
        if (message == null) return "";
        if (message.length() <= maxLength) return message;
        return message.substring(0, maxLength) + "...";
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }

    public String getReadAt() {
        return readAt;
    }

    public void setReadAt(String readAt) {
        this.readAt = readAt;
    }

    public String getReadBy() {
        return readBy;
    }

    public void setReadBy(String readBy) {
        this.readBy = readBy;
    }

    public MultipartFile getAttachment() {
        return attachment;
    }

    public void setAttachment(MultipartFile attachment) {
        this.attachment = attachment;
    }
}