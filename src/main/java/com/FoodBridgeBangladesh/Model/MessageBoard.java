package com.FoodBridgeBangladesh.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "message_board")
public class MessageBoard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "donor_id")
    private Long donorId;

    @Column(name = "merchant_id")
    private Long merchantId;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false)
    private String role;

    @Column(name = "file_name")
    private String fileName;

    @Lob
    @Column(name = "file_data")
    private byte[] fileData;

    @Column(name = "file_type")
    private String fileType;

    @Column(name = "file_size")
    private Long fileSize;

    // Read status and read timestamp
    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    @Column(name = "read_by")
    private String readBy;

    // NEW: Add ignore functionality for merchants
    @Column(name = "is_ignored_by_merchant", nullable = false)
    private Boolean isIgnoredByMerchant = false;

    @Column(name = "ignored_at")
    private LocalDateTime ignoredAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (isRead == null) {
            isRead = false;
        }
        if (isIgnoredByMerchant == null) {
            isIgnoredByMerchant = false;
        }
    }

    // Default constructor
    public MessageBoard() {
    }

    public MessageBoard(String email, String message, String subject, String role, Long merchantId, Long donorId) {
        this.email = email;
        this.message = message;
        this.subject = subject;
        this.role = role;
        this.merchantId = merchantId;
        this.donorId = donorId;
        this.isRead = false;
        this.isIgnoredByMerchant = false;
    }

    // Mark as read method
    public void markAsRead(String adminEmail) {
        this.isRead = true;
        this.readAt = LocalDateTime.now();
        this.readBy = adminEmail;
    }

    // NEW: Mark as ignored by merchant
    public void markAsIgnoredByMerchant() {
        this.isIgnoredByMerchant = true;
        this.ignoredAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMerchantId() {
        return merchantId;
    }

    public void setMerchantId(Long merchantId) {
        this.merchantId = merchantId;
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

    public byte[] getFileData() {
        return fileData;
    }

    public void setFileData(byte[] fileData) {
        this.fileData = fileData;
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

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }

    public LocalDateTime getReadAt() {
        return readAt;
    }

    public void setReadAt(LocalDateTime readAt) {
        this.readAt = readAt;
    }

    public String getReadBy() {
        return readBy;
    }

    public void setReadBy(String readBy) {
        this.readBy = readBy;
    }

    public Boolean getIsIgnoredByMerchant() {
        return isIgnoredByMerchant;
    }

    public void setIsIgnoredByMerchant(Boolean isIgnoredByMerchant) {
        this.isIgnoredByMerchant = isIgnoredByMerchant;
    }

    public LocalDateTime getIgnoredAt() {
        return ignoredAt;
    }

    public void setIgnoredAt(LocalDateTime ignoredAt) {
        this.ignoredAt = ignoredAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // Helper methods
    public boolean hasAttachment() {
        return fileName != null && !fileName.trim().isEmpty() && fileData != null && fileData.length > 0;
    }

    public Long getDonorId() {
        return donorId;
    }

    public void setDonorId(Long donorId) {
        this.donorId = donorId;
    }

    public Boolean getRead() {
        return isRead;
    }

    public void setRead(Boolean read) {
        isRead = read;
    }

    public Boolean getIgnoredByMerchant() {
        return isIgnoredByMerchant;
    }

    public void setIgnoredByMerchant(Boolean ignoredByMerchant) {
        isIgnoredByMerchant = ignoredByMerchant;
    }
}