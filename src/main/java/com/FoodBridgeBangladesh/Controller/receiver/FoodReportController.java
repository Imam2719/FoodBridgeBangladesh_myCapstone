package com.FoodBridgeBangladesh.Controller.receiver;

import com.FoodBridgeBangladesh.Model.dto.FoodReportDTO;
import com.FoodBridgeBangladesh.Service.receiver.FoodReportService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/receiver/food-reports")
@Validated
@CrossOrigin(
        origins = {"http://localhost:3000", "https://foodbridge-frontend.onrender.com"},
        allowCredentials = "true",
        maxAge = 3600
)

public class FoodReportController {

    private static final Logger log = LoggerFactory.getLogger(FoodReportController.class);
    private final FoodReportService foodReportService;

    @Autowired
    public FoodReportController(FoodReportService foodReportService) {
        this.foodReportService = foodReportService;
    }

    /**
     * Submit a new food report
     * POST /api/receiver/food-reports
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> submitFoodReport(
            @RequestParam("foodDonationId") Long foodDonationId,
            @RequestParam("reporterId") Long reporterId,
            @RequestParam("reporterEmail") String reporterEmail,
            @RequestParam("reportReason") String reportReason,
            @RequestParam("reportCategory") String reportCategory,

            // Food Information
            @RequestParam(value = "foodName", required = false) String foodName,
            @RequestParam(value = "foodDescription", required = false) String foodDescription,
            @RequestParam(value = "foodCategory", required = false) String foodCategory,
            @RequestParam(value = "foodQuantity", required = false) String foodQuantity,
            @RequestParam(value = "foodExpiryDate", required = false) String foodExpiryDate,
            @RequestParam(value = "foodLocation", required = false) String foodLocation,
            @RequestParam(value = "foodImageBase64", required = false) String foodImageBase64,
            @RequestParam(value = "foodImageContentType", required = false) String foodImageContentType,

            // Donor Information
            @RequestParam(value = "donorId", required = false) Long donorId,
            @RequestParam(value = "donorName", required = false) String donorName,
            @RequestParam(value = "donorEmail", required = false) String donorEmail,
            @RequestParam(value = "donorPhone", required = false) String donorPhone,

            // Reporter Information
            @RequestParam(value = "reporterName", required = false) String reporterName,
            @RequestParam(value = "reporterPhone", required = false) String reporterPhone,

            // Evidence Files (Optional)
            @RequestParam(value = "evidenceFile1", required = false) MultipartFile evidenceFile1,
            @RequestParam(value = "evidenceFile2", required = false) MultipartFile evidenceFile2
    ) {

        Map<String, Object> response = new HashMap<>();

        try {
            log.info("Received food report submission for food ID: {} by user: {}", foodDonationId, reporterId);

            // Validate required fields
            if (foodDonationId == null || reporterId == null ||
                    reporterEmail == null || reporterEmail.trim().isEmpty() ||
                    reportReason == null || reportReason.trim().isEmpty() ||
                    reportCategory == null || reportCategory.trim().isEmpty()) {

                response.put("success", false);
                response.put("message", "Missing required fields");
                return ResponseEntity.badRequest().body(response);
            }

            // Validate report reason length
            if (reportReason.length() < 10 || reportReason.length() > 1000) {
                response.put("success", false);
                response.put("message", "Report reason must be between 10 and 1000 characters");
                return ResponseEntity.badRequest().body(response);
            }

            // Create DTO
            FoodReportDTO reportDTO = new FoodReportDTO();

            // Set required fields
            reportDTO.setFoodDonationId(foodDonationId);
            reportDTO.setReporterId(reporterId);
            reportDTO.setReporterEmail(reporterEmail);
            reportDTO.setReportReason(reportReason);
            reportDTO.setReportCategory(reportCategory);

            // Set food information
            reportDTO.setFoodName(foodName);
            reportDTO.setFoodDescription(foodDescription);
            reportDTO.setFoodCategory(foodCategory);
            reportDTO.setFoodQuantity(foodQuantity);
            reportDTO.setFoodExpiryDate(foodExpiryDate);
            reportDTO.setFoodLocation(foodLocation);
            reportDTO.setFoodImageBase64(foodImageBase64);
            reportDTO.setFoodImageContentType(foodImageContentType);

            // Set donor information
            reportDTO.setDonorId(donorId);
            reportDTO.setDonorName(donorName);
            reportDTO.setDonorEmail(donorEmail);
            reportDTO.setDonorPhone(donorPhone);

            // Set reporter information
            reportDTO.setReporterName(reporterName);
            reportDTO.setReporterPhone(reporterPhone);

            // Set evidence files
            reportDTO.setEvidenceFile1(evidenceFile1);
            reportDTO.setEvidenceFile2(evidenceFile2);

            // Submit the report
            FoodReportDTO savedReport = foodReportService.submitReport(reportDTO);

            response.put("success", true);
            response.put("message", "Food report submitted successfully");
            response.put("reportId", savedReport.getId());
            response.put("status", savedReport.getStatus());
            response.put("priority", savedReport.getPriority());

            log.info("Food report submitted successfully with ID: {}", savedReport.getId());
            return ResponseEntity.ok(response);

        } catch (IllegalStateException e) {
            log.warn("Duplicate report attempt: {}", e.getMessage());
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);

        } catch (IllegalArgumentException e) {
            log.error("Invalid input for food report: {}", e.getMessage());
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);

        } catch (Exception e) {
            log.error("Error submitting food report", e);
            response.put("success", false);
            response.put("message", "Failed to submit report. Please try again.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get reports by user ID
     * GET /api/receiver/food-reports/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getReportsByUser(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();

        try {
            List<FoodReportDTO.FoodReportResponseDTO> reports = foodReportService.getReportsByUser(userId);

            response.put("success", true);
            response.put("reports", reports);
            response.put("totalReports", reports.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error fetching reports for user: {}", userId, e);
            response.put("success", false);
            response.put("message", "Failed to fetch reports");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get paginated reports by user ID
     * GET /api/receiver/food-reports/user/{userId}/paginated
     */
    @GetMapping("/user/{userId}/paginated")
    public ResponseEntity<Map<String, Object>> getReportsByUserPaginated(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Map<String, Object> response = new HashMap<>();

        try {
            Page<FoodReportDTO.FoodReportResponseDTO> reportPage =
                    foodReportService.getReportsByUser(userId, page, size);

            response.put("success", true);
            response.put("reports", reportPage.getContent());
            response.put("currentPage", reportPage.getNumber());
            response.put("totalPages", reportPage.getTotalPages());
            response.put("totalElements", reportPage.getTotalElements());
            response.put("hasNext", reportPage.hasNext());
            response.put("hasPrevious", reportPage.hasPrevious());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error fetching paginated reports for user: {}", userId, e);
            response.put("success", false);
            response.put("message", "Failed to fetch reports");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get report by ID
     * GET /api/receiver/food-reports/{reportId}
     */
    @GetMapping("/{reportId}")
    public ResponseEntity<Map<String, Object>> getReportById(@PathVariable Long reportId) {
        Map<String, Object> response = new HashMap<>();

        try {
            Optional<FoodReportDTO> report = foodReportService.getReportById(reportId);

            if (report.isPresent()) {
                response.put("success", true);
                response.put("report", report.get());
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Report not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

        } catch (Exception e) {
            log.error("Error fetching report with ID: {}", reportId, e);
            response.put("success", false);
            response.put("message", "Failed to fetch report");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get reports by status
     * GET /api/receiver/food-reports/status/{status}
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<Map<String, Object>> getReportsByStatus(@PathVariable String status) {
        Map<String, Object> response = new HashMap<>();

        try {
            List<FoodReportDTO.FoodReportResponseDTO> reports = foodReportService.getReportsByStatus(status);

            response.put("success", true);
            response.put("reports", reports);
            response.put("totalReports", reports.size());
            response.put("status", status);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", "Invalid status: " + status);
            return ResponseEntity.badRequest().body(response);

        } catch (Exception e) {
            log.error("Error fetching reports by status: {}", status, e);
            response.put("success", false);
            response.put("message", "Failed to fetch reports");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get reports summary
     * GET /api/receiver/food-reports/summary/{userId}
     */
    @GetMapping("/summary/{userId}")
    public ResponseEntity<Map<String, Object>> getReportsSummary(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();

        try {
            FoodReportDTO.FoodReportSummaryDTO summary = foodReportService.getReportsSummary(userId);

            response.put("success", true);
            response.put("summary", summary);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error fetching reports summary for user: {}", userId, e);
            response.put("success", false);
            response.put("message", "Failed to fetch summary");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Search reports
     * GET /api/receiver/food-reports/search
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchReports(@RequestParam String keyword) {
        Map<String, Object> response = new HashMap<>();

        try {
            if (keyword == null || keyword.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Search keyword is required");
                return ResponseEntity.badRequest().body(response);
            }

            List<FoodReportDTO.FoodReportResponseDTO> reports = foodReportService.searchReports(keyword.trim());

            response.put("success", true);
            response.put("reports", reports);
            response.put("totalReports", reports.size());
            response.put("keyword", keyword);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error searching reports with keyword: {}", keyword, e);
            response.put("success", false);
            response.put("message", "Failed to search reports");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Update report status (Admin function)
     * PUT /api/receiver/food-reports/{reportId}/status
     */
    @PutMapping("/{reportId}/status")
    public ResponseEntity<Map<String, Object>> updateReportStatus(
            @PathVariable Long reportId,
            @RequestParam String status,
            @RequestParam(required = false) String adminNotes,
            @RequestParam Long adminId) {

        Map<String, Object> response = new HashMap<>();

        try {
            FoodReportDTO updatedReport = foodReportService.updateReportStatus(reportId, status, adminNotes, adminId);

            response.put("success", true);
            response.put("message", "Report status updated successfully");
            response.put("report", updatedReport);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);

        } catch (Exception e) {
            log.error("Error updating report status for ID: {}", reportId, e);
            response.put("success", false);
            response.put("message", "Failed to update report status");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Delete report (Admin function)
     * DELETE /api/receiver/food-reports/{reportId}
     */
    @DeleteMapping("/{reportId}")
    public ResponseEntity<Map<String, Object>> deleteReport(@PathVariable Long reportId) {
        Map<String, Object> response = new HashMap<>();

        try {
            foodReportService.deleteReport(reportId);

            response.put("success", true);
            response.put("message", "Report deleted successfully");

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);

        } catch (Exception e) {
            log.error("Error deleting report with ID: {}", reportId, e);
            response.put("success", false);
            response.put("message", "Failed to delete report");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}