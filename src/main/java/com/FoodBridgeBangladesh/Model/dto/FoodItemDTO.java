package com.FoodBridgeBangladesh.Model.dto;

import com.FoodBridgeBangladesh.Model.merchant.FoodItem;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.ArrayList;

public class FoodItemDTO {
    private Long id;
    private String name;
    private String description;
    private String foodCategory;
    private String foodType;
    private BigDecimal price;
    private Integer quantity;
    private LocalDate expiryDate;
    private String location;
    private String storeName;
    private LocalTime makingTime;
    private String deliveryTime;
    private List<String> dietaryInfo;
    private String imageBase64; // For sending image data to frontend
    private String imageContentType;
    private boolean isPaused;
    private LocalDate createdAt;
    private Integer remainingQuantity;
    private Integer totalQuantity;     // Original quantity


    // Default constructor
    public FoodItemDTO() {
    }

    // Constructor for projection query without image data
    public FoodItemDTO(Long id, String name, String description, FoodItem.FoodCategory foodCategory,
                       String foodType, BigDecimal price, Integer quantity, LocalDate expiryDate,
                       String location, String storeName, LocalTime makingTime, String deliveryTime,
                       boolean isPaused, LocalDate createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.foodCategory = foodCategory.name();
        this.foodType = foodType;
        this.price = price;
        this.quantity = quantity;
        this.expiryDate = expiryDate;
        this.location = location;
        this.storeName = storeName;
        this.makingTime = makingTime;
        this.deliveryTime = deliveryTime;
        this.isPaused = isPaused;
        this.createdAt = createdAt;
        this.dietaryInfo = new ArrayList<>(); // Initialize empty list
    }

    // Convert Entity to DTO (without image data for list views)
    public static FoodItemDTO fromEntity(FoodItem foodItem) {
        FoodItemDTO dto = new FoodItemDTO();
        dto.setId(foodItem.getId());
        dto.setName(foodItem.getName());
        dto.setDescription(foodItem.getDescription());
        dto.setFoodCategory(foodItem.getFoodCategory().name());
        dto.setFoodType(foodItem.getFoodType());
        dto.setPrice(foodItem.getPrice());
        dto.setQuantity(foodItem.getQuantity());
        dto.setExpiryDate(foodItem.getExpiryDate());
        dto.setLocation(foodItem.getLocation());
        dto.setStoreName(foodItem.getStoreName());
        dto.setMakingTime(foodItem.getMakingTime());
        dto.setDeliveryTime(foodItem.getDeliveryTime());
        dto.setDietaryInfo(foodItem.getDietaryInfo());
        dto.setImageContentType(foodItem.getImageContentType());
        dto.setPaused(foodItem.isPaused());
        dto.setCreatedAt(foodItem.getCreatedAt());
        dto.setImageBase64(foodItem.getImageData());

        return dto;
    }

    // Convert Entity to DTO without image data
    public static FoodItemDTO fromEntityWithoutImage(FoodItem foodItem) {
        FoodItemDTO dto = new FoodItemDTO();
        dto.setId(foodItem.getId());
        dto.setName(foodItem.getName());
        dto.setDescription(foodItem.getDescription());
        dto.setFoodCategory(foodItem.getFoodCategory().name());
        dto.setFoodType(foodItem.getFoodType());
        dto.setPrice(foodItem.getPrice());
        dto.setQuantity(foodItem.getQuantity());
        dto.setExpiryDate(foodItem.getExpiryDate());
        dto.setLocation(foodItem.getLocation());
        dto.setStoreName(foodItem.getStoreName());
        dto.setMakingTime(foodItem.getMakingTime());
        dto.setDeliveryTime(foodItem.getDeliveryTime());
        dto.setDietaryInfo(foodItem.getDietaryInfo());
        dto.setImageContentType(foodItem.getImageContentType());
        dto.setPaused(foodItem.isPaused());
        dto.setCreatedAt(foodItem.getCreatedAt());
        // Do not set image data

        return dto;
    }

    // Convert DTO to Entity (used for creating/updating)
    public FoodItem toEntity() {
        FoodItem foodItem = new FoodItem();
        foodItem.setId(this.id);
        foodItem.setName(this.name);
        foodItem.setDescription(this.description);
        foodItem.setFoodCategory(FoodItem.FoodCategory.valueOf(this.foodCategory));
        foodItem.setFoodType(this.foodType);
        foodItem.setPrice(this.price);
        foodItem.setQuantity(this.quantity);
        foodItem.setExpiryDate(this.expiryDate);
        foodItem.setLocation(this.location);
        foodItem.setStoreName(this.storeName);
        foodItem.setMakingTime(this.makingTime);
        foodItem.setDeliveryTime(this.deliveryTime);
        foodItem.setDietaryInfo(this.dietaryInfo);
        foodItem.setImageContentType(this.imageContentType);
        foodItem.setPaused(this.isPaused);

        // Note: Image data will be set separately

        return foodItem;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFoodCategory() {
        return foodCategory;
    }

    public void setFoodCategory(String foodCategory) {
        this.foodCategory = foodCategory;
    }

    public String getFoodType() {
        return foodType;
    }

    public void setFoodType(String foodType) {
        this.foodType = foodType;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getStoreName() {
        return storeName;
    }

    public void setStoreName(String storeName) {
        this.storeName = storeName;
    }

    public LocalTime getMakingTime() {
        return makingTime;
    }

    public void setMakingTime(LocalTime makingTime) {
        this.makingTime = makingTime;
    }

    public String getDeliveryTime() {
        return deliveryTime;
    }

    public void setDeliveryTime(String deliveryTime) {
        this.deliveryTime = deliveryTime;
    }

    public List<String> getDietaryInfo() {
        return dietaryInfo;
    }

    public void setDietaryInfo(List<String> dietaryInfo) {
        this.dietaryInfo = dietaryInfo;
    }

    public String getImageBase64() {
        return imageBase64;
    }

    public void setImageBase64(String imageBase64) {
        this.imageBase64 = imageBase64;
    }

    public String getImageContentType() {
        return imageContentType;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public boolean isPaused() {
        return isPaused;
    }

    public void setPaused(boolean paused) {
        isPaused = paused;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }
    public Integer getRemainingQuantity() {
        return remainingQuantity;
    }

    public void setRemainingQuantity(Integer remainingQuantity) {
        this.remainingQuantity = remainingQuantity;
    }

    public Integer getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(Integer totalQuantity) {
        this.totalQuantity = totalQuantity;
    }
}