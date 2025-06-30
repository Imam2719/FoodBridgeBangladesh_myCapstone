package com.FoodBridgeBangladesh.Service.receiver;

import com.FoodBridgeBangladesh.Model.donor.Donation;
import com.FoodBridgeBangladesh.Model.dto.DonationDTO;
import com.FoodBridgeBangladesh.Model.receiver.ReceiverFoodRequest;
import com.FoodBridgeBangladesh.Repository.donor.DonationRepository;
import com.FoodBridgeBangladesh.Repository.receiver.ReceiverFoodRequestRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReceiverService {

    private static final Logger logger = LoggerFactory.getLogger(ReceiverService.class);

    private final DonationRepository donationRepository;
    private final ReceiverFoodRequestRepository foodRequestRepository;

    @Autowired
    public ReceiverService(
            DonationRepository donationRepository,
            ReceiverFoodRequestRepository foodRequestRepository
    ) {
        this.donationRepository = donationRepository;
        this.foodRequestRepository = foodRequestRepository;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getAvailableFoodDonations(
            String category,
            int page,
            int size
    ) {
        logger.info("Fetching active donations with category filter: {}", category);

        try {
            // Create pagination request
            Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

            // Get donations based on category filter
            Page<Donation> donationPage;

            if (category != null && !category.isEmpty() && !"All".equalsIgnoreCase(category)) {
                // Map frontend category to backend donation category
                String mappedCategory = mapFrontendCategoryToBackend(category);
                logger.info("Mapped frontend category '{}' to backend category '{}'", category, mappedCategory);

                if (mappedCategory != null) {
                    // Filter by specific category
                    donationPage = donationRepository.findByCategoryAndStatusOrderByCreatedAtDesc(
                            mappedCategory, "Active", pageable);
                } else {
                    // If mapping fails, return all active donations
                    donationPage = donationRepository.findByStatusOrderByCreatedAtDesc("Active", pageable);
                }
            } else {
                // Get all active donations when category is "All" or null
                donationPage = donationRepository.findByStatusOrderByCreatedAtDesc("Active", pageable);
            }

            List<Donation> allDonations = donationPage.getContent();
            logger.info("Total donations found for category '{}': {}", category, allDonations.size());

            // Convert to DTOs with proper error handling for LOB data
            List<DonationDTO> donationDTOs = allDonations.stream()
                    .map(donation -> {
                        DonationDTO dto = new DonationDTO();
                        dto.setId(donation.getId());
                        dto.setFoodName(donation.getFoodName() != null ? donation.getFoodName() : "Unnamed Food");
                        dto.setDescription(donation.getDescription() != null ? donation.getDescription() : "No description available");
                        dto.setCategory(donation.getCategory() != null ? donation.getCategory().getLabel() : "Uncategorized");
                        dto.setQuantity(donation.getQuantity() != null ? donation.getQuantity() : "Unknown quantity");
                        dto.setExpiryDate(donation.getExpiryDate());
                        dto.setLocation(donation.getLocation() != null ? donation.getLocation() : "Unknown location");
                        dto.setDietaryInfo(donation.getDietaryInfo() != null ? donation.getDietaryInfo() : new ArrayList<>());

                        // Handle image data carefully to avoid LOB stream access issues
                        try {
                            if (donation.getImageData() != null) {
                                dto.setImageData(donation.getImageData());
                            }
                        } catch (Exception e) {
                            logger.warn("Unable to access image data for donation {}: {}", donation.getId(), e.getMessage());
                            dto.setImageData(null);
                        }

                        dto.setImageContentType(donation.getImageContentType() != null ?
                                donation.getImageContentType() : "image/jpeg");
                        dto.setDonorName(donation.getStoreName() != null ? donation.getStoreName() :
                                donation.getCorporateName() != null ? donation.getCorporateName() : "Anonymous");

                        // Random distance between 1-5 km for display purposes
                        dto.setDistance(1.0 + Math.random() * 4.0);

                        return dto;
                    })
                    .collect(Collectors.toList());

            logger.info("Final DTO count being returned: {}", donationDTOs.size());

            // Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("donations", donationDTOs);
            response.put("totalPages", donationPage.getTotalPages());
            response.put("totalItems", donationPage.getTotalElements());
            response.put("currentPage", donationPage.getNumber());

            return response;
        } catch (Exception e) {
            logger.error("Error fetching available food donations with category filter", e);

            // Return empty response instead of throwing exception
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("donations", new ArrayList<>());
            errorResponse.put("totalPages", 0);
            errorResponse.put("totalItems", 0);
            errorResponse.put("currentPage", 0);
            errorResponse.put("error", "Error fetching donations: " + e.getMessage());

            return errorResponse;
        }
    }

    /**
     * Map frontend category names to backend DonationCategory enum values
     */
    private String mapFrontendCategoryToBackend(String frontendCategory) {
        if (frontendCategory == null) {
            return null;
        }

        switch (frontendCategory.toLowerCase()) {
            case "restaurant":
                return "RESTAURANT_SURPLUS";
            case "homemade":
                return "HOMEMADE_FOOD";
            case "bakery":
                // Bakery items could be either restaurant surplus or homemade
                // For now, we'll treat them as restaurant surplus
                return "RESTAURANT_SURPLUS";
            case "grocery":
                return "GROCERY_EXCESS";
            case "event":
                return "EVENT_LEFTOVER";
            case "corporate":
                return "CORPORATE_DONATION";
            default:
                logger.warn("Unknown frontend category: {}", frontendCategory);
                return null;
        }
    }

    /**
     * Get food donation details by ID
     */
    public Donation getFoodDonationDetails(Long donationId) {
        return donationRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation not found"));
    }

    /**
     * Request a food donation
     */
    @Transactional
    public boolean requestFoodDonation(Long donationId, Long receiverId) {
        Donation donation = getFoodDonationDetails(donationId);

        ReceiverFoodRequest foodRequest = new ReceiverFoodRequest();
        foodRequest.setDonation(donation);
        foodRequest.setReceiverId(receiverId);
        foodRequest.setRequestDate(LocalDate.now());
        foodRequest.setStatus("PENDING");

        foodRequestRepository.save(foodRequest);
        return true;
    }

    /**
     * Get receiver's food requests grouped by status
     */
    public Map<String, List<Donation>> getReceiverFoodRequests(Long receiverId) {
        List<ReceiverFoodRequest> requests = foodRequestRepository.findByReceiverId(receiverId);

        Map<String, List<Donation>> groupedRequests = new HashMap<>();
        groupedRequests.put("PENDING", new ArrayList<>());
        groupedRequests.put("APPROVED", new ArrayList<>());
        groupedRequests.put("REJECTED", new ArrayList<>());
        groupedRequests.put("COMPLETED", new ArrayList<>());

        requests.forEach(request -> {
            String status = request.getStatus();
            Donation donation = request.getDonation();

            if (groupedRequests.containsKey(status)) {
                groupedRequests.get(status).add(donation);
            }
        });

        return groupedRequests;
    }
}