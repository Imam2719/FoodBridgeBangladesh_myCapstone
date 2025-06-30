package com.FoodBridgeBangladesh.Controller.receiver;

import com.FoodBridgeBangladesh.Model.dto.SavedDonationDTO;
import com.FoodBridgeBangladesh.Model.receiver.SavedDonation;
import com.FoodBridgeBangladesh.Service.receiver.SavedDonationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/receiver/saved-donations")
@CrossOrigin(origins = "*")
public class SavedDonationController {

    private static final Logger logger = LoggerFactory.getLogger(SavedDonationController.class);

    @Autowired
    private SavedDonationService savedDonationService;

    /**
     * Save a donation for a user
     */
    @PostMapping("/{donationId}")
    public ResponseEntity<?> saveDonation(
            @PathVariable Long donationId,
            @RequestParam Long userId) {

        logger.info("Request to save donation {} for user {}", donationId, userId);

        try {
            SavedDonation savedDonation = savedDonationService.saveDonation(userId, donationId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Donation saved successfully");
            response.put("savedDonationId", savedDonation.getId());

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            logger.error("Error saving donation {} for user {}: {}", donationId, userId, e.getMessage());

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            logger.error("Unexpected error saving donation {} for user {}: {}", donationId, userId, e.getMessage());

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "An unexpected error occurred");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Remove a saved donation
     */
    @DeleteMapping("/{donationId}")
    public ResponseEntity<?> unsaveDonation(
            @PathVariable Long donationId,
            @RequestParam Long userId) {

        logger.info("Request to remove saved donation {} for user {}", donationId, userId);

        try {
            boolean removed = savedDonationService.unsaveDonation(userId, donationId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", removed);
            response.put("message", removed ? "Donation removed from saved list" : "Donation not found in saved list");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error removing saved donation {} for user {}: {}", donationId, userId, e.getMessage());

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error removing saved donation");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Get all saved donations for a user
     */
    @GetMapping
    public ResponseEntity<?> getSavedDonations(@RequestParam Long userId) {
        logger.info("Getting saved donations for user {}", userId);

        try {
            List<SavedDonationDTO> savedDonations = savedDonationService.getUserSavedDonations(userId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("savedDonations", savedDonations);
            response.put("totalCount", savedDonations.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error getting saved donations for user {}: {}", userId, e.getMessage());

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error fetching saved donations");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Get only active saved donations (original donations are still active)
     */
    @GetMapping("/active")
    public ResponseEntity<?> getActiveSavedDonations(@RequestParam Long userId) {
        logger.info("Getting active saved donations for user {}", userId);

        try {
            List<SavedDonationDTO> activeSavedDonations = savedDonationService.getActiveSavedDonations(userId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("savedDonations", activeSavedDonations);
            response.put("totalCount", activeSavedDonations.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error getting active saved donations for user {}: {}", userId, e.getMessage());

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error fetching active saved donations");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Get saved donation IDs for a user (for frontend state management)
     */
    @GetMapping("/ids")
    public ResponseEntity<?> getSavedDonationIds(@RequestParam Long userId) {
        logger.debug("Getting saved donation IDs for user {}", userId);

        try {
            List<Long> savedDonationIds = savedDonationService.getUserSavedDonationIds(userId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("savedDonationIds", savedDonationIds);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error getting saved donation IDs for user {}: {}", userId, e.getMessage());

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error fetching saved donation IDs");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Check if a specific donation is saved by user
     */
    @GetMapping("/{donationId}/is-saved")
    public ResponseEntity<?> isDonationSaved(
            @PathVariable Long donationId,
            @RequestParam Long userId) {

        try {
            boolean isSaved = savedDonationService.isDonationSaved(userId, donationId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("isSaved", isSaved);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error checking if donation {} is saved for user {}: {}", donationId, userId, e.getMessage());

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error checking saved status");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Get count of saved donations for a user
     */
    @GetMapping("/count")
    public ResponseEntity<?> getSavedDonationsCount(@RequestParam Long userId) {
        try {
            long count = savedDonationService.getUserSavedDonationsCount(userId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("count", count);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error getting saved donations count for user {}: {}", userId, e.getMessage());

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error getting saved donations count");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}