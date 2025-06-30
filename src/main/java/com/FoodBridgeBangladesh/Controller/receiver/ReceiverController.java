package com.FoodBridgeBangladesh.Controller.receiver;

import com.FoodBridgeBangladesh.Model.donor.Donation;
import com.FoodBridgeBangladesh.Service.receiver.ReceiverService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/receiver/food")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ReceiverController {

    private static final Logger logger = LoggerFactory.getLogger(ReceiverController.class);

    private final ReceiverService receiverService;

    @Autowired
    public ReceiverController(ReceiverService receiverService) {
        this.receiverService = receiverService;
    }

    /**
     * Get all available food donations with category-based filtering
     */
    @GetMapping("/available")
    public ResponseEntity<?> getAvailableFoodDonations(
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        try {
            logger.info("Received request for available donations: category={}, page={}, size={}",
                    category, page, size);

            // Validate category parameter
            if (category != null && !isValidCategory(category)) {
                logger.warn("Invalid category received: {}", category);
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid category: " + category));
            }

            Map<String, Object> response = receiverService.getAvailableFoodDonations(
                    category, page, size
            );

            logger.info("Returning {} donations for category '{}'",
                    ((List<?>)response.get("donations")).size(), category);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error fetching available food donations", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error fetching available food donations: " + e.getMessage()));
        }
    }

    /**
     * Validate if the provided category is valid
     */
    private boolean isValidCategory(String category) {
        if (category == null || category.trim().isEmpty()) {
            return true; // null or empty category is valid (means "All")
        }

        String normalizedCategory = category.trim().toLowerCase();
        return normalizedCategory.equals("all") ||
                normalizedCategory.equals("restaurant") ||
                normalizedCategory.equals("homemade") ||
                normalizedCategory.equals("bakery") ||
                normalizedCategory.equals("grocery") ||
                normalizedCategory.equals("event") ||
                normalizedCategory.equals("corporate");
    }

    /**
     * Get details of a specific food donation
     */
    @GetMapping("/{donationId}")
    public ResponseEntity<?> getFoodDonationDetails(@PathVariable Long donationId) {
        try {
            logger.info("Fetching donation details for ID: {}", donationId);
            Donation donation = receiverService.getFoodDonationDetails(donationId);
            return ResponseEntity.ok(donation);
        } catch (Exception e) {
            logger.error("Error fetching food donation details for ID: {}", donationId, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Food donation not found: " + e.getMessage()));
        }
    }

    /**
     * Request a food donation
     */
    @PostMapping("/{donationId}/request")
    public ResponseEntity<?> requestFoodDonation(
            @PathVariable Long donationId,
            @RequestParam Long receiverId
    ) {
        try {
            logger.info("Processing food donation request - donationId: {}, receiverId: {}",
                    donationId, receiverId);

            boolean requested = receiverService.requestFoodDonation(donationId, receiverId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "requested", requested,
                    "message", "Food donation request submitted successfully"
            ));
        } catch (Exception e) {
            logger.error("Error requesting food donation - donationId: {}, receiverId: {}",
                    donationId, receiverId, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "success", false,
                            "error", "Error requesting food donation: " + e.getMessage()
                    ));
        }
    }

    /**
     * Get receiver's requested and received food donations
     */
    @GetMapping("/my-requests")
    public ResponseEntity<?> getReceiverFoodRequests(@RequestParam Long receiverId) {
        try {
            logger.info("Fetching food requests for receiver ID: {}", receiverId);
            Map<String, List<Donation>> requests = receiverService.getReceiverFoodRequests(receiverId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", requests
            ));
        } catch (Exception e) {
            logger.error("Error fetching receiver's food requests for ID: {}", receiverId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "error", "Error fetching food requests: " + e.getMessage()
                    ));
        }
    }

    /**
     * Get available categories with their donation counts
     */
    @GetMapping("/categories")
    public ResponseEntity<?> getAvailableCategories() {
        try {
            logger.info("Fetching available categories with counts");

            // This could be enhanced to return actual counts from the database
            Map<String, Object> categories = Map.of(
                    "success", true,
                    "categories", List.of(
                            Map.of("name", "All", "label", "All Categories"),
                            Map.of("name", "Restaurant", "label", "Restaurant & Café"),
                            Map.of("name", "Homemade", "label", "Homemade Food"),
                            Map.of("name", "Bakery", "label", "Bakery Items"),
                            Map.of("name", "Grocery", "label", "Grocery Store"),
                            Map.of("name", "Event", "label", "Event Leftovers"),
                            Map.of("name", "Corporate", "label", "Corporate Donations")
                    )
            );

            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            logger.error("Error fetching categories", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "error", "Error fetching categories: " + e.getMessage()
                    ));
        }
    }
}