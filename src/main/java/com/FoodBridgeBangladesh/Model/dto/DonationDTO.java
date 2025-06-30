package com.FoodBridgeBangladesh.Model.dto;

import java.time.LocalDate;
import java.util.List;

public class DonationDTO {
    private Long id;
    private String foodName;
    private String description;
    private String category;
    private String quantity;
    private LocalDate expiryDate;
    private String location;
    private List<String> dietaryInfo;
    private String imageData; // Renamed from imageUrl to match frontend expectations
    private String imageContentType; // Added field for image content type
    private Double distance;
    private String donorName;

    // Constructors
    public DonationDTO() {}

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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public List<String> getDietaryInfo() {
        return dietaryInfo;
    }

    public void setDietaryInfo(List<String> dietaryInfo) {
        this.dietaryInfo = dietaryInfo;
    }

    // Renamed from getImageUrl/setImageUrl
    public String getImageData() {
        return imageData;
    }

    public void setImageData(String imageData) {
        this.imageData = imageData;
    }

    // New getter and setter for image content type
    public String getImageContentType() {
        return imageContentType;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public Double getDistance() {
        return distance;
    }

    public void setDistance(Double distance) {
        this.distance = distance;
    }

    public String getDonorName() {
        return donorName;
    }

    public void setDonorName(String donorName) {
        this.donorName = donorName;
    }

    public static DonationDTO fromEntity(com.FoodBridgeBangladesh.Model.donor.Donation donation) {
        DonationDTO dto = new DonationDTO();
        dto.setId(donation.getId());
        dto.setFoodName(donation.getFoodName() != null ? donation.getFoodName() : "Unnamed Food");
        dto.setDescription(donation.getDescription() != null ? donation.getDescription() : "No description available");
        dto.setCategory(donation.getCategory() != null ? donation.getCategory().getLabel() : "Uncategorized");
        dto.setQuantity(donation.getQuantity() != null ? donation.getQuantity() : "Unknown quantity");
        dto.setExpiryDate(donation.getExpiryDate());
        dto.setLocation(donation.getLocation() != null ? donation.getLocation() : "Unknown location");
        dto.setDietaryInfo(donation.getDietaryInfo() != null ? donation.getDietaryInfo() : null);
        dto.setImageData(donation.getImageData()); // Now correctly named
        dto.setImageContentType(donation.getImageContentType() != null ?
                donation.getImageContentType() : "image/jpeg");

        return dto;
    }
}