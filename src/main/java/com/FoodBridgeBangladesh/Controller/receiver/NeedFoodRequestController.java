package com.FoodBridgeBangladesh.Controller.receiver;

import com.FoodBridgeBangladesh.Model.dto.NeedFoodRequestDTO;
import com.FoodBridgeBangladesh.Model.receiver.NeedFoodRequestModel;
import com.FoodBridgeBangladesh.Service.receiver.NeedFoodRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/receiver/food")
@CrossOrigin(
        origins = {"http://localhost:3000", "https://foodbridge-frontend.onrender.com","https://viewlive.onrender.com"},
        allowCredentials = "true"
)
public class NeedFoodRequestController {

    private final NeedFoodRequestService foodRequestService;

    // Single constructor with @Autowired
    @Autowired
    public NeedFoodRequestController(NeedFoodRequestService foodRequestService) {
        this.foodRequestService = foodRequestService;
    }

    @PostMapping("/request")
    public ResponseEntity<?> createFoodRequest(
            @RequestParam("userId") Long userId,
            @RequestParam("priority") String priority,
            @RequestParam("foodTypes") List<String> foodTypes,
            @RequestParam("recipients") List<String> recipients,
            @RequestParam("peopleCount") Integer peopleCount,
            @RequestParam("timeNeeded") String timeNeeded,
            @RequestParam(value = "specificDate", required = false) String specificDate,
            @RequestParam(value = "specificTime", required = false) String specificTime,
            @RequestParam("location") String location,
            @RequestParam("deliveryPreference") String deliveryPreference,
            @RequestParam(value = "notes", required = false) String notes,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        try {
            // Create DTO
            NeedFoodRequestDTO requestDTO = new NeedFoodRequestDTO();
            requestDTO.setUserId(userId);
            requestDTO.setPriority(priority);
            requestDTO.setFoodTypes(foodTypes);
            requestDTO.setRecipients(recipients);
            requestDTO.setPeopleCount(peopleCount);
            requestDTO.setTimeNeeded(timeNeeded);
            requestDTO.setSpecificDate(specificDate);
            requestDTO.setSpecificTime(specificTime);
            requestDTO.setLocation(location);
            requestDTO.setDeliveryPreference(deliveryPreference);
            requestDTO.setNotes(notes);
            requestDTO.setImage(image);

            // Save food request
            NeedFoodRequestModel savedRequest = foodRequestService.createFoodRequest(requestDTO);

            // Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Food request submitted successfully");
            response.put("requestId", savedRequest.getId());

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            // Handle image upload error
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to process food request: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        } catch (IllegalArgumentException e) {
            // Handle validation errors
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/active-requests")
    public ResponseEntity<?> getUserFoodRequests(
            @RequestParam("receiverId") Long receiverId,
            @RequestParam(value = "status", required = false) String status
    ) {
        try {
            List<NeedFoodRequestModel> requests;

            // Fetch requests based on status (optional)
            if (status != null && !status.isEmpty()) {
                requests = foodRequestService.getUserFoodRequestsByStatus(receiverId, status);
            } else {
                requests = foodRequestService.getUserFoodRequests(receiverId);
            }

            return ResponseEntity.ok(requests);
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/recent-requests")
    public ResponseEntity<?> getRecentFoodRequests(
            @RequestParam("receiverId") Long receiverId
    ) {
        try {
            List<NeedFoodRequestModel> recentRequests = foodRequestService.getRecentFoodRequests(receiverId);
            return ResponseEntity.ok(recentRequests);
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
}