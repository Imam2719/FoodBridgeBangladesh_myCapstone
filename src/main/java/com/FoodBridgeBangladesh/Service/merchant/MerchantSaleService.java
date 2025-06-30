package com.FoodBridgeBangladesh.Service.merchant;

import com.FoodBridgeBangladesh.Model.donor.Donation;
import com.FoodBridgeBangladesh.Model.dto.DonationFormDTO;
import com.FoodBridgeBangladesh.Model.merchant.FoodItem;
import com.FoodBridgeBangladesh.Model.merchant.MerchantSale;
import com.FoodBridgeBangladesh.Repository.donor.DonationRepository;
import com.FoodBridgeBangladesh.Repository.merchant.FoodItemRepository;
import com.FoodBridgeBangladesh.Repository.merchant.MerchantSaleRepository;
import com.FoodBridgeBangladesh.Service.donor.DonationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MerchantSaleService {

    private static final Logger logger = LoggerFactory.getLogger(MerchantSaleService.class);

    private final MerchantSaleRepository merchantSaleRepository;
    private final FoodItemRepository foodItemRepository;
    private final DonationService donationService;
    private final DonationRepository donationRepository;

    @Autowired
    public MerchantSaleService(MerchantSaleRepository merchantSaleRepository,
                               FoodItemRepository foodItemRepository,
                               DonationService donationService,
                               DonationRepository donationRepository) {
        this.merchantSaleRepository = merchantSaleRepository;
        this.foodItemRepository = foodItemRepository;
        this.donationService = donationService;
        this.donationRepository = donationRepository;
    }

    /**
     * Create a new sale and donation from a food item with partial quantity
     */
    @Transactional
    public Map<String, Object> createSaleAndDonation(Long foodItemId, Long donorId, Integer requestedQuantity,
                                                     String paymentMethod, MultipartFile imageFile) throws IOException {
        logger.info("Creating sale and donation for food item ID: {}, donor ID: {}, quantity: {}",
                foodItemId, donorId, requestedQuantity);

        // Validate inputs
        if (requestedQuantity <= 0) {
            throw new IllegalArgumentException("Requested quantity must be greater than zero");
        }

        // Get the food item
        FoodItem foodItem = foodItemRepository.findById(foodItemId)
                .orElseThrow(() -> new RuntimeException("Food item not found with ID: " + foodItemId));

        // Check if the food item is available and not paused
        if (foodItem.isPaused()) {
            throw new IllegalStateException("Food item is currently not available for donation");
        }

        // Check if there's enough quantity available
        int totalSold = merchantSaleRepository.getTotalSoldQuantityByFoodItemId(foodItemId) != null ?
                merchantSaleRepository.getTotalSoldQuantityByFoodItemId(foodItemId) : 0;
        int availableQuantity = foodItem.getQuantity() - totalSold;

        if (requestedQuantity > availableQuantity) {
            throw new IllegalArgumentException("Requested quantity exceeds available quantity. Available: " + availableQuantity);
        }

        // Create a donation form DTO
        DonationFormDTO donationForm = new DonationFormDTO();
        donationForm.setFoodName(foodItem.getName());
        donationForm.setDescription(foodItem.getDescription());

        // Set category based on food item category
        if (foodItem.getFoodCategory() == FoodItem.FoodCategory.RESTAURANT) {
            donationForm.setCategory("RESTAURANT_SURPLUS");
            donationForm.setDonorType("Purchaser");
            donationForm.setCuisineType(foodItem.getFoodType());
        } else if (foodItem.getFoodCategory() == FoodItem.FoodCategory.GROCERY) {
            donationForm.setCategory("GROCERY_EXCESS");
            donationForm.setDonorType("Purchaser");
            donationForm.setProductType(foodItem.getFoodType());
        } else {
            donationForm.setCategory("PURCHASED_FOOD");
            donationForm.setDonorType("Purchaser");
        }

        donationForm.setQuantity(requestedQuantity.toString());
        donationForm.setExpiryDate(foodItem.getExpiryDate().toString());
        donationForm.setLocation(foodItem.getLocation());
        donationForm.setCorporateName(foodItem.getStoreName());

        // FIX: Create a new copy of the dietary info list instead of sharing reference
        donationForm.setDietaryInfo(foodItem.getDietaryInfo() != null ?
                new ArrayList<>(foodItem.getDietaryInfo()) : new ArrayList<>());

        donationForm.setDonorId(donorId);
        donationForm.setDonorRole("PURCHASER");
        donationForm.setOriginalFoodItemId(foodItemId);

        // Set image data from food item
        donationForm.setImageBase64(foodItem.getImageData());
        String contentType = foodItem.getImageContentType();
        if (contentType == null || contentType.isEmpty()) {
            contentType = "image/jpeg";
        }
        donationForm.setImageContentType(contentType);

        // Create the donation
        Donation donation = donationService.createDonation(donationForm, imageFile, foodItem);

        // Create a merchant sale record
        MerchantSale sale = new MerchantSale();
        sale.setFoodItemId(foodItemId);
        sale.setMerchantId(foodItem.getMerchantId());
        sale.setDonorId(donorId);
        sale.setDonationId(donation.getId());
        sale.setQuantitySold(requestedQuantity);
        sale.setPricePerUnit(foodItem.getPrice());
        sale.setTotalAmount(foodItem.getPrice().multiply(new BigDecimal(requestedQuantity)));
        sale.setSaleDate(LocalDate.now());
        sale.setSaleStatus("COMPLETED");
        sale.setPaymentMethod(paymentMethod);

        // Save the sale record
        MerchantSale savedSale = merchantSaleRepository.save(sale);

        // Update food item quantity
        int currentQuantity = foodItem.getQuantity();
        int newQuantity = currentQuantity - requestedQuantity;

        logger.info("Reducing food item quantity: {} - {} = {}", currentQuantity, requestedQuantity, newQuantity);

        foodItem.setQuantity(newQuantity);

        // Auto-pause if no quantity remaining
        if (newQuantity <= 0) {
            foodItem.setPaused(true);
            logger.info("Auto-pausing food item ID: {} as all quantities are sold/donated", foodItemId);
        }

        // Save the updated food item
        foodItemRepository.save(foodItem);

        // Return result
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "Purchase completed successfully");
        result.put("sale", savedSale);
        result.put("donation", donation);
        result.put("remainingQuantity", newQuantity);

        logger.info("Successfully created sale ID: {} and donation ID: {} for food item ID: {}. New quantity: {}",
                savedSale.getId(), donation.getId(), foodItemId, newQuantity);

        return result;
    }

    /**
     * Get a merchant sale by ID
     */
    public MerchantSale getSaleById(Long id) {
        return merchantSaleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Merchant sale not found with ID: " + id));
    }

    /**
     * Update sale status
     */
    @Transactional
    public MerchantSale updateSaleStatus(Long id, String status) {
        MerchantSale sale = getSaleById(id);
        sale.setSaleStatus(status);
        return merchantSaleRepository.save(sale);
    }

    /**
     * Get all sales for a merchant with detailed information
     */
    public List<Map<String, Object>> getMerchantSalesWithDetails(Long merchantId) {
        logger.info("Fetching detailed sales for merchant ID: {}", merchantId);

        List<MerchantSale> sales = merchantSaleRepository.findByMerchantId(merchantId);
        List<Map<String, Object>> detailedSales = new ArrayList<>();

        for (MerchantSale sale : sales) {
            Map<String, Object> saleDetails = new HashMap<>();
            saleDetails.put("id", sale.getId());
            saleDetails.put("saleDate", sale.getSaleDate());
            saleDetails.put("quantitySold", sale.getQuantitySold());
            saleDetails.put("pricePerUnit", sale.getPricePerUnit());
            saleDetails.put("totalAmount", sale.getTotalAmount());
            saleDetails.put("saleStatus", sale.getSaleStatus());
            saleDetails.put("paymentMethod", sale.getPaymentMethod());
            saleDetails.put("transactionId", sale.getTransactionId());
            saleDetails.put("createdAt", sale.getCreatedAt());

            // Get food item details
            try {
                FoodItem foodItem = foodItemRepository.findById(sale.getFoodItemId()).orElse(null);
                if (foodItem != null) {
                    saleDetails.put("foodItemName", foodItem.getName());
                    saleDetails.put("foodItemDescription", foodItem.getDescription());
                    saleDetails.put("foodCategory", foodItem.getFoodCategory());
                    saleDetails.put("storeName", foodItem.getStoreName());
                    saleDetails.put("location", foodItem.getLocation());
                } else {
                    saleDetails.put("foodItemName", "Item not found");
                    saleDetails.put("foodItemDescription", "");
                    saleDetails.put("foodCategory", "");
                    saleDetails.put("storeName", "");
                    saleDetails.put("location", "");
                }
            } catch (Exception e) {
                logger.warn("Could not fetch food item details for sale ID: {}", sale.getId(), e);
                saleDetails.put("foodItemName", "Error loading item");
                saleDetails.put("foodItemDescription", "");
                saleDetails.put("foodCategory", "");
                saleDetails.put("storeName", "");
                saleDetails.put("location", "");
            }

            // Get donation details if available
            if (sale.getDonationId() != null) {
                try {
                    Donation donation = donationRepository.findById(sale.getDonationId()).orElse(null);
                    if (donation != null) {
                        saleDetails.put("donationStatus", donation.getStatus());
                        saleDetails.put("donationLocation", donation.getLocation());
                    }
                } catch (Exception e) {
                    logger.warn("Could not fetch donation details for sale ID: {}", sale.getId(), e);
                }
            }

            detailedSales.add(saleDetails);
        }

        logger.info("Fetched {} detailed sales for merchant ID: {}", detailedSales.size(), merchantId);
        return detailedSales;
    }

    /**
     * Get all sales for a merchant
     */
    public List<MerchantSale> getMerchantSales(Long merchantId) {
        return merchantSaleRepository.findByMerchantId(merchantId);
    }

    /**
     * Get all sales for a donor
     */
    public List<MerchantSale> getDonorSales(Long donorId) {
        return merchantSaleRepository.findByDonorId(donorId);
    }

    /**
     * Delete a merchant sale permanently
     */
    @Transactional
    public boolean deleteSale(Long saleId, Long merchantId) {
        logger.info("Attempting to delete sale ID: {} for merchant ID: {}", saleId, merchantId);

        try {
            // Verify the sale exists and belongs to the merchant
            MerchantSale sale = merchantSaleRepository.findById(saleId)
                    .orElseThrow(() -> new RuntimeException("Sale not found with ID: " + saleId));

            if (!sale.getMerchantId().equals(merchantId)) {
                throw new SecurityException("Sale does not belong to the specified merchant");
            }

            // Check if sale is in a state that allows deletion
            if ("PENDING".equals(sale.getSaleStatus())) {
                throw new IllegalStateException("Cannot delete pending sales. Please cancel first.");
            }

            // Delete the sale record
            merchantSaleRepository.deleteById(saleId);

            logger.info("Successfully deleted sale ID: {} for merchant ID: {}", saleId, merchantId);
            return true;

        } catch (Exception e) {
            logger.error("Error deleting sale ID: {} for merchant ID: {}: {}", saleId, merchantId, e.getMessage(), e);
            throw new RuntimeException("Failed to delete sale: " + e.getMessage());
        }
    }

    /**
     * Get total sold quantity for a food item
     */
    public Integer getTotalSoldQuantity(Long foodItemId) {
        Integer soldQuantity = merchantSaleRepository.getTotalSoldQuantityByFoodItemId(foodItemId);
        return soldQuantity != null ? soldQuantity : 0;
    }

    /**
     * Calculate remaining quantity for a food item
     */
    public Integer getRemainingQuantity(Long foodItemId) {
        FoodItem foodItem = foodItemRepository.findById(foodItemId)
                .orElseThrow(() -> new RuntimeException("Food item not found with ID: " + foodItemId));

        Integer soldQuantity = getTotalSoldQuantity(foodItemId);
        return foodItem.getQuantity() - soldQuantity;
    }
}