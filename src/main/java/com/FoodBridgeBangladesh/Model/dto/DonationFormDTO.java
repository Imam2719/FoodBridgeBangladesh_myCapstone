package com.FoodBridgeBangladesh.Model.dto;

import java.util.List;

public class DonationFormDTO {
    private Long id;
    private String foodName;
    private String description;
    private String category;
    private String quantity;
    private String expiryDate;
    private String location;
    private String donorType;
    private String preparationDate;
    private List<String> dietaryInfo;
    private String packaging;
    private String imageBase64;
    private String storageInstructions;

    private String imageContentType;
    // Category-specific fields
    private String cuisineType;
    private String servedTime;
    private String temperatureRequirements;
    private String ingredients;
    private String servingSize;
    private String eventName;
    private String corporateName;
    private String contactPerson;
    private String productType;
    private String brandName;
    private String bestBeforeDate;

    private Long originalFoodItemId;
    private Long donorId;
    private String donorRole;
    private String foodType;
    private String storeName;
    private String notes;




    // Convert from FoodItemDTO to initial DonationFormDTO
    public static DonationFormDTO fromFoodItemDTO(FoodItemDTO foodItemDTO) {
        DonationFormDTO dto = new DonationFormDTO();
        dto.setFoodName(foodItemDTO.getName());
        dto.setDescription(foodItemDTO.getDescription());

        // Set category based on food category
        if (foodItemDTO.getFoodCategory().equals("RESTAURANT")) {
            dto.setCategory("RESTAURANT_SURPLUS");
            dto.setDonorType("Restaurant");
            dto.setCuisineType(foodItemDTO.getFoodType());
        } else if (foodItemDTO.getFoodCategory().equals("GROCERY")) {
            dto.setCategory("GROCERY_EXCESS");
            dto.setDonorType("Grocery Store");
            dto.setProductType(foodItemDTO.getFoodType());
        }

        dto.setQuantity(foodItemDTO.getQuantity().toString());
        dto.setExpiryDate(foodItemDTO.getExpiryDate().toString());
        dto.setLocation(foodItemDTO.getLocation());
        dto.setCorporateName(foodItemDTO.getStoreName());
        dto.setDietaryInfo(foodItemDTO.getDietaryInfo());
        dto.setImageBase64(foodItemDTO.getImageBase64());
        dto.setOriginalFoodItemId(foodItemDTO.getId());

        return dto;
    }

    // Getters and setters (abbreviated for brevity)

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    // Add all remaining getters and setters for all fields
    public String getFoodName() {
        return foodName;
    }

    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    public String getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(String expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDonorType() {
        return donorType;
    }

    public void setDonorType(String donorType) {
        this.donorType = donorType;
    }

    public String getPreparationDate() {
        return preparationDate;
    }

    public void setPreparationDate(String preparationDate) {
        this.preparationDate = preparationDate;
    }

    public List<String> getDietaryInfo() {
        return dietaryInfo;
    }

    public void setDietaryInfo(List<String> dietaryInfo) {
        this.dietaryInfo = dietaryInfo;
    }

    public String getPackaging() {
        return packaging;
    }

    public void setPackaging(String packaging) {
        this.packaging = packaging;
    }

    public String getImageBase64() {
        return imageBase64;
    }

    public void setImageBase64(String imageBase64) {
        this.imageBase64 = imageBase64;
    }

    public String getStorageInstructions() {
        return storageInstructions;
    }

    public void setStorageInstructions(String storageInstructions) {
        this.storageInstructions = storageInstructions;
    }

    public String getCuisineType() {
        return cuisineType;
    }

    public void setCuisineType(String cuisineType) {
        this.cuisineType = cuisineType;
    }

    public String getServedTime() {
        return servedTime;
    }

    public void setServedTime(String servedTime) {
        this.servedTime = servedTime;
    }

    public String getTemperatureRequirements() {
        return temperatureRequirements;
    }

    public void setTemperatureRequirements(String temperatureRequirements) {
        this.temperatureRequirements = temperatureRequirements;
    }

    public String getIngredients() {
        return ingredients;
    }

    public void setIngredients(String ingredients) {
        this.ingredients = ingredients;
    }

    public String getServingSize() {
        return servingSize;
    }

    public void setServingSize(String servingSize) {
        this.servingSize = servingSize;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getCorporateName() {
        return corporateName;
    }

    public void setCorporateName(String corporateName) {
        this.corporateName = corporateName;
    }

    public String getContactPerson() {
        return contactPerson;
    }

    public void setContactPerson(String contactPerson) {
        this.contactPerson = contactPerson;
    }

    public String getProductType() {
        return productType;
    }

    public void setProductType(String productType) {
        this.productType = productType;
    }

    public String getBrandName() {
        return brandName;
    }

    public void setBrandName(String brandName) {
        this.brandName = brandName;
    }

    public String getBestBeforeDate() {
        return bestBeforeDate;
    }

    public void setBestBeforeDate(String bestBeforeDate) {
        this.bestBeforeDate = bestBeforeDate;
    }

    public Long getOriginalFoodItemId() {
        return originalFoodItemId;
    }

    public void setOriginalFoodItemId(Long originalFoodItemId) {
        this.originalFoodItemId = originalFoodItemId;
    }

    public Long getDonorId() {
        return donorId;
    }

    public void setDonorId(Long donorId) {
        this.donorId = donorId;
    }

    // Added missing getter and setter for donorRole
    public String getDonorRole() {
        return donorRole;
    }

    public void setDonorRole(String donorRole) {
        this.donorRole = donorRole;
    }

    public String getImageContentType() {
        return imageContentType;
    }
    public String getFoodType() {
        return foodType;
    }

    public void setFoodType(String foodType) {
        this.foodType = foodType;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }
    public String getStoreName() {
        return storeName;
    }

    public void setStoreName(String storeName) {
        this.storeName = storeName;
    }
    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}