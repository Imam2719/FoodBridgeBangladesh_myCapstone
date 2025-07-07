package com.FoodBridgeBangladesh.Controller.receiver;

import com.FoodBridgeBangladesh.Model.User;
import com.FoodBridgeBangladesh.Model.dto.UserDTO;
import com.FoodBridgeBangladesh.Service.UserService;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.FoodBridgeBangladesh.Model.receiver.EmergencyFoodRequest;
import com.FoodBridgeBangladesh.Model.receiver.EmergencyFoodRequest.FoodCategory;
import com.FoodBridgeBangladesh.Model.receiver.EmergencyFoodRequest.RequestStatus;
import com.FoodBridgeBangladesh.Model.receiver.EmergencyFoodRequest.UrgencyLevel;
import com.FoodBridgeBangladesh.Service.receiver.EmergencyFoodRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/receiver/emergency-requests")
@CrossOrigin(origins = {"http://localhost:3000", "https://foodbridge-frontend.onrender.com"})
public class EmergencyFoodRequestController {

    @Autowired
    private UserService userService;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private EmergencyFoodRequestService emergencyService;

    // Create new emergency request
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> createEmergencyRequest(
            @RequestParam("userId") Long userId,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("location") String location,
            @RequestParam("category") String category,
            @RequestParam("peopleCount") Integer peopleCount,
            @RequestParam("urgency") String urgency,
            @RequestParam(value = "requesterName", required = false) String requesterName,
            @RequestParam(value = "requesterEmail", required = false) String requesterEmail,
            @RequestParam(value = "requesterPhone", required = false) String requesterPhone,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Validate rate limiting
            if (!emergencyService.canUserMakeNewRequest(userId)) {
                response.put("success", false);
                response.put("message", "You have reached the daily limit for emergency requests. Please try again tomorrow.");
                return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(response);
            }

            // Create emergency request object
            EmergencyFoodRequest request = new EmergencyFoodRequest();
            request.setUserId(userId);
            request.setTitle(title);
            request.setDescription(description);
            request.setLocation(location);
            request.setPeopleCount(peopleCount);
            request.setRequesterName(requesterName);
            request.setRequesterEmail(requesterEmail);
            request.setRequesterPhone(requesterPhone);

            // Parse enums
            try {
                request.setCategory(FoodCategory.valueOf(category.toUpperCase()));
                request.setUrgency(UrgencyLevel.valueOf(urgency.toUpperCase()));
            } catch (IllegalArgumentException e) {
                response.put("success", false);
                response.put("message", "Invalid category or urgency level provided");
                return ResponseEntity.badRequest().body(response);
            }

            // Create the request
            EmergencyFoodRequest savedRequest = emergencyService.createEmergencyRequest(request, image);

            response.put("success", true);
            response.put("message", "Emergency request submitted successfully");
            response.put("requestId", savedRequest.getId());
            response.put("status", savedRequest.getStatus().name());
            response.put("priorityScore", savedRequest.getPriorityScore());

            // Add urgent request warning
            if (savedRequest.isUrgent()) {
                response.put("urgentAlert", "This is an urgent request. Admin has been notified immediately.");
            }

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            response.put("success", false);
            response.put("message", "File upload error: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to create emergency request: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Get emergency requests by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserEmergencyRequests(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Map<String, Object> response = new HashMap<>();

        try {
            if (size > 0) {
                Page<EmergencyFoodRequest> requestsPage = emergencyService.getRequestsByUser(userId, page, size);
                response.put("success", true);
                response.put("requests", requestsPage.getContent());
                response.put("currentPage", requestsPage.getNumber());
                response.put("totalPages", requestsPage.getTotalPages());
                response.put("totalItems", requestsPage.getTotalElements());
            } else {
                List<EmergencyFoodRequest> requests = emergencyService.getRequestsByUser(userId);
                response.put("success", true);
                response.put("requests", requests);
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch user emergency requests: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Get emergency request by ID
    @GetMapping("/{requestId}")
    public ResponseEntity<Map<String, Object>> getEmergencyRequestById(@PathVariable Long requestId) {
        Map<String, Object> response = new HashMap<>();

        try {
            Optional<EmergencyFoodRequest> optionalRequest = emergencyService.getRequestById(requestId);

            if (optionalRequest.isPresent()) {
                response.put("success", true);
                response.put("request", optionalRequest.get());
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Emergency request not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch emergency request: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Get all pending emergency requests (for admin/donors)
    @GetMapping("/pending")
    public ResponseEntity<Map<String, Object>> getPendingEmergencyRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Map<String, Object> response = new HashMap<>();

        try {
            if (size > 0) {
                Page<EmergencyFoodRequest> requestsPage = emergencyService.getAllEmergencyRequests(page, size);
                response.put("success", true);
                response.put("requests", requestsPage.getContent());
                response.put("currentPage", requestsPage.getNumber());
                response.put("totalPages", requestsPage.getTotalPages());
                response.put("totalItems", requestsPage.getTotalElements());
            } else {
                List<EmergencyFoodRequest> requests = emergencyService.getPendingRequestsByPriority();
                response.put("success", true);
                response.put("requests", requests);
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch pending emergency requests: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Get urgent pending requests
    @GetMapping("/urgent")
    public ResponseEntity<Map<String, Object>> getUrgentEmergencyRequests() {
        Map<String, Object> response = new HashMap<>();

        try {
            List<EmergencyFoodRequest> urgentRequests = emergencyService.getUrgentPendingRequests();
            response.put("success", true);
            response.put("requests", urgentRequests);
            response.put("count", urgentRequests.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch urgent emergency requests: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Get requests by status
    @GetMapping("/status/{status}")
    public ResponseEntity<Map<String, Object>> getRequestsByStatus(@PathVariable String status) {
        Map<String, Object> response = new HashMap<>();

        try {
            RequestStatus requestStatus = RequestStatus.valueOf(status.toUpperCase());
            List<EmergencyFoodRequest> requests = emergencyService.getRequestsByStatus(requestStatus);

            response.put("success", true);
            response.put("requests", requests);
            response.put("status", status.toUpperCase());
            response.put("count", requests.size());

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", "Invalid status provided");
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch requests by status: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Get requests by urgency
    @GetMapping("/urgency/{urgency}")
    public ResponseEntity<Map<String, Object>> getRequestsByUrgency(@PathVariable String urgency) {
        Map<String, Object> response = new HashMap<>();

        try {
            UrgencyLevel urgencyLevel = UrgencyLevel.valueOf(urgency.toUpperCase());
            List<EmergencyFoodRequest> requests = emergencyService.getRequestsByUrgency(urgencyLevel);

            response.put("success", true);
            response.put("requests", requests);
            response.put("urgency", urgency.toUpperCase());
            response.put("count", requests.size());

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", "Invalid urgency level provided");
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch requests by urgency: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Get requests by category
    @GetMapping("/category/{category}")
    public ResponseEntity<Map<String, Object>> getRequestsByCategory(@PathVariable String category) {
        Map<String, Object> response = new HashMap<>();

        try {
            FoodCategory foodCategory = FoodCategory.valueOf(category.toUpperCase());
            List<EmergencyFoodRequest> requests = emergencyService.getRequestsByCategory(foodCategory);

            response.put("success", true);
            response.put("requests", requests);
            response.put("category", category.toUpperCase());
            response.put("count", requests.size());

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", "Invalid category provided");
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch requests by category: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Search requests by location
    @GetMapping("/location")
    public ResponseEntity<Map<String, Object>> getRequestsByLocation(@RequestParam String location) {
        Map<String, Object> response = new HashMap<>();

        try {
            List<EmergencyFoodRequest> requests = emergencyService.getRequestsByLocation(location);

            response.put("success", true);
            response.put("requests", requests);
            response.put("location", location);
            response.put("count", requests.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch requests by location: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Update request status (for admin/donors)
    @PutMapping("/{requestId}/status")
    public ResponseEntity<Map<String, Object>> updateRequestStatus(
            @PathVariable Long requestId,
            @RequestParam String status,
            @RequestParam(required = false) String responseNote,
            @RequestParam(required = false) Long responderId,
            @RequestParam(required = false) String responderName,
            @RequestParam(required = false) String responderContact
    ) {
        Map<String, Object> response = new HashMap<>();

        try {
            RequestStatus newStatus = RequestStatus.valueOf(status.toUpperCase());

            EmergencyFoodRequest updatedRequest = emergencyService.updateRequestStatus(
                    requestId, newStatus, responseNote, responderId, responderName, responderContact
            );

            response.put("success", true);
            response.put("message", "Request status updated successfully");
            response.put("request", updatedRequest);

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", "Invalid status provided");
            return ResponseEntity.badRequest().body(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to update request status: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Mark request as fulfilled
    @PutMapping("/{requestId}/fulfill")
    public ResponseEntity<Map<String, Object>> markRequestAsFulfilled(
            @PathVariable Long requestId,
            @RequestParam(required = false) String fulfillmentNote
    ) {
        Map<String, Object> response = new HashMap<>();

        try {
            EmergencyFoodRequest updatedRequest = emergencyService.markAsFulfilled(requestId, fulfillmentNote);

            response.put("success", true);
            response.put("message", "Request marked as fulfilled successfully");
            response.put("request", updatedRequest);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to mark request as fulfilled: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Cancel request (by user)
    @PutMapping("/{requestId}/cancel")
    public ResponseEntity<Map<String, Object>> cancelRequest(
            @PathVariable Long requestId,
            @RequestParam Long userId
    ) {
        Map<String, Object> response = new HashMap<>();

        try {
            EmergencyFoodRequest cancelledRequest = emergencyService.cancelRequest(requestId, userId);

            response.put("success", true);
            response.put("message", "Request cancelled successfully");
            response.put("request", cancelledRequest);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());

            if (e.getMessage().contains("not authorized")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to cancel request: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Get user statistics
    @GetMapping("/user/{userId}/statistics")
    public ResponseEntity<Map<String, Object>> getUserStatistics(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();

        try {
            Map<String, Object> stats = emergencyService.getUserStatistics(userId);
            response.put("success", true);
            response.put("statistics", stats);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch user statistics: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Get admin statistics
    @GetMapping("/admin/statistics")
    public ResponseEntity<Map<String, Object>> getAdminStatistics() {
        Map<String, Object> response = new HashMap<>();

        try {
            Map<String, Object> stats = emergencyService.getAdminStatistics();
            response.put("success", true);
            response.put("statistics", stats);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch admin statistics: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Search requests
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchRequests(
            @RequestParam String searchTerm,
            @RequestParam(required = false) String status
    ) {
        Map<String, Object> response = new HashMap<>();

        try {
            RequestStatus requestStatus = null;
            if (status != null && !status.isEmpty()) {
                requestStatus = RequestStatus.valueOf(status.toUpperCase());
            }

            List<EmergencyFoodRequest> requests = emergencyService.searchRequests(searchTerm, requestStatus);

            response.put("success", true);
            response.put("requests", requests);
            response.put("searchTerm", searchTerm);
            response.put("count", requests.size());

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", "Invalid status provided");
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to search requests: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Get overdue requests
    @GetMapping("/overdue")
    public ResponseEntity<Map<String, Object>> getOverdueRequests() {
        Map<String, Object> response = new HashMap<>();

        try {
            List<EmergencyFoodRequest> overdueRequests = emergencyService.getOverdueRequests();

            response.put("success", true);
            response.put("requests", overdueRequests);
            response.put("count", overdueRequests.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch overdue requests: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Get active requests by user
    @GetMapping("/user/{userId}/active")
    public ResponseEntity<Map<String, Object>> getActiveRequestsByUser(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();

        try {
            List<EmergencyFoodRequest> activeRequests = emergencyService.getActiveRequestsByUser(userId);

            response.put("success", true);
            response.put("requests", activeRequests);
            response.put("count", activeRequests.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch active requests: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Check if user can make new request
    @GetMapping("/user/{userId}/can-request")
    public ResponseEntity<Map<String, Object>> checkUserCanMakeRequest(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();

        try {
            boolean canMakeRequest = emergencyService.canUserMakeNewRequest(userId);

            response.put("success", true);
            response.put("canMakeRequest", canMakeRequest);

            if (!canMakeRequest) {
                response.put("message", "Daily limit reached. Maximum 3 emergency requests per day.");
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to check request eligibility: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    //
    @DeleteMapping("/{requestId}")
    public ResponseEntity<Map<String, Object>> deleteEmergencyRequest(@PathVariable Long requestId) {
        Map<String, Object> response = new HashMap<>();

        try {
            emergencyService.deleteEmergencyRequest(requestId);
            response.put("success", true);
            response.put("message", "Emergency request deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to delete emergency request: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/admin/emergency/send-to-donors")
    public ResponseEntity<Map<String, Object>> sendEmergencyToDonors(
            @RequestParam("emergencyRequestId") Long emergencyRequestId,
            @RequestParam("senderAdminId") Long senderAdminId,
            @RequestParam("subject") String subject,
            @RequestParam("content") String content,
            @RequestParam("recipientType") String recipientType,
            @RequestParam(value = "selectedDonors", required = false) String selectedDonorsJson
    ) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Get the emergency request to verify it exists
            Optional<EmergencyFoodRequest> optionalRequest = emergencyService.getRequestById(emergencyRequestId);

            if (!optionalRequest.isPresent()) {
                response.put("success", false);
                response.put("message", "Emergency request not found");
                return ResponseEntity.notFound().build();
            }

            EmergencyFoodRequest emergencyRequest = optionalRequest.get();
            List<UserDTO> targetDonors = new ArrayList<>();

            // 🎯 CHANGE ONLY THESE LINES:
            if ("all".equals(recipientType)) {
                // ✅ USE EMERGENCY-SPECIFIC METHOD (no LOB fields)
                targetDonors = userService.getDonorsForEmergencyRequests();
            } else if ("custom".equals(recipientType) && selectedDonorsJson != null) {
                try {
                    ObjectMapper objectMapper = new ObjectMapper();
                    List<Long> selectedDonorIds = objectMapper.readValue(selectedDonorsJson, new TypeReference<List<Long>>(){});
                    // ✅ USE EMERGENCY-SPECIFIC METHOD (no LOB fields)
                    targetDonors = userService.getDonorsByIdsForEmergencyRequests(selectedDonorIds);
                } catch (Exception e) {
                    response.put("success", false);
                    response.put("message", "Invalid selected donors format");
                    return ResponseEntity.badRequest().body(response);
                }
            }

            if (targetDonors.isEmpty()) {
                response.put("success", false);
                response.put("message", "No donors found to send the emergency request");
                return ResponseEntity.badRequest().body(response);
            }

            // Send emails to all target donors
            int emailsSent = 0;
            int emailsFailed = 0;

            for (UserDTO donor : targetDonors) {
                try {
                    sendEmergencyEmailToDonorDTO(donor, emergencyRequest, subject, content);
                    emailsSent++;
                } catch (Exception e) {
                    emailsFailed++;
                    System.err.println("Failed to send email to donor: " + donor.getEmail() + " - " + e.getMessage());
                }
            }

            // Update emergency request status to IN_PROGRESS
            emergencyService.updateRequestStatus(
                    emergencyRequestId,
                    RequestStatus.IN_PROGRESS,
                    "Emergency request sent to " + emailsSent + " donors",
                    senderAdminId,
                    "Admin",
                    "admin@foodbridge.com"
            );

            response.put("success", true);
            response.put("message", "Emergency request sent successfully");
            response.put("emailsSent", emailsSent);
            response.put("emailsFailed", emailsFailed);
            response.put("totalDonors", targetDonors.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Error sending emergency to donors: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Failed to send emergency request to donors: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    private void sendEmergencyEmailToDonorDTO(UserDTO donor, EmergencyFoodRequest emergencyRequest, String subject, String content) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(donor.getEmail());
        message.setSubject(subject);
        message.setText(content);
        message.setFrom("admin@foodbridge.com");

        mailSender.send(message);
    }

    // Helper method to send email to individual donor
    private void sendEmergencyEmailToDonor(User donor, EmergencyFoodRequest emergencyRequest, String subject, String content) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(donor.getEmail());
        message.setSubject(subject);
        message.setText(content);
        message.setFrom("admin@foodbridge.com");

        mailSender.send(message);
    }

    @GetMapping("/admin/donors")
    public ResponseEntity<Map<String, Object>> getAllDonors() {
        Map<String, Object> response = new HashMap<>();

        try {
            System.out.println("🚨 Emergency: Fetching donors without LOB fields...");

            // 🎯 USE EMERGENCY-SPECIFIC METHOD (no LOB fields)
            List<UserDTO> donors = userService.getDonorsForEmergencyRequests();

            // Create simplified donor info for frontend
            List<Map<String, Object>> donorInfo = donors.stream()
                    .map(donor -> {
                        Map<String, Object> info = new HashMap<>();
                        info.put("id", donor.getId());
                        info.put("name", donor.getFullName());
                        info.put("email", donor.getEmail());
                        info.put("phone", donor.getPhone());
                        info.put("verified", donor.isVerified());
                        return info;
                    })
                    .collect(Collectors.toList());

            System.out.println("✅ Successfully prepared " + donorInfo.size() + " donors for emergency");

            response.put("success", true);
            response.put("donors", donorInfo);
            response.put("count", donorInfo.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Error fetching emergency donors: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Failed to fetch donors: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/admin/debug/users")
    public ResponseEntity<Map<String, Object>> debugUsers() {
        Map<String, Object> response = new HashMap<>();

        try {
            // Get basic counts without fetching LOB fields
            long totalUsers = userService.countUsers(); // You'll need to add this method
            long donorCount = userService.countDonors();
            long receiverCount = totalUsers - donorCount;

            // Get a few sample donors using DTO
            List<UserDTO> sampleDonors = userService.getAllDonorsDTO().stream()
                    .limit(3)
                    .collect(Collectors.toList());

            response.put("success", true);
            response.put("totalUsers", totalUsers);
            response.put("donorCount", donorCount);
            response.put("receiverCount", receiverCount);
            response.put("userSamples", sampleDonors);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Error in debug endpoint: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Debug failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}