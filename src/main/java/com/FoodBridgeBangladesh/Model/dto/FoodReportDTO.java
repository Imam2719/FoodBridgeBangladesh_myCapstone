package com.FoodBridgeBangladesh.Model.dto;

import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public class FoodReportDTO {

    private Long id;

    // Food Information
    @NotNull(message = "Food donation ID is required")
    private Long foodDonationId;
    private String foodName;
    private String foodDescription;
    private String foodCategory;
    private String foodQuantity;
    private String foodExpiryDate;
    private String foodLocation;
    private String foodImageBase64;
    private String foodImageContentType;

    // Donor Information
    private Long donorId;
    private String donorName;
    private String donorEmail;
    private String donorPhone;

    // Reporter Information
    @NotNull(message = "Reporter ID is required")
    private Long reporterId;
    private String reporterName;
    @NotBlank(message = "Reporter email is required")
    private String reporterEmail;
    private String reporterPhone;

    // Report Details
    @NotBlank(message = "Report reason is required")
    @Size(min = 10, max = 1000, message = "Report reason must be between 10 and 1000 characters")
    private String reportReason;
    @NotBlank(message = "Report category is required")
    private String reportCategory;

    // Evidence Files (for transfer)
    private MultipartFile evidenceFile1;
    private MultipartFile evidenceFile2;

    // Evidence File Information (for response)
    private String evidenceFile1Name;
    private String evidenceFile1Type;
    private String evidenceFile1Base64;
    private String evidenceFile2Name;
    private String evidenceFile2Type;
    private String evidenceFile2Base64;

    // Status and Metadata
    private String status;
    private Integer priority;
    private String adminNotes;
    private String resolutionNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
    private Long resolvedBy;

    // Default constructor
    public FoodReportDTO() {}

    // Constructor for creating from form data
    public FoodReportDTO(Long foodDonationId, Long reporterId, String reporterEmail,
                         String reportReason, String reportCategory) {
        this.foodDonationId = foodDonationId;
        this.reporterId = reporterId;
        this.reporterEmail = reporterEmail;
        this.reportReason = reportReason;
        this.reportCategory = reportCategory;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFoodDonationId() { return foodDonationId; }
    public void setFoodDonationId(Long foodDonationId) { this.foodDonationId = foodDonationId; }

    public String getFoodName() { return foodName; }
    public void setFoodName(String foodName) { this.foodName = foodName; }

    public String getFoodDescription() { return foodDescription; }
    public void setFoodDescription(String foodDescription) { this.foodDescription = foodDescription; }

    public String getFoodCategory() { return foodCategory; }
    public void setFoodCategory(String foodCategory) { this.foodCategory = foodCategory; }

    public String getFoodQuantity() { return foodQuantity; }
    public void setFoodQuantity(String foodQuantity) { this.foodQuantity = foodQuantity; }

    public String getFoodExpiryDate() { return foodExpiryDate; }
    public void setFoodExpiryDate(String foodExpiryDate) { this.foodExpiryDate = foodExpiryDate; }

    public String getFoodLocation() { return foodLocation; }
    public void setFoodLocation(String foodLocation) { this.foodLocation = foodLocation; }

    public String getFoodImageBase64() { return foodImageBase64; }
    public void setFoodImageBase64(String foodImageBase64) { this.foodImageBase64 = foodImageBase64; }

    public String getFoodImageContentType() { return foodImageContentType; }
    public void setFoodImageContentType(String foodImageContentType) { this.foodImageContentType = foodImageContentType; }

    public Long getDonorId() { return donorId; }
    public void setDonorId(Long donorId) { this.donorId = donorId; }

    public String getDonorName() { return donorName; }
    public void setDonorName(String donorName) { this.donorName = donorName; }

    public String getDonorEmail() { return donorEmail; }
    public void setDonorEmail(String donorEmail) { this.donorEmail = donorEmail; }

    public String getDonorPhone() { return donorPhone; }
    public void setDonorPhone(String donorPhone) { this.donorPhone = donorPhone; }

    public Long getReporterId() { return reporterId; }
    public void setReporterId(Long reporterId) { this.reporterId = reporterId; }

    public String getReporterName() { return reporterName; }
    public void setReporterName(String reporterName) { this.reporterName = reporterName; }

    public String getReporterEmail() { return reporterEmail; }
    public void setReporterEmail(String reporterEmail) { this.reporterEmail = reporterEmail; }

    public String getReporterPhone() { return reporterPhone; }
    public void setReporterPhone(String reporterPhone) { this.reporterPhone = reporterPhone; }

    public String getReportReason() { return reportReason; }
    public void setReportReason(String reportReason) { this.reportReason = reportReason; }

    public String getReportCategory() { return reportCategory; }
    public void setReportCategory(String reportCategory) { this.reportCategory = reportCategory; }

    public MultipartFile getEvidenceFile1() { return evidenceFile1; }
    public void setEvidenceFile1(MultipartFile evidenceFile1) { this.evidenceFile1 = evidenceFile1; }

    public MultipartFile getEvidenceFile2() { return evidenceFile2; }
    public void setEvidenceFile2(MultipartFile evidenceFile2) { this.evidenceFile2 = evidenceFile2; }

    public String getEvidenceFile1Name() { return evidenceFile1Name; }
    public void setEvidenceFile1Name(String evidenceFile1Name) { this.evidenceFile1Name = evidenceFile1Name; }

    public String getEvidenceFile1Type() { return evidenceFile1Type; }
    public void setEvidenceFile1Type(String evidenceFile1Type) { this.evidenceFile1Type = evidenceFile1Type; }

    public String getEvidenceFile1Base64() { return evidenceFile1Base64; }
    public void setEvidenceFile1Base64(String evidenceFile1Base64) { this.evidenceFile1Base64 = evidenceFile1Base64; }

    public String getEvidenceFile2Name() { return evidenceFile2Name; }
    public void setEvidenceFile2Name(String evidenceFile2Name) { this.evidenceFile2Name = evidenceFile2Name; }

    public String getEvidenceFile2Type() { return evidenceFile2Type; }
    public void setEvidenceFile2Type(String evidenceFile2Type) { this.evidenceFile2Type = evidenceFile2Type; }

    public String getEvidenceFile2Base64() { return evidenceFile2Base64; }
    public void setEvidenceFile2Base64(String evidenceFile2Base64) { this.evidenceFile2Base64 = evidenceFile2Base64; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getPriority() { return priority; }
    public void setPriority(Integer priority) { this.priority = priority; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }

    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }

    public Long getResolvedBy() { return resolvedBy; }
    public void setResolvedBy(Long resolvedBy) { this.resolvedBy = resolvedBy; }

    // Response DTO without file data (for listing)
    public static class FoodReportResponseDTO {
        private Long id;
        private Long foodDonationId;
        private String foodName;
        private String reportReason;
        private String reportCategory;
        private String status;
        private String reporterName;
        private String reporterEmail;
        private LocalDateTime createdAt;
        private boolean hasEvidenceFiles;

        public FoodReportResponseDTO() {}

        public FoodReportResponseDTO(Long id, Long foodDonationId, String foodName, String reportReason,
                                     String reportCategory, String status, String reporterName, String reporterEmail,
                                     LocalDateTime createdAt, boolean hasEvidenceFiles) {
            this.id = id;
            this.foodDonationId = foodDonationId;
            this.foodName = foodName;
            this.reportReason = reportReason;
            this.reportCategory = reportCategory;
            this.status = status;
            this.reporterName = reporterName;
            this.reporterEmail = reporterEmail;
            this.createdAt = createdAt;
            this.hasEvidenceFiles = hasEvidenceFiles;
        }

        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Long getFoodDonationId() { return foodDonationId; }
        public void setFoodDonationId(Long foodDonationId) { this.foodDonationId = foodDonationId; }

        public String getFoodName() { return foodName; }
        public void setFoodName(String foodName) { this.foodName = foodName; }

        public String getReportReason() { return reportReason; }
        public void setReportReason(String reportReason) { this.reportReason = reportReason; }

        public String getReportCategory() { return reportCategory; }
        public void setReportCategory(String reportCategory) { this.reportCategory = reportCategory; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public String getReporterName() { return reporterName; }
        public void setReporterName(String reporterName) { this.reporterName = reporterName; }

        public String getReporterEmail() { return reporterEmail; }
        public void setReporterEmail(String reporterEmail) { this.reporterEmail = reporterEmail; }

        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

        public boolean isHasEvidenceFiles() { return hasEvidenceFiles; }
        public void setHasEvidenceFiles(boolean hasEvidenceFiles) { this.hasEvidenceFiles = hasEvidenceFiles; }
    }

    // Summary DTO for dashboard
    public static class FoodReportSummaryDTO {
        private Long totalReports;
        private Long pendingReports;
        private Long resolvedReports;
        private Long userReports; // Reports by current user

        public FoodReportSummaryDTO() {}

        public FoodReportSummaryDTO(Long totalReports, Long pendingReports, Long resolvedReports, Long userReports) {
            this.totalReports = totalReports;
            this.pendingReports = pendingReports;
            this.resolvedReports = resolvedReports;
            this.userReports = userReports;
        }

        // Getters and Setters
        public Long getTotalReports() { return totalReports; }
        public void setTotalReports(Long totalReports) { this.totalReports = totalReports; }

        public Long getPendingReports() { return pendingReports; }
        public void setPendingReports(Long pendingReports) { this.pendingReports = pendingReports; }

        public Long getResolvedReports() { return resolvedReports; }
        public void setResolvedReports(Long resolvedReports) { this.resolvedReports = resolvedReports; }

        public Long getUserReports() { return userReports; }
        public void setUserReports(Long userReports) { this.userReports = userReports; }
    }

}