package com.FoodBridgeBangladesh.Service.donor;

import com.FoodBridgeBangladesh.Model.dto.FoodItemDTO;
import com.FoodBridgeBangladesh.Model.merchant.FoodItem;
import com.FoodBridgeBangladesh.Repository.merchant.FoodItemRepository;
import com.FoodBridgeBangladesh.Service.merchant.MerchantSaleService;
import com.FoodBridgeBangladesh.Service.merchant.MerchantDonationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DonationFoodItemService {

    private static final Logger logger = LoggerFactory.getLogger(DonationFoodItemService.class);
    private final FoodItemRepository foodItemRepository;
    private final MerchantSaleService merchantSaleService;
    private final MerchantDonationService merchantDonationService;

    @Autowired
    public DonationFoodItemService(
            FoodItemRepository foodItemRepository,
            MerchantSaleService merchantSaleService,
            MerchantDonationService merchantDonationService) {
        this.foodItemRepository = foodItemRepository;
        this.merchantSaleService = merchantSaleService;
        this.merchantDonationService = merchantDonationService;
    }

    /**
     * Get food items by category with remaining quantity calculated
     * FIXED: Proper empty handling and never returns null
     */
    public List<FoodItemDTO> getFoodItemsByCategory(FoodItem.FoodCategory foodCategory) {
        try {
            logger.info("Fetching food items for category: {}", foodCategory);

            // Get projected DTOs without image data first
            List<FoodItemDTO> dtos = foodItemRepository.findByCategoryAndActiveProjected(foodCategory);

            // Handle null or empty case
            if (dtos == null) {
                logger.info("Repository returned null for category: {}", foodCategory);
                return new ArrayList<>();
            }

            if (dtos.isEmpty()) {
                logger.info("No items found in category: {}", foodCategory);
                return new ArrayList<>();
            }

            logger.info("Found {} items in category", dtos.size());

            // Process each DTO to add image data and calculate remaining quantity
            List<FoodItemDTO> processedDtos = new ArrayList<>();

            for (FoodItemDTO dto : dtos) {
                try {
                    // Fetch the full entity to get image data
                    FoodItem item = foodItemRepository.findById(dto.getId()).orElse(null);

                    if (item == null) {
                        logger.warn("Item with ID {} not found, skipping", dto.getId());
                        continue;
                    }

                    // Set image data
                    dto.setImageBase64(item.getImageData());
                    dto.setImageContentType(item.getImageContentType());

                    // Calculate remaining quantity
                    Integer remainingQuantity = item.getQuantity();
                    if (remainingQuantity == null) {
                        remainingQuantity = 0;
                    }

                    // Get sold and donated quantities for calculation purposes and display
                    Integer soldQuantity = 0;
                    Integer donatedQuantity = 0;

                    try {
                        soldQuantity = merchantSaleService.getTotalSoldQuantity(dto.getId());
                        if (soldQuantity == null) soldQuantity = 0;
                    } catch (Exception e) {
                        logger.warn("Error getting sold quantity for item {}: {}", dto.getId(), e.getMessage());
                    }

                    try {
                        donatedQuantity = merchantDonationService.getTotalDonatedQuantity(dto.getId());
                        if (donatedQuantity == null) donatedQuantity = 0;
                    } catch (Exception e) {
                        logger.warn("Error getting donated quantity for item {}: {}", dto.getId(), e.getMessage());
                    }

                    // Calculate the original total quantity by adding back what was sold/donated
                    Integer originalTotalQuantity = remainingQuantity + soldQuantity + donatedQuantity;

                    // Set quantities correctly
                    dto.setTotalQuantity(originalTotalQuantity);
                    dto.setRemainingQuantity(Math.max(0, remainingQuantity)); // Ensure non-negative
                    dto.setQuantity(dto.getRemainingQuantity()); // For backward compatibility

                    logger.debug("Item {} - Original Total: {}, Sold: {}, Donated: {}, Current Remaining: {}",
                            dto.getId(), originalTotalQuantity, soldQuantity, donatedQuantity, remainingQuantity);

                    // Only add items with remaining quantity > 0
                    if (dto.getRemainingQuantity() > 0) {
                        processedDtos.add(dto);
                    }

                } catch (Exception e) {
                    logger.warn("Could not process item {}: {}", dto.getId(), e.getMessage());
                    // Skip this item and continue with others
                }
            }

            logger.info("Returning {} available items (with remaining quantity > 0) out of {} total items",
                    processedDtos.size(), dtos.size());

            return processedDtos;

        } catch (Exception e) {
            logger.error("Error in getFoodItemsByCategory for {}: {}", foodCategory, e.getMessage(), e);
            // Return empty list instead of throwing exception
            return new ArrayList<>();
        }
    }

    /**
     * Get all available food items for donation with remaining quantity calculated
     * FIXED: Proper empty handling and never returns null
     */
    public List<FoodItemDTO> getAllAvailableFoodItems() {
        logger.info("Getting all available food items for donation");

        try {
            // Get all non-paused food items
            List<FoodItem> foodItems = foodItemRepository.findByIsPausedFalse();

            // Handle null or empty case
            if (foodItems == null || foodItems.isEmpty()) {
                logger.info("No active food items found in database");
                return new ArrayList<>();
            }

            // Convert to DTOs and calculate remaining quantities
            List<FoodItemDTO> availableItems = new ArrayList<>();

            for (FoodItem item : foodItems) {
                try {
                    FoodItemDTO dto = FoodItemDTO.fromEntity(item);

                    // Set image data
                    dto.setImageBase64(item.getImageData());

                    // Calculate remaining quantity
                    Integer remainingQuantity = item.getQuantity();
                    if (remainingQuantity == null) {
                        remainingQuantity = 0;
                    }

                    // Get sold and donated quantities for calculation purposes
                    Integer soldQuantity = 0;
                    Integer donatedQuantity = 0;

                    try {
                        soldQuantity = merchantSaleService.getTotalSoldQuantity(item.getId());
                        if (soldQuantity == null) soldQuantity = 0;
                    } catch (Exception e) {
                        logger.warn("Error getting sold quantity for item {}: {}", item.getId(), e.getMessage());
                    }

                    try {
                        donatedQuantity = merchantDonationService.getTotalDonatedQuantity(item.getId());
                        if (donatedQuantity == null) donatedQuantity = 0;
                    } catch (Exception e) {
                        logger.warn("Error getting donated quantity for item {}: {}", item.getId(), e.getMessage());
                    }

                    // Calculate original total quantity
                    Integer originalTotalQuantity = remainingQuantity + soldQuantity + donatedQuantity;

                    // Set quantities correctly
                    dto.setTotalQuantity(originalTotalQuantity);
                    dto.setRemainingQuantity(Math.max(0, remainingQuantity));
                    dto.setQuantity(dto.getRemainingQuantity()); // For backward compatibility

                    logger.debug("Food item {} - Original Total: {}, Sold: {}, Donated: {}, Current Remaining: {}",
                            item.getId(), originalTotalQuantity, soldQuantity, donatedQuantity, remainingQuantity);

                    // Only add items with remaining quantity > 0
                    if (dto.getRemainingQuantity() > 0) {
                        availableItems.add(dto);
                    }

                } catch (Exception e) {
                    logger.warn("Error processing item {}: {}", item.getId(), e.getMessage());
                    // Skip this item and continue with others
                }
            }

            logger.info("Returning {} available food items with remaining quantity > 0", availableItems.size());
            return availableItems;

        } catch (Exception e) {
            logger.error("Error getting all available food items: {}", e.getMessage(), e);
            // Return empty list instead of null
            return new ArrayList<>();
        }
    }

    /**
     * Get food item details by ID with remaining quantity calculated
     * FIXED: Proper null handling
     */
    public FoodItemDTO getFoodItemDetailsById(Long id) {
        logger.info("Getting food item details by ID: {}", id);

        try {
            FoodItem foodItem = foodItemRepository.findById(id).orElse(null);

            if (foodItem == null) {
                logger.warn("Food item not found with ID: {}", id);
                throw new RuntimeException("Food item not found with ID: " + id);
            }

            FoodItemDTO dto = FoodItemDTO.fromEntity(foodItem);

            // Set image data
            dto.setImageBase64(foodItem.getImageData());

            // Calculate quantities correctly
            try {
                Integer remainingQuantity = foodItem.getQuantity();
                if (remainingQuantity == null) {
                    remainingQuantity = 0;
                }

                // Get sold and donated quantities for calculation purposes
                Integer soldQuantity = 0;
                Integer donatedQuantity = 0;

                try {
                    soldQuantity = merchantSaleService.getTotalSoldQuantity(id);
                    if (soldQuantity == null) soldQuantity = 0;
                } catch (Exception e) {
                    logger.warn("Error getting sold quantity for item {}: {}", id, e.getMessage());
                }

                try {
                    donatedQuantity = merchantDonationService.getTotalDonatedQuantity(id);
                    if (donatedQuantity == null) donatedQuantity = 0;
                } catch (Exception e) {
                    logger.warn("Error getting donated quantity for item {}: {}", id, e.getMessage());
                }

                // Calculate original total quantity
                Integer originalTotalQuantity = remainingQuantity + soldQuantity + donatedQuantity;

                dto.setTotalQuantity(originalTotalQuantity);
                dto.setRemainingQuantity(Math.max(0, remainingQuantity));
                dto.setQuantity(dto.getRemainingQuantity()); // For backward compatibility

                logger.info("Food item {} details - Original Total: {}, Sold: {}, Donated: {}, Current Remaining: {}",
                        id, originalTotalQuantity, soldQuantity, donatedQuantity, remainingQuantity);

            } catch (Exception e) {
                logger.warn("Error calculating quantities for item {}: {}", id, e.getMessage());
                // Fallback: use the current quantity as both total and remaining
                Integer currentQuantity = foodItem.getQuantity() != null ? foodItem.getQuantity() : 0;
                dto.setRemainingQuantity(currentQuantity);
                dto.setTotalQuantity(currentQuantity);
                dto.setQuantity(currentQuantity);
            }

            return dto;

        } catch (Exception e) {
            logger.error("Error getting food item details for ID {}: {}", id, e.getMessage(), e);
            throw new RuntimeException("Error fetching food item details", e);
        }
    }

    /**
     * Check if a food item has available quantity
     * FIXED: Proper null handling
     */
    public boolean hasAvailableQuantity(Long foodItemId) {
        try {
            FoodItem foodItem = foodItemRepository.findById(foodItemId).orElse(null);

            if (foodItem == null || foodItem.isPaused()) {
                return false;
            }

            Integer remainingQuantity = foodItem.getQuantity();
            if (remainingQuantity == null) {
                return false;
            }

            logger.debug("Food item {} availability check - Current remaining quantity: {}",
                    foodItemId, remainingQuantity);

            return remainingQuantity > 0;

        } catch (Exception e) {
            logger.error("Error checking available quantity for food item {}: {}", foodItemId, e.getMessage());
            return false;
        }
    }

    /**
     * Get remaining quantity for a specific food item
     * FIXED: Proper null handling
     */
    public Integer getRemainingQuantity(Long foodItemId) {
        try {
            FoodItem foodItem = foodItemRepository.findById(foodItemId).orElse(null);

            if (foodItem == null) {
                logger.warn("Food item not found with ID: {}", foodItemId);
                return 0;
            }

            Integer remainingQuantity = foodItem.getQuantity();
            if (remainingQuantity == null) {
                return 0;
            }

            logger.debug("Food item {} remaining quantity: {}", foodItemId, remainingQuantity);

            return Math.max(0, remainingQuantity);

        } catch (Exception e) {
            logger.error("Error getting remaining quantity for food item {}: {}", foodItemId, e.getMessage());
            return 0;
        }
    }

    /**
     * Get detailed quantity breakdown for debugging/admin purposes
     */
    public QuantityBreakdown getQuantityBreakdown(Long foodItemId) {
        try {
            FoodItem foodItem = foodItemRepository.findById(foodItemId).orElse(null);

            if (foodItem == null) {
                logger.warn("Food item not found with ID: {}", foodItemId);
                return new QuantityBreakdown(0, 0, 0, 0);
            }

            Integer currentQuantity = foodItem.getQuantity() != null ? foodItem.getQuantity() : 0;
            Integer soldQuantity = 0;
            Integer donatedQuantity = 0;

            try {
                soldQuantity = merchantSaleService.getTotalSoldQuantity(foodItemId);
                if (soldQuantity == null) soldQuantity = 0;
            } catch (Exception e) {
                logger.warn("Error getting sold quantity for breakdown: {}", e.getMessage());
            }

            try {
                donatedQuantity = merchantDonationService.getTotalDonatedQuantity(foodItemId);
                if (donatedQuantity == null) donatedQuantity = 0;
            } catch (Exception e) {
                logger.warn("Error getting donated quantity for breakdown: {}", e.getMessage());
            }

            Integer originalTotal = currentQuantity + soldQuantity + donatedQuantity;

            return new QuantityBreakdown(originalTotal, soldQuantity, donatedQuantity, currentQuantity);

        } catch (Exception e) {
            logger.error("Error getting quantity breakdown for food item {}: {}", foodItemId, e.getMessage());
            return new QuantityBreakdown(0, 0, 0, 0);
        }
    }

    /**
     * Class for detailed quantity information
     */
    public static class QuantityBreakdown {
        private final Integer originalTotal;
        private final Integer sold;
        private final Integer donated;
        private final Integer remaining;

        public QuantityBreakdown(Integer originalTotal, Integer sold, Integer donated, Integer remaining) {
            this.originalTotal = originalTotal != null ? originalTotal : 0;
            this.sold = sold != null ? sold : 0;
            this.donated = donated != null ? donated : 0;
            this.remaining = remaining != null ? remaining : 0;
        }

        public Integer getOriginalTotal() { return originalTotal; }
        public Integer getSold() { return sold; }
        public Integer getDonated() { return donated; }
        public Integer getRemaining() { return remaining; }

        @Override
        public String toString() {
            return String.format("QuantityBreakdown{original=%d, sold=%d, donated=%d, remaining=%d}",
                    originalTotal, sold, donated, remaining);
        }
    }
}