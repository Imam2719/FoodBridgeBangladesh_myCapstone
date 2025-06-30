package com.FoodBridgeBangladesh.Model.receiver;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "food_reports")
public class FoodReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Food Information (copied from original food donation)
    @Column(name = "food_donation_id", nullable = false)
    private Long foodDonationId;

    @Column(name = "food_name", nullable = false)
    private String foodName;

    @Column(name = "food_description", length = 2000)
    private String foodDescription;

    @Column(name = "food_category")
    private String foodCategory;

    @Column(name = "food_quantity")
    private String foodQuantity;

    @Column(name = "food_expiry_date")
    private String foodExpiryDate;

    @Column(name = "food_location", length = 500)
    private String foodLocation;

    // FIXED: Remove columnDefinition for PostgreSQL compatibility
    @Lob
    @Column(name = "food_image_data")
    private byte[] foodImageData;

    @Column(name = "food_image_content_type")
    private String foodImageContentType;

    // Donor Information
    @Column(name = "donor_id")
    private Long donorId;

    @Column(name = "donor_name")
    private String donorName;

    @Column(name = "donor_email")
    private String donorEmail;

    @Column(name = "donor_phone")
    private String donorPhone;

    // Reporter Information
    @Column(name = "reporter_id", nullable = false)
    private Long reporterId;

    @Column(name = "reporter_name")
    private String reporterName;

    @Column(name = "reporter_email", nullable = false)
    private String reporterEmail;

    @Column(name = "reporter_phone")
    private String reporterPhone;

    // Report Details
    @Column(name = "report_reason", nullable = false, length = 1000)
    private String reportReason;

    @Column(name = "report_category")
    private String reportCategory; // QUALITY_ISSUE, FRAUD, INAPPROPRIATE_CONTENT, SAFETY_CONCERN, OTHER

    // Evidence Files (Optional) - FIXED: Remove columnDefinition for PostgreSQL
    @Lob
    @Column(name = "evidence_file_1")
    private byte[] evidenceFile1;

    @Column(name = "evidence_file_1_name")
    private String evidenceFile1Name;

    @Column(name = "evidence_file_1_type")
    private String evidenceFile1Type;

    @Lob
    @Column(name = "evidence_file_2")
    private byte[] evidenceFile2;

    @Column(name = "evidence_file_2_name")
    private String evidenceFile2Name;

    @Column(name = "evidence_file_2_type")
    private String evidenceFile2Type;

    // Report Status and Metadata
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ReportStatus status = ReportStatus.PENDING;

    @Column(name = "priority")
    private Integer priority = 1; // 1-5, where 5 is highest priority

    @Column(name = "admin_notes", length = 2000)
    private String adminNotes;

    @Column(name = "resolution_notes", length = 2000)
    private String resolutionNotes;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "resolved_by")
    private Long resolvedBy; // Admin ID who resolved the report

    // Enum for Report Status
    public enum ReportStatus {
        PENDING,
        UNDER_REVIEW,
        RESOLVED,
        DISMISSED,
        ESCALATED
    }

    // Default constructor
    public FoodReport() {}

    // Constructor with required fields
    public FoodReport(Long foodDonationId, Long donorId, Long reporterId, String reporterEmail,
                      String reportReason, String reportCategory) {
        this.foodDonationId = foodDonationId;
        this.donorId = donorId;
        this.reporterId = reporterId;
        this.reporterEmail = reporterEmail;
        this.reportReason = reportReason;
        this.reportCategory = reportCategory;
    }

    // Utility method to update timestamp
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
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

    public byte[] getFoodImageData() { return foodImageData; }
    public void setFoodImageData(byte[] foodImageData) { this.foodImageData = foodImageData; }

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

    public byte[] getEvidenceFile1() { return evidenceFile1; }
    public void setEvidenceFile1(byte[] evidenceFile1) { this.evidenceFile1 = evidenceFile1; }

    public String getEvidenceFile1Name() { return evidenceFile1Name; }
    public void setEvidenceFile1Name(String evidenceFile1Name) { this.evidenceFile1Name = evidenceFile1Name; }

    public String getEvidenceFile1Type() { return evidenceFile1Type; }
    public void setEvidenceFile1Type(String evidenceFile1Type) { this.evidenceFile1Type = evidenceFile1Type; }

    public byte[] getEvidenceFile2() { return evidenceFile2; }
    public void setEvidenceFile2(byte[] evidenceFile2) { this.evidenceFile2 = evidenceFile2; }

    public String getEvidenceFile2Name() { return evidenceFile2Name; }
    public void setEvidenceFile2Name(String evidenceFile2Name) { this.evidenceFile2Name = evidenceFile2Name; }

    public String getEvidenceFile2Type() { return evidenceFile2Type; }
    public void setEvidenceFile2Type(String evidenceFile2Type) { this.evidenceFile2Type = evidenceFile2Type; }

    public ReportStatus getStatus() { return status; }
    public void setStatus(ReportStatus status) { this.status = status; }

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

}