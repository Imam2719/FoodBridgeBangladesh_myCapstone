package com.FoodBridgeBangladesh.Controller.receiver;

import com.FoodBridgeBangladesh.Model.User;
import com.FoodBridgeBangladesh.Model.dto.Receiver_ActiveFood_Request_DTO;
import com.FoodBridgeBangladesh.Model.dto.Receiver_ActiveFood_Request_StatusDTO;
import com.FoodBridgeBangladesh.Model.receiver.Receiver_ActiveFood_Request_Model;
import com.FoodBridgeBangladesh.Repository.UserRepository;
import com.FoodBridgeBangladesh.Service.receiver.Receiver_ActiveFood_Request_Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class Receiver_ActiveFood_Request_Controller {

    private static final Logger logger = LoggerFactory.getLogger(Receiver_ActiveFood_Request_Controller.class);

    @Autowired
    private Receiver_ActiveFood_Request_Service requestService;

    @Autowired
    private UserRepository userRepository;

    /**
     * Create a new food request (used when receiver clicks "Request Pickup")
     * Changed URL to avoid conflict with existing controller
     */
    @PostMapping("/receiver/food/pickup/{donationId}")
    public ResponseEntity<?> createFoodRequest(
            @PathVariable Long donationId,
            @RequestParam Long receiverId,
            @RequestParam(defaultValue = "1") Integer quantity,
            @RequestParam(required = false) String note,
            @RequestParam(defaultValue = "self") String pickupMethod) {

        logger.info("Creating food request for donation ID: {} by receiver ID: {}", donationId, receiverId);

        try {
            // Verify the receiver exists
            Optional<User> receiverOpt = userRepository.findById(receiverId);
            if (receiverOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("success", false, "message", "Receiver not found"));
            }

            Receiver_ActiveFood_Request_Model request =
                    requestService.createRequest(donationId, receiverId, quantity, note, pickupMethod);

            // Get queue position for the requester
            int queuePosition = requestService.getRequestQueuePosition(donationId, receiverId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("requestId", request.getId());
            response.put("queuePosition", queuePosition);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            logger.error("Error creating food request: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Get all requests for a specific donation (used by donor when clicking "Check Requests")
     */
    @GetMapping("/donor/donations/{donationId}/requests")
    public ResponseEntity<?> getDonationRequests(
            @PathVariable Long donationId,
            @RequestParam Long donorId,
            @RequestParam(required = false) String status) {

        logger.info("Getting requests for donation ID: {} by donor ID: {}", donationId, donorId);

        try {
            // Verify the donor exists
            Optional<User> donorOpt = userRepository.findById(donorId);
            if (donorOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("success", false, "message", "Donor not found"));
            }

            List<Receiver_ActiveFood_Request_DTO> requests;

            if (status != null && !status.isEmpty()) {
                requests = requestService.getRequestsByDonationIdAndStatus(donationId, status, donorId);
            } else {
                requests = requestService.getRequestsByDonationId(donationId, donorId);
            }

            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            logger.error("Error getting donation requests: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Get all requests made by a receiver
     */
    @GetMapping("/receiver/food/requests")
    public ResponseEntity<?> getReceiverRequests(@RequestParam Long receiverId) {
        logger.info("Getting all requests for receiver ID: {}", receiverId);

        try {
            // Verify the receiver exists
            Optional<User> receiverOpt = userRepository.findById(receiverId);
            if (receiverOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("success", false, "message", "Receiver not found"));
            }

            List<Receiver_ActiveFood_Request_DTO> requests = requestService.getRequestsByReceiverId(receiverId);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            logger.error("Error getting receiver requests: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Update request status (for donors to accept/reject requests)
     */
    @PutMapping("/donor/requests/{requestId}/status")
    public ResponseEntity<?> updateRequestStatus(
            @PathVariable Long requestId,
            @RequestBody Receiver_ActiveFood_Request_StatusDTO statusDTO,
            @RequestParam Long donorId) {

        logger.info("Updating request ID: {} status to: {} by donor ID: {}",
                requestId, statusDTO.getStatus(), donorId);

        try {
            // Verify the donor exists
            Optional<User> donorOpt = userRepository.findById(donorId);
            if (donorOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("success", false, "message", "Donor not found"));
            }

            statusDTO.setRequestId(requestId); // Ensure request ID is set
            Receiver_ActiveFood_Request_DTO updatedRequest =
                    requestService.updateRequestStatus(requestId, statusDTO, donorId);

            return ResponseEntity.ok(updatedRequest);
        } catch (Exception e) {
            logger.error("Error updating request status: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Cancel a request (for receivers to cancel their requests)
     */
    @PutMapping("/receiver/requests/{requestId}/cancel")
    public ResponseEntity<?> cancelRequest(
            @PathVariable Long requestId,
            @RequestParam Long receiverId) {

        logger.info("Cancelling request ID: {} by receiver ID: {}", requestId, receiverId);

        try {
            // Verify the receiver exists
            Optional<User> receiverOpt = userRepository.findById(receiverId);
            if (receiverOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("success", false, "message", "Receiver not found"));
            }

            requestService.cancelRequest(requestId, receiverId);
            return ResponseEntity.ok(Map.of("success", true, "message", "Request cancelled successfully"));
        } catch (Exception e) {
            logger.error("Error cancelling request: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Mark a request as completed (for both donors and receivers)
     */
    @PutMapping("/requests/{requestId}/complete")
    public ResponseEntity<?> completeRequest(
            @PathVariable Long requestId,
            @RequestParam Long userId,
            @RequestParam boolean isDonor) {

        logger.info("Marking request ID: {} as completed by user ID: {} (isDonor: {})",
                requestId, userId, isDonor);

        try {
            // Verify the user exists
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("success", false, "message", "User not found"));
            }

            requestService.completeRequest(requestId, userId, isDonor);
            return ResponseEntity.ok(Map.of("success", true, "message", "Request marked as completed successfully"));
        } catch (Exception e) {
            logger.error("Error completing request: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Get the user's position in the request queue
     */
    @GetMapping("/receiver/request/position")
    public ResponseEntity<?> getRequestPosition(
            @RequestParam Long donationId,
            @RequestParam Long receiverId) {

        logger.info("Getting request position for donation ID: {} and receiver ID: {}",
                donationId, receiverId);

        try {
            int position = requestService.getRequestQueuePosition(donationId, receiverId);

            if (position == -1) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("success", false, "message", "No pending request found"));
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("queuePosition", position);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error getting request position: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    /**
     * Get recent accepted request notifications for a receiver
     */
    @GetMapping("/receiver/notifications/accepted")
    public ResponseEntity<?> getAcceptedRequestNotifications(@RequestParam Long receiverId) {
        logger.info("Getting accepted request notifications for receiver ID: {}", receiverId);

        try {
            // Verify the receiver exists
            Optional<User> receiverOpt = userRepository.findById(receiverId);
            if (receiverOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("success", false, "message", "Receiver not found"));
            }

            // Get recently accepted requests (last 24 hours)
            LocalDateTime oneDayAgo = LocalDateTime.now().minusHours(24);
            List<Receiver_ActiveFood_Request_DTO> acceptedRequests =
                    requestService.getRecentAcceptedRequests(receiverId, oneDayAgo);

            return ResponseEntity.ok(acceptedRequests);
        } catch (Exception e) {
            logger.error("Error getting accepted request notifications: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/receiver/notifications/requests")
    public ResponseEntity<?> getRequestNotifications(@RequestParam Long receiverId) {
        logger.info("Getting request notifications for receiver ID: {}", receiverId);

        try {
            Optional<User> receiverOpt = userRepository.findById(receiverId);
            if (receiverOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("success", false, "message", "Receiver not found"));
            }

            // Get recently processed requests (last 24 hours)
            LocalDateTime oneDayAgo = LocalDateTime.now().minusHours(24);
            List<Receiver_ActiveFood_Request_DTO> processedRequests =
                    requestService.getRecentRequests(receiverId, oneDayAgo);

            return ResponseEntity.ok(processedRequests);
        } catch (Exception e) {
            logger.error("Error getting request notifications: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }


    @GetMapping("/merchant/donations/{donationId}/requests")
    public ResponseEntity<?> getMerchantDonationRequests(
            @PathVariable Long donationId,
            @RequestParam Long merchantId) {

        logger.info("Getting requests for merchant donation ID: {} by merchant ID: {}", donationId, merchantId);

        try {
            // Verify the merchant exists
            Optional<User> merchantOpt = userRepository.findById(merchantId);
            if (merchantOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("success", false, "message", "Merchant not found"));
            }

            // Use merchant-specific method instead of reusing donor method
            List<Receiver_ActiveFood_Request_DTO> requests =
                    requestService.getMerchantDonationRequests(donationId, merchantId);

            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            logger.error("Error getting merchant donation requests: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // Similarly, add a merchant-specific endpoint for updating request status
    @PutMapping("/merchant/requests/{requestId}/status")
    public ResponseEntity<?> updateMerchantRequestStatus(
            @PathVariable Long requestId,
            @RequestBody Receiver_ActiveFood_Request_StatusDTO statusDTO,
            @RequestParam Long merchantId) {

        logger.info("Updating request ID: {} status to: {} by merchant ID: {}",
                requestId, statusDTO.getStatus(), merchantId);

        // Reuse the existing donor method
        return updateRequestStatus(requestId, statusDTO, merchantId);
    }

}