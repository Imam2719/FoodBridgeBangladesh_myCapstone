package com.FoodBridgeBangladesh.Service.receiver;

import com.FoodBridgeBangladesh.Model.dto.NeedFoodRequestDTO;
import com.FoodBridgeBangladesh.Model.receiver.NeedFoodRequestModel;
import com.FoodBridgeBangladesh.Repository.receiver.NeedFoodRequestInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class NeedFoodRequestService {

    private final NeedFoodRequestInterface foodRequestRepository;

    // Constructor-based dependency injection
    @Autowired
    public NeedFoodRequestService(NeedFoodRequestInterface foodRequestRepository) {
        this.foodRequestRepository = foodRequestRepository;
    }

    @Transactional
    public NeedFoodRequestModel createFoodRequest(NeedFoodRequestDTO requestDTO) throws IOException {
        // Null check for input
        if (requestDTO == null) {
            throw new IllegalArgumentException("Food request DTO cannot be null");
        }

        // Create a new food request model
        NeedFoodRequestModel foodRequest = new NeedFoodRequestModel();

        // Set basic details with null checks
        foodRequest.setUserId(requestDTO.getUserId());
        foodRequest.setPriority(requestDTO.getPriority());

        // Null-safe collections
        foodRequest.setFoodTypes(requestDTO.getFoodTypes() != null ? requestDTO.getFoodTypes() : List.of());
        foodRequest.setRecipients(requestDTO.getRecipients() != null ? requestDTO.getRecipients() : List.of());

        foodRequest.setPeopleCount(requestDTO.getPeopleCount());
        foodRequest.setTimeNeeded(requestDTO.getTimeNeeded());
        foodRequest.setSpecificDate(requestDTO.getSpecificDate());
        foodRequest.setSpecificTime(requestDTO.getSpecificTime());
        foodRequest.setLocation(requestDTO.getLocation());
        foodRequest.setDeliveryPreference(requestDTO.getDeliveryPreference());
        foodRequest.setNotes(requestDTO.getNotes());

        // Set image if uploaded
        if (requestDTO.getImage() != null && !requestDTO.getImage().isEmpty()) {
            MultipartFile imageFile = requestDTO.getImage();
            try {
                foodRequest.setImageData(imageFile.getBytes());
                foodRequest.setImageContentType(imageFile.getContentType());
            } catch (IOException e) {
                // Log the error or handle it appropriately
                throw new IOException("Failed to process image", e);
            }
        }

        // Set default status and timestamp
        foodRequest.setRequestStatus("PENDING");
        foodRequest.setRequestedAt(LocalDateTime.now());

        // Validate before saving
        validateFoodRequest(foodRequest);

        // Save and return the food request
        return foodRequestRepository.save(foodRequest);
    }

    // Additional validation method
    private void validateFoodRequest(NeedFoodRequestModel foodRequest) {
        if (foodRequest.getUserId() == null) {
            throw new IllegalArgumentException("User ID is required");
        }
        if (foodRequest.getLocation() == null || foodRequest.getLocation().isEmpty()) {
            throw new IllegalArgumentException("Location is required");
        }
        if (foodRequest.getPeopleCount() == null || foodRequest.getPeopleCount() <= 0) {
            throw new IllegalArgumentException("Invalid people count");
        }
    }

    // Retrieve food requests for a specific user
    @Transactional(readOnly = true)
    public List<NeedFoodRequestModel> getUserFoodRequests(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        return foodRequestRepository.findByUserId(userId);
    }

    // Retrieve food requests by status for a specific user
    @Transactional(readOnly = true)
    public List<NeedFoodRequestModel> getUserFoodRequestsByStatus(Long userId, String status) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (status == null || status.isEmpty()) {
            throw new IllegalArgumentException("Status cannot be null or empty");
        }
        return foodRequestRepository.findByUserIdAndRequestStatus(userId, status);
    }

    // Get recent food requests
    @Transactional(readOnly = true)
    public List<NeedFoodRequestModel> getRecentFoodRequests(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        return foodRequestRepository.findRecentRequestsByUserId(userId);
    }

    // Update food request status
    @Transactional
    public NeedFoodRequestModel updateFoodRequestStatus(Long requestId, String status) {
        if (requestId == null) {
            throw new IllegalArgumentException("Request ID cannot be null");
        }
        if (status == null || status.isEmpty()) {
            throw new IllegalArgumentException("Status cannot be null or empty");
        }

        NeedFoodRequestModel foodRequest = foodRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Food request not found with ID: " + requestId));

        foodRequest.setRequestStatus(status);
        return foodRequestRepository.save(foodRequest);
    }


    /**
     * Get food requests by status
     */
    @Transactional(readOnly = true)
    public List<NeedFoodRequestModel> getFoodRequestsByStatus(String status) {
        if (status == null || status.isEmpty()) {
            throw new IllegalArgumentException("Status cannot be null or empty");
        }
        return foodRequestRepository.findByRequestStatus(status);
    }

    /**
     * Get food request by ID
     */
    @Transactional(readOnly = true)
    public NeedFoodRequestModel getFoodRequestById(Long requestId) {
        if (requestId == null) {
            throw new IllegalArgumentException("Request ID cannot be null");
        }
        return foodRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Food request not found with ID: " + requestId));
    }
}