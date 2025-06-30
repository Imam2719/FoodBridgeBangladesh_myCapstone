package com.FoodBridgeBangladesh.Service.merchant;

import com.FoodBridgeBangladesh.Model.merchant.FoodItem;
import com.FoodBridgeBangladesh.Repository.merchant.FoodItemRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Base64;
import java.util.List;

@Service
public class FoodItemService {

    private static final Logger logger = LoggerFactory.getLogger(FoodItemService.class);

    private final FoodItemRepository foodItemRepository;

    @Autowired
    public FoodItemService(FoodItemRepository foodItemRepository) {
        this.foodItemRepository = foodItemRepository;
    }

    /**
     * Get a food item by ID
     */
    public FoodItem getFoodItemById(Long id) {
        return foodItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Food item not found with id: " + id));
    }

    /**
     * Get all food items for a merchant
     */
    @Transactional(readOnly = true)
    public List<FoodItem> getMerchantFoodItems(Long merchantId) {
        return foodItemRepository.findByMerchantId(merchantId);
    }

    /**
     * Get all active (non-paused) food items
     */
    public List<FoodItem> getAllActiveFoodItems() {
        return foodItemRepository.findByIsPausedFalse();
    }

    /**
     * Search for food items by name or description
     */
    public List<FoodItem> searchFoodItems(String searchTerm) {
        return foodItemRepository.searchActiveItems(searchTerm);
    }

    /**
     * Filter food items by category
     */
    public List<FoodItem> filterByCategory(FoodItem.FoodCategory category) {
        return foodItemRepository.findByFoodCategory(category);
    }

    /**
     * Create a new food item - updated for Base64 storage
     */
    @Transactional
    public FoodItem createFoodItem(FoodItem foodItem, MultipartFile imageFile) throws IOException {
        // Set creation date
        foodItem.setCreatedAt(LocalDate.now());

        // Process and set image if provided - using Base64 encoding
        if (imageFile != null && !imageFile.isEmpty()) {
            byte[] imageBytes = imageFile.getBytes();
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);

            // Additional logging for debugging
            logger.info("Image bytes length: {}, Base64 string length: {}",
                    imageBytes.length, base64Image.length());

            // Set image data and content type
            foodItem.setImageData(base64Image);
            foodItem.setImageContentType(imageFile.getContentType());
        } else {
            // Explicitly set to null to avoid any potential issues
            foodItem.setImageData(null);
            foodItem.setImageContentType(null);
        }

        // Save with explicit transaction management
        return foodItemRepository.save(foodItem);
    }

    /**
     * Update an existing food item - updated for Base64 storage
     */
    @Transactional
    public FoodItem updateFoodItem(Long id, FoodItem foodItemDetails, MultipartFile imageFile) throws IOException {
        FoodItem existingItem = getFoodItemById(id);

        // Update basic info
        existingItem.setName(foodItemDetails.getName());
        existingItem.setDescription(foodItemDetails.getDescription());
        existingItem.setFoodCategory(foodItemDetails.getFoodCategory());
        existingItem.setFoodType(foodItemDetails.getFoodType());
        existingItem.setPrice(foodItemDetails.getPrice());
        existingItem.setQuantity(foodItemDetails.getQuantity());
        existingItem.setExpiryDate(foodItemDetails.getExpiryDate());
        existingItem.setLocation(foodItemDetails.getLocation());
        existingItem.setStoreName(foodItemDetails.getStoreName());
        existingItem.setMakingTime(foodItemDetails.getMakingTime());
        existingItem.setDeliveryTime(foodItemDetails.getDeliveryTime());
        existingItem.setDietaryInfo(foodItemDetails.getDietaryInfo());

        // Update image if a new one is provided - using Base64 encoding
        if (imageFile != null && !imageFile.isEmpty()) {
            byte[] imageBytes = imageFile.getBytes();
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);

            logger.info("Update - Image bytes length: {}, Base64 string length: {}",
                    imageBytes.length, base64Image.length());

            existingItem.setImageData(base64Image);
            existingItem.setImageContentType(imageFile.getContentType());
        }

        return foodItemRepository.save(existingItem);
    }

    /**
     * Delete a food item
     */
    public void deleteFoodItem(Long id) {
        if (!foodItemRepository.existsById(id)) {
            throw new EntityNotFoundException("Food item not found with id: " + id);
        }
        foodItemRepository.deleteById(id);
    }

    /**
     * Toggle the pause status of a food item
     */
    @Transactional
    public FoodItem togglePauseStatus(Long id) {
        FoodItem foodItem = getFoodItemById(id);
        foodItem.setPaused(!foodItem.isPaused());
        return foodItemRepository.save(foodItem);
    }

    /**
     * Get the image data for a food item - now returns decoded bytes from Base64
     */
    public byte[] getFoodItemImage(Long id) {
        FoodItem foodItem = getFoodItemById(id);
        String base64ImageData = foodItem.getImageData();
        if (base64ImageData != null && !base64ImageData.isEmpty()) {
            return Base64.getDecoder().decode(base64ImageData);
        }
        return null;
    }

    /**
     * Get Base64 image string - now directly returns the stored Base64 string
     */
    public String getImageBase64(Long id) {
        FoodItem foodItem = getFoodItemById(id);
        return foodItem.getImageData(); // Already in Base64 format
    }

    /**
     * Find items expiring soon (for notifications)
     */
    public List<FoodItem> findItemsExpiringSoon() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        return foodItemRepository.findByExpiryDateBefore(tomorrow);
    }


}