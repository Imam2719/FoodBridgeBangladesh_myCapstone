package com.FoodBridgeBangladesh.Service.merchant;

import com.FoodBridgeBangladesh.Model.donor.Donation;
import com.FoodBridgeBangladesh.Model.dto.DonationFormDTO;
import com.FoodBridgeBangladesh.Model.merchant.FoodItem;
import com.FoodBridgeBangladesh.Repository.donor.DonationRepository;
import com.FoodBridgeBangladesh.Repository.merchant.FoodItemRepository;
import com.FoodBridgeBangladesh.Repository.merchant.MerchantSaleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MerchantDonationService {

    private static final Logger logger = LoggerFactory.getLogger(MerchantDonationService.class);

    private final DonationRepository donationRepository;
    private final FoodItemRepository foodItemRepository;
    private final MerchantSaleRepository merchantSaleRepository;

    @Autowired
    public MerchantDonationService(
            DonationRepository donationRepository,
            FoodItemRepository foodItemRepository,
            MerchantSaleRepository merchantSaleRepository) {
        this.donationRepository = donationRepository;
        this.foodItemRepository = foodItemRepository;
        this.merchantSaleRepository = merchantSaleRepository;
    }

    /**
     * Create a donation directly from a merchant's food item
     */
    @Transactional
    public Donation createMerchantDonation(Long foodItemId, Long merchantId, Integer quantity, String notes) {
        logger.info("Creating merchant donation for food item ID: {}, merchant ID: {}, quantity: {}",
                foodItemId, merchantId, quantity);

        try {
            if (quantity <= 0) {
                throw new IllegalArgumentException("Quantity must be greater than zero");
            }

            FoodItem foodItem = foodItemRepository.findById(foodItemId)
                    .orElseThrow(() -> new RuntimeException("Food item not found with ID: " + foodItemId));

            if (!foodItem.getMerchantId().equals(merchantId)) {
                throw new IllegalStateException("This food item does not belong to the merchant");
            }

            // Check if there's enough quantity available
            int soldQuantity = 0;
            try {
                Integer totalSold = merchantSaleRepository.getTotalSoldQuantityByFoodItemId(foodItemId);
                if (totalSold != null) {
                    soldQuantity = totalSold;
                }
            } catch (Exception e) {
                logger.warn("Could not retrieve sold quantity, assuming 0", e);
            }

            int availableQuantity = foodItem.getQuantity() - soldQuantity;

            if (quantity > availableQuantity) {
                throw new IllegalArgumentException("Requested quantity exceeds available quantity. Available: " + availableQuantity);
            }

            // Create a donation from the food item
            Donation donation = Donation.fromFoodItem(foodItem);

            // Set specific values for this donation
            donation.setQuantity(quantity.toString());
            donation.setDonorId(merchantId);
            donation.setDonorRole("MERCHANT");
            donation.setOriginalFoodItemId(foodItemId);

            // Use constant for consistency
            logger.info("Setting donation status to: {}", Donation.STATUS_ACTIVE);
            donation.setStatus(Donation.STATUS_ACTIVE);

            // Add notes if provided
            if (notes != null && !notes.isEmpty()) {
                String description = donation.getDescription();
                if (description == null) {
                    description = "Notes: " + notes;
                } else {
                    description += "\n\nNotes: " + notes;
                }
                donation.setDescription(description);
            }

            Donation savedDonation = donationRepository.save(donation);

            logger.info("Successfully created merchant donation with ID: {} and status: {}",
                    savedDonation.getId(), savedDonation.getStatus());

            foodItem.setQuantity(foodItem.getQuantity() - quantity);
            foodItemRepository.save(foodItem);

            return savedDonation;
        } catch (Exception e) {
            logger.error("Error creating merchant donation: {}", e.getMessage(), e);
            throw new RuntimeException("Error creating merchant donation: " + e.getMessage(), e);
        }
    }

    /**
     * Get all donations made by a merchant
     */
    public List<Donation> getMerchantDonations(Long merchantId) {
        logger.info("Fetching all donations for merchant ID: {}", merchantId);
        List<Donation> donations = donationRepository.findByDonorId(merchantId);
        logger.info("Found {} total donations for merchant ID: {}", donations.size(), merchantId);
        return donations;
    }

    /**
     * Get merchant donations by status (excluding deleted ones)
     */
    @Transactional
    public List<Donation> getMerchantDonationsByStatus(Long merchantId, String status) {
        try {
            logger.info("Querying with new method for merchantId={} with status={}", merchantId, status);
            List<Donation> donations = donationRepository.findByDonorIdAndStatusCaseInsensitive(merchantId, status);

            // ✅ Filter out soft-deleted donations
            return donations.stream()
                    .filter(donation -> !"DELETED".equals(donation.getStatus()))
                    .collect(java.util.stream.Collectors.toList());

        } catch (Exception e) {
            logger.error("Error in getMerchantDonationsByStatus: ", e);
            return new ArrayList<>();
        }
    }
    /**
     * Update donation status
     */
    @Transactional
    public Donation updateDonationStatus(Long id, String status, Long merchantId) {
        logger.info("Updating donation status to '{}' for ID: {} by merchant ID: {}", status, id, merchantId);

        Donation donation = donationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donation not found with ID: " + id));

        // Verify ownership
        if (!donation.getDonorId().equals(merchantId)) {
            throw new IllegalStateException("This donation does not belong to the merchant");
        }

        // Log previous status for debugging
        logger.info("Changing donation status from '{}' to '{}'", donation.getStatus(), status);
        donation.setStatus(status);

        Donation updatedDonation = donationRepository.save(donation);
        logger.info("Successfully updated donation status to '{}' for ID: {}",
                updatedDonation.getStatus(), updatedDonation.getId());

        return updatedDonation;
    }

    /**
     * Get a donation by ID
     */
    public Donation getDonationById(Long id, Long merchantId) {
        logger.info("Getting donation with ID: {} for merchant ID: {}", id, merchantId);

        Donation donation = donationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donation not found with ID: " + id));

        // Verify ownership
        if (!donation.getDonorId().equals(merchantId)) {
            throw new IllegalStateException("This donation does not belong to the merchant");
        }

        logger.info("Found donation: ID={}, Status='{}', Name='{}'",
                donation.getId(), donation.getStatus(), donation.getFoodName());

        return donation;
    }
    /**
     * Create a donation from form data and copy image from food item
     */
    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
    public Donation createMerchantDonationFromForm(DonationFormDTO donationForm) {
        logger.info("Creating merchant donation from form data for food item ID: {}",
                donationForm.getOriginalFoodItemId());

        try {
            if (donationForm.getQuantity() == null || Integer.parseInt(donationForm.getQuantity()) <= 0) {
                throw new IllegalArgumentException("Quantity must be greater than zero");
            }

            FoodItem foodItem = foodItemRepository.findById(donationForm.getOriginalFoodItemId())
                    .orElseThrow(() -> new RuntimeException("Food item not found with ID: " +
                            donationForm.getOriginalFoodItemId()));

            // Check if the food item belongs to the merchant
            if (!foodItem.getMerchantId().equals(donationForm.getDonorId())) {
                throw new IllegalStateException("This food item does not belong to the merchant");
            }

            // Create donation from form data
            Donation donation = new Donation();

            // Set basic information
            donation.setFoodName(donationForm.getFoodName());
            donation.setDescription(donationForm.getDescription());

            // Set category
            try {
                donation.setCategory(Donation.DonationCategory.valueOf(donationForm.getCategory()));
            } catch (IllegalArgumentException e) {
                logger.warn("Invalid donation category: {}", donationForm.getCategory());
                donation.setCategory(Donation.DonationCategory.OTHER);
            }

            donation.setQuantity(donationForm.getQuantity());

            // Set dates
            try {
                donation.setExpiryDate(LocalDate.parse(donationForm.getExpiryDate()));
            } catch (Exception e) {
                logger.warn("Invalid expiry date format: {}", donationForm.getExpiryDate());
                donation.setExpiryDate(foodItem.getExpiryDate());
            }

            try {
                if (donationForm.getPreparationDate() != null && !donationForm.getPreparationDate().isEmpty()) {
                    donation.setPreparationDate(LocalDate.parse(donationForm.getPreparationDate()));
                }
            } catch (Exception e) {
                logger.warn("Invalid preparation date format: {}", donationForm.getPreparationDate());
            }

            donation.setLocation(donationForm.getLocation());
            donation.setDonorType(donationForm.getDonorType());
            donation.setPackaging(donationForm.getPackaging());
            donation.setStorageInstructions(donationForm.getStorageInstructions());

            // FIX: Create a new copy of dietary info to avoid shared references
            if (donationForm.getDietaryInfo() != null) {
                donation.setDietaryInfo(new ArrayList<>(donationForm.getDietaryInfo()));
            }

            // IMPORTANT: Copy image data from original food item
            donation.setImageData(foodItem.getImageData());
            donation.setImageContentType(foodItem.getImageContentType());

            // Set additional fields based on food category
            if (donation.getCategory() == Donation.DonationCategory.RESTAURANT_SURPLUS) {
                donation.setCuisineType(donationForm.getFoodType());
            } else if (donation.getCategory() == Donation.DonationCategory.GROCERY_EXCESS) {
                donation.setProductType(donationForm.getFoodType());
            }

            // Set merchant-specific fields
            donation.setDonorId(donationForm.getDonorId());
            donation.setDonorRole("MERCHANT");
            donation.setOriginalFoodItemId(donationForm.getOriginalFoodItemId());
            donation.setStoreName(donationForm.getStoreName());

            // Set status and timestamps
            logger.info("Setting donation status to: {}", Donation.STATUS_ACTIVE);
            donation.setStatus(Donation.STATUS_ACTIVE);
            donation.setCreatedAt(LocalDate.now());
            donation.setUpdatedAt(LocalDate.now());

            // Add notes if provided
            if (donationForm.getNotes() != null && !donationForm.getNotes().isEmpty()) {
                String description = donation.getDescription();
                if (description == null) {
                    description = "Notes: " + donationForm.getNotes();
                } else {
                    description += "\n\nNotes: " + donationForm.getNotes();
                }
                donation.setDescription(description);
            }

            // Save the donation
            Donation savedDonation = donationRepository.save(donation);
            logger.info("Successfully created donation with ID: {} and status: '{}'",
                    savedDonation.getId(), savedDonation.getStatus());

            int donationQuantity = Integer.parseInt(donationForm.getQuantity());
            foodItem.setQuantity(foodItem.getQuantity() - donationQuantity);
            foodItemRepository.save(foodItem);

            return savedDonation;

        } catch (Exception e) {
            logger.error("Error creating donation from form: {}", e.getMessage(), e);
            throw new RuntimeException("Error creating donation: " + e.getMessage(), e);
        }
    }
    /**
     * Calculate the total quantity donated for a specific food item
     *
     * @param foodItemId The ID of the original food item
     * @return The total quantity donated, or 0 if none or error
     */
    public Integer getTotalDonatedQuantity(Long foodItemId) {
        if (foodItemId == null) {
            logger.warn("Null foodItemId passed to getTotalDonatedQuantity");
            return 0;
        }

        logger.info("Calculating total donated quantity for food item ID: {}", foodItemId);

        try {
            // Find all donations that reference this food item
            List<Donation> donations = donationRepository.findByOriginalFoodItemId(foodItemId);

            if (donations.isEmpty()) {
                logger.info("No donations found for food item ID: {}", foodItemId);
                return 0;
            }

            // Sum up the quantities
            int totalDonated = 0;

            for (Donation donation : donations) {
                // Skip deleted donations
                if ("DELETED".equals(donation.getStatus())) {
                    continue;
                }

                String quantityStr = donation.getQuantity();
                if (quantityStr == null || quantityStr.isEmpty()) {
                    continue;
                }

                // Extract numeric part from quantity string (e.g., "5 servings" -> 5)
                try {
                    // Extract digits only from the quantity string
                    String numericPart = quantityStr.replaceAll("[^0-9]", "");
                    if (!numericPart.isEmpty()) {
                        int quantity = Integer.parseInt(numericPart);
                        totalDonated += quantity;
                        logger.debug("Added quantity {} from donation ID {}, new total: {}",
                                quantity, donation.getId(), totalDonated);
                    }
                } catch (NumberFormatException e) {
                    logger.warn("Could not parse quantity for donation ID {}: {}",
                            donation.getId(), donation.getQuantity());
                }
            }

            logger.info("Total donated quantity for food item ID {}: {}", foodItemId, totalDonated);
            return totalDonated;

        } catch (Exception e) {
            logger.error("Error calculating donated quantity for food item ID {}: {}",
                    foodItemId, e.getMessage(), e);
            return 0;
        }
    }
    /**
     * Delete a donation created by a merchant with safe approach
     */
    @Transactional
    public void deleteDonation(Long donationId, Long merchantId) {
        logger.info("Deleting donation ID: {} for merchant ID: {}", donationId, merchantId);

        try {
            // Find the donation
            Donation donation = donationRepository.findById(donationId)
                    .orElseThrow(() -> new RuntimeException("Donation not found with ID: " + donationId));

            // Verify ownership
            if (!donation.getDonorId().equals(merchantId)) {
                throw new IllegalStateException("This donation does not belong to the merchant");
            }

            // ✅ SAFE APPROACH: Try soft delete first, then hard delete
            try {
                // Restore quantity to original food item if needed
                if (donation.getOriginalFoodItemId() != null) {
                    try {
                        FoodItem foodItem = foodItemRepository.findById(donation.getOriginalFoodItemId())
                                .orElse(null);
                        if (foodItem != null) {
                            // Parse donation quantity and add it back to food item
                            String quantityStr = donation.getQuantity();
                            if (quantityStr != null && !quantityStr.isEmpty()) {
                                String numericPart = quantityStr.replaceAll("[^0-9]", "");
                                if (!numericPart.isEmpty()) {
                                    int donationQuantity = Integer.parseInt(numericPart);
                                    foodItem.setQuantity(foodItem.getQuantity() + donationQuantity);
                                    foodItemRepository.save(foodItem);
                                    logger.info("Restored {} quantity to food item ID: {}",
                                            donationQuantity, foodItem.getId());
                                }
                            }
                        }
                    } catch (Exception e) {
                        logger.warn("Could not restore quantity to food item: {}", e.getMessage());
                        // Don't fail the deletion for this
                    }
                }

                // Try hard delete first
                donationRepository.deleteById(donationId);
                logger.info("Successfully hard deleted donation ID: {}", donationId);

            } catch (org.springframework.dao.DataIntegrityViolationException e) {
                // If hard delete fails due to foreign key constraints, use soft delete
                logger.warn("Hard delete failed due to constraints, using soft delete: {}", e.getMessage());

                donation.setStatus("DELETED");
                donation.setUpdatedAt(LocalDate.now());
                donationRepository.save(donation);
                logger.info("Successfully soft deleted donation ID: {}", donationId);
            }

        } catch (IllegalStateException e) {
            logger.warn("Business rule violation: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Error deleting donation: {}", e.getMessage(), e);
            throw new RuntimeException("Error deleting donation: " + e.getMessage(), e);
        }
    }

}