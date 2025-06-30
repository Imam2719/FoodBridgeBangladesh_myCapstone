package com.FoodBridgeBangladesh.Service.receiver;

import com.FoodBridgeBangladesh.Model.dto.FoodReportDTO;
import com.FoodBridgeBangladesh.Model.receiver.FoodReport;
import com.FoodBridgeBangladesh.Repository.receiver.FoodReportRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class FoodReportService {

    private static final Logger log = LoggerFactory.getLogger(FoodReportService.class);
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final List<String> ALLOWED_FILE_TYPES = Arrays.asList(
            "image/jpeg", "image/png", "image/gif", "image/webp",
            "application/pdf", "text/plain", "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    private final FoodReportRepository foodReportRepository;

    @Autowired
    public FoodReportService(FoodReportRepository foodReportRepository) {
        this.foodReportRepository = foodReportRepository;
    }

    /**
     * Submit a new food report
     */
    public FoodReportDTO submitReport(FoodReportDTO reportDTO) {
        log.info("Submitting food report for food ID: {} by user: {}",
                reportDTO.getFoodDonationId(), reportDTO.getReporterId());

        // Check for duplicate reports
        if (isDuplicateReport(reportDTO.getFoodDonationId(), reportDTO.getReporterId())) {
            throw new IllegalStateException("You have already reported this food item recently");
        }

        // Validate and process the report
        FoodReport report = convertToEntity(reportDTO);

        // Set default values
        if (report.getStatus() == null) {
            report.setStatus(FoodReport.ReportStatus.PENDING);
        }
        if (report.getPriority() == null) {
            report.setPriority(calculatePriority(reportDTO.getReportCategory()));
        }

        // Process evidence files
        processEvidenceFiles(report, reportDTO);

        // Save the report
        FoodReport savedReport = foodReportRepository.save(report);
        log.info("Food report submitted successfully with ID: {}", savedReport.getId());

        return convertToDTO(savedReport);
    }

    /**
     * Get reports by user ID
     */
    @Transactional(readOnly = true)
    public List<FoodReportDTO.FoodReportResponseDTO> getReportsByUser(Long userId) {
        List<FoodReport> reports = foodReportRepository.findByReporterIdOrderByCreatedAtDesc(userId);
        return reports.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get paginated reports by user
     */
    @Transactional(readOnly = true)
    public Page<FoodReportDTO.FoodReportResponseDTO> getReportsByUser(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<FoodReport> reportPage = foodReportRepository.findByReporterIdOrderByCreatedAtDesc(userId, pageable);
        return reportPage.map(this::convertToResponseDTO);
    }

    /**
     * Get report by ID
     */
    @Transactional(readOnly = true)
    public Optional<FoodReportDTO> getReportById(Long reportId) {
        return foodReportRepository.findById(reportId)
                .map(this::convertToDTO);
    }

    /**
     * Get reports by status
     */
    @Transactional(readOnly = true)
    public List<FoodReportDTO.FoodReportResponseDTO> getReportsByStatus(String status) {
        FoodReport.ReportStatus reportStatus = FoodReport.ReportStatus.valueOf(status.toUpperCase());
        List<FoodReport> reports = foodReportRepository.findByStatusOrderByCreatedAtDesc(reportStatus);
        return reports.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get reports summary
     */
    @Transactional(readOnly = true)
    public FoodReportDTO.FoodReportSummaryDTO getReportsSummary(Long userId) {
        Object[] summary = foodReportRepository.getReportsSummary(userId);
        if (summary != null && summary.length > 0) {
            return new FoodReportDTO.FoodReportSummaryDTO(
                    ((Number) summary[0]).longValue(), // totalReports
                    ((Number) summary[1]).longValue(), // pendingReports
                    ((Number) summary[2]).longValue(), // resolvedReports
                    ((Number) summary[3]).longValue()  // userReports
            );
        }
        return new FoodReportDTO.FoodReportSummaryDTO(0L, 0L, 0L, 0L);
    }

    /**
     * Update report status (Admin function)
     */
    public FoodReportDTO updateReportStatus(Long reportId, String newStatus, String adminNotes, Long adminId) {
        log.info("Updating report {} status to {} by admin {}", reportId, newStatus, adminId);

        FoodReport report = foodReportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("Report not found with ID: " + reportId));

        FoodReport.ReportStatus status = FoodReport.ReportStatus.valueOf(newStatus.toUpperCase());
        report.setStatus(status);
        report.setAdminNotes(adminNotes);
        report.setUpdatedAt(LocalDateTime.now());

        if (status == FoodReport.ReportStatus.RESOLVED || status == FoodReport.ReportStatus.DISMISSED) {
            report.setResolvedAt(LocalDateTime.now());
            report.setResolvedBy(adminId);
        }

        FoodReport savedReport = foodReportRepository.save(report);
        return convertToDTO(savedReport);
    }

    /**
     * Delete report (Admin function)
     */
    public void deleteReport(Long reportId) {
        log.info("Deleting report with ID: {}", reportId);
        if (!foodReportRepository.existsById(reportId)) {
            throw new IllegalArgumentException("Report not found with ID: " + reportId);
        }
        foodReportRepository.deleteById(reportId);
    }

    /**
     * Search reports
     */
    @Transactional(readOnly = true)
    public List<FoodReportDTO.FoodReportResponseDTO> searchReports(String keyword) {
        List<FoodReport> reports = foodReportRepository.searchReports(keyword);
        return reports.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Check if user has already reported this food item recently
     */
    private boolean isDuplicateReport(Long foodDonationId, Long reporterId) {
        LocalDateTime timeWindow = LocalDateTime.now().minusHours(24); // 24-hour window
        Long count = foodReportRepository.countRecentDuplicateReports(foodDonationId, reporterId, timeWindow);
        return count != null && count > 0;
    }

    /**
     * Calculate report priority based on category
     */
    private Integer calculatePriority(String category) {
        if (category == null) {
            return 1;
        }

        switch (category.toUpperCase()) {
            case "SAFETY_CONCERN":
                return 5;
            case "FRAUD":
                return 4;
            case "QUALITY_ISSUE":
                return 3;
            case "INAPPROPRIATE_CONTENT":
                return 2;
            default:
                return 1;
        }
    }

    /**
     * Process evidence files
     */
    private void processEvidenceFiles(FoodReport report, FoodReportDTO reportDTO) {
        try {
            if (reportDTO.getEvidenceFile1() != null && !reportDTO.getEvidenceFile1().isEmpty()) {
                validateFile(reportDTO.getEvidenceFile1());
                report.setEvidenceFile1(reportDTO.getEvidenceFile1().getBytes());
                report.setEvidenceFile1Name(reportDTO.getEvidenceFile1().getOriginalFilename());
                report.setEvidenceFile1Type(reportDTO.getEvidenceFile1().getContentType());
            }

            if (reportDTO.getEvidenceFile2() != null && !reportDTO.getEvidenceFile2().isEmpty()) {
                validateFile(reportDTO.getEvidenceFile2());
                report.setEvidenceFile2(reportDTO.getEvidenceFile2().getBytes());
                report.setEvidenceFile2Name(reportDTO.getEvidenceFile2().getOriginalFilename());
                report.setEvidenceFile2Type(reportDTO.getEvidenceFile2().getContentType());
            }
        } catch (IOException e) {
            log.error("Error processing evidence files", e);
            throw new RuntimeException("Failed to process evidence files", e);
        }
    }
    /**
     * Get all reports with pagination (Admin)
     */
    @Transactional(readOnly = true)
    public Page<FoodReportDTO.FoodReportResponseDTO> getAllReportsPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<FoodReport> reportPage = foodReportRepository.findAll(pageable);
        return reportPage.map(this::convertToResponseDTO);
    }

    /**
     * Get reports by status with pagination (Admin)
     */
    @Transactional(readOnly = true)
    public Page<FoodReportDTO.FoodReportResponseDTO> getReportsByStatusPaginated(String status, int page, int size) {
        FoodReport.ReportStatus reportStatus = FoodReport.ReportStatus.valueOf(status.toUpperCase());
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<FoodReport> reportPage = foodReportRepository.findByStatusOrderByCreatedAtDesc(reportStatus, pageable);
        return reportPage.map(this::convertToResponseDTO);
    }

    /**
     * Get admin reports statistics
     */
    @Transactional(readOnly = true)
    public Map<String, Long> getAdminReportsStats() {
        Map<String, Long> stats = new HashMap<>();

        stats.put("totalReports", foodReportRepository.count());
        stats.put("pendingReports", foodReportRepository.countByStatus(FoodReport.ReportStatus.PENDING));
        stats.put("underReviewReports", foodReportRepository.countByStatus(FoodReport.ReportStatus.UNDER_REVIEW));
        stats.put("resolvedReports", foodReportRepository.countByStatus(FoodReport.ReportStatus.RESOLVED));
        stats.put("dismissedReports", foodReportRepository.countByStatus(FoodReport.ReportStatus.DISMISSED));
        stats.put("escalatedReports", foodReportRepository.countByStatus(FoodReport.ReportStatus.ESCALATED));

        return stats;
    }
    /**
     * Validate uploaded file
     */
    private void validateFile(MultipartFile file) {
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds maximum limit of 10MB");
        }

        if (!ALLOWED_FILE_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException("File type not allowed: " + file.getContentType());
        }
    }

    /**
     * Convert entity to DTO
     */
    private FoodReportDTO convertToDTO(FoodReport report) {
        FoodReportDTO dto = new FoodReportDTO();
        dto.setId(report.getId());
        dto.setFoodDonationId(report.getFoodDonationId());
        dto.setFoodName(report.getFoodName());
        dto.setFoodDescription(report.getFoodDescription());
        dto.setFoodCategory(report.getFoodCategory());
        dto.setFoodQuantity(report.getFoodQuantity());
        dto.setFoodExpiryDate(report.getFoodExpiryDate());
        dto.setFoodLocation(report.getFoodLocation());

        // Convert food image to base64
        if (report.getFoodImageData() != null) {
            dto.setFoodImageBase64(Base64.getEncoder().encodeToString(report.getFoodImageData()));
            dto.setFoodImageContentType(report.getFoodImageContentType());
        }

        dto.setDonorId(report.getDonorId());
        dto.setDonorName(report.getDonorName());
        dto.setDonorEmail(report.getDonorEmail());
        dto.setDonorPhone(report.getDonorPhone());

        dto.setReporterId(report.getReporterId());
        dto.setReporterName(report.getReporterName());
        dto.setReporterEmail(report.getReporterEmail());
        dto.setReporterPhone(report.getReporterPhone());

        dto.setReportReason(report.getReportReason());
        dto.setReportCategory(report.getReportCategory());
        dto.setStatus(report.getStatus() != null ? report.getStatus().toString() : null);
        dto.setPriority(report.getPriority());
        dto.setAdminNotes(report.getAdminNotes());
        dto.setResolutionNotes(report.getResolutionNotes());

        // Convert evidence files to base64
        if (report.getEvidenceFile1() != null) {
            dto.setEvidenceFile1Base64(Base64.getEncoder().encodeToString(report.getEvidenceFile1()));
            dto.setEvidenceFile1Name(report.getEvidenceFile1Name());
            dto.setEvidenceFile1Type(report.getEvidenceFile1Type());
        }

        if (report.getEvidenceFile2() != null) {
            dto.setEvidenceFile2Base64(Base64.getEncoder().encodeToString(report.getEvidenceFile2()));
            dto.setEvidenceFile2Name(report.getEvidenceFile2Name());
            dto.setEvidenceFile2Type(report.getEvidenceFile2Type());
        }

        dto.setCreatedAt(report.getCreatedAt());
        dto.setUpdatedAt(report.getUpdatedAt());
        dto.setResolvedAt(report.getResolvedAt());
        dto.setResolvedBy(report.getResolvedBy());

        return dto;
    }

    /**
     * Convert entity to response DTO (lightweight)
     */
    private FoodReportDTO.FoodReportResponseDTO convertToResponseDTO(FoodReport report) {
        return new FoodReportDTO.FoodReportResponseDTO(
                report.getId(),
                report.getFoodDonationId(),
                report.getFoodName(),
                report.getReportReason(),
                report.getReportCategory(),
                report.getStatus() != null ? report.getStatus().toString() : null,
                report.getReporterName(),
                report.getReporterEmail(),
                report.getCreatedAt(),
                report.getEvidenceFile1() != null || report.getEvidenceFile2() != null
        );
    }

    /**
     * Convert DTO to entity
     */
    private FoodReport convertToEntity(FoodReportDTO dto) {
        FoodReport report = new FoodReport();

        // Food Information
        report.setFoodDonationId(dto.getFoodDonationId());
        report.setFoodName(dto.getFoodName());
        report.setFoodDescription(dto.getFoodDescription());
        report.setFoodCategory(dto.getFoodCategory());
        report.setFoodQuantity(dto.getFoodQuantity());
        report.setFoodExpiryDate(dto.getFoodExpiryDate());
        report.setFoodLocation(dto.getFoodLocation());

        // Convert base64 image back to bytes
        if (dto.getFoodImageBase64() != null && !dto.getFoodImageBase64().isEmpty()) {
            try {
                report.setFoodImageData(Base64.getDecoder().decode(dto.getFoodImageBase64()));
                report.setFoodImageContentType(dto.getFoodImageContentType());
            } catch (IllegalArgumentException e) {
                log.warn("Invalid base64 image data provided");
            }
        }

        // Donor Information
        report.setDonorId(dto.getDonorId());
        report.setDonorName(dto.getDonorName());
        report.setDonorEmail(dto.getDonorEmail());
        report.setDonorPhone(dto.getDonorPhone());

        // Reporter Information
        report.setReporterId(dto.getReporterId());
        report.setReporterName(dto.getReporterName());
        report.setReporterEmail(dto.getReporterEmail());
        report.setReporterPhone(dto.getReporterPhone());

        // Report Details
        report.setReportReason(dto.getReportReason());
        report.setReportCategory(dto.getReportCategory());

        if (dto.getStatus() != null) {
            report.setStatus(FoodReport.ReportStatus.valueOf(dto.getStatus().toUpperCase()));
        }

        report.setPriority(dto.getPriority());
        report.setAdminNotes(dto.getAdminNotes());
        report.setResolutionNotes(dto.getResolutionNotes());

        return report;
    }
    /**
     * Download evidence file
     */
    public ResponseEntity<byte[]> downloadEvidenceFile(Long reportId, int fileNumber) {
        FoodReport report = foodReportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("Report not found"));

        byte[] fileData;
        String fileName;
        String contentType;

        if (fileNumber == 1 && report.getEvidenceFile1() != null) {
            fileData = report.getEvidenceFile1();
            fileName = report.getEvidenceFile1Name();
            contentType = report.getEvidenceFile1Type();
        } else if (fileNumber == 2 && report.getEvidenceFile2() != null) {
            fileData = report.getEvidenceFile2();
            fileName = report.getEvidenceFile2Name();
            contentType = report.getEvidenceFile2Type();
        } else {
            throw new IllegalArgumentException("Evidence file not found");
        }

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"" + fileName + "\"")
                .header("Content-Type", contentType)
                .body(fileData);
    }

    /**
     * View evidence file inline
     */
    public ResponseEntity<byte[]> viewEvidenceFile(Long reportId, int fileNumber) {
        FoodReport report = foodReportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("Report not found"));

        byte[] fileData;
        String contentType;

        if (fileNumber == 1 && report.getEvidenceFile1() != null) {
            fileData = report.getEvidenceFile1();
            contentType = report.getEvidenceFile1Type();
        } else if (fileNumber == 2 && report.getEvidenceFile2() != null) {
            fileData = report.getEvidenceFile2();
            contentType = report.getEvidenceFile2Type();
        } else {
            throw new IllegalArgumentException("Evidence file not found");
        }

        return ResponseEntity.ok()
                .header("Content-Type", contentType)
                .body(fileData);
    }
}