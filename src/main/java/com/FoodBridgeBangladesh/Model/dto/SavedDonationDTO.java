package com.FoodBridgeBangladesh.Model.dto;

import com.FoodBridgeBangladesh.Model.receiver.SavedDonation;
import java.time.LocalDateTime;

public class SavedDonationDTO {
    private Long id;
    private Long donationId;
    private LocalDateTime savedAt;
    private String foodName;
    private String foodCategory;
    private String location;
    private String expiryDate;
    private String donorName;
    private String imageData;
    private String imageContentType;
    private String quantity;
    private String description;

    // Constructors
    public SavedDonationDTO() {}

    public static SavedDonationDTO fromEntity(SavedDonation savedDonation) {
        SavedDonationDTO dto = new SavedDonationDTO();
        dto.setId(savedDonation.getId());
        dto.setDonationId(savedDonation.getDonationId());
        dto.setSavedAt(savedDonation.getSavedAt());
        dto.setFoodName(savedDonation.getFoodName());
        dto.setFoodCategory(savedDonation.getFoodCategory());
        dto.setLocation(savedDonation.getLocation());
        dto.setExpiryDate(savedDonation.getExpiryDate());
        dto.setDonorName(savedDonation.getDonorName());
        return dto;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getDonationId() {
        return donationId;
    }

    public void setDonationId(Long donationId) {
        this.donationId = donationId;
    }

    public LocalDateTime getSavedAt() {
        return savedAt;
    }

    public void setSavedAt(LocalDateTime savedAt) {
        this.savedAt = savedAt;
    }

    public String getFoodName() {
        return foodName;
    }

    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }

    public String getFoodCategory() {
        return foodCategory;
    }

    public void setFoodCategory(String foodCategory) {
        this.foodCategory = foodCategory;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(String expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getDonorName() {
        return donorName;
    }

    public void setDonorName(String donorName) {
        this.donorName = donorName;
    }

    public String getImageData() {
        return imageData;
    }

    public void setImageData(String imageData) {
        this.imageData = imageData;
    }

    public String getImageContentType() {
        return imageContentType;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}