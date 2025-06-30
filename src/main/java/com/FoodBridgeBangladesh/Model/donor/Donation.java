package com.FoodBridgeBangladesh.Model.donor;

import com.FoodBridgeBangladesh.Model.merchant.FoodItem;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "donations")
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String foodName;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    private DonationCategory category;

    private String quantity;

    private LocalDate expiryDate;

    private String location;

    private String donorType;

    private LocalDate preparationDate;

    private String storeName;

    public static final String STATUS_ACTIVE = "Active";
    public static final String STATUS_PENDING = "Pending";
    public static final String STATUS_COMPLETED = "Completed";
    public static final String STATUS_DELETED = "DELETED";

    @ElementCollection
    private List<String> dietaryInfo = new ArrayList<>();

    private String packaging;

    @Lob
    @Column(name = "image_data", columnDefinition = "TEXT")
    @Basic(fetch = FetchType.EAGER)
    private String imageData;

    private String imageContentType;

    private String storageInstructions;

    // Restaurant specific fields
    private String cuisineType;
    private LocalTime servedTime;
    private String temperatureRequirements;

    // Homemade food specific fields
    private String ingredients;
    private String servingSize;

    // Corporate donation specific fields
    private String eventName;
    private String corporateName;
    private String contactPerson;

    // Grocery specific fields
    private String productType;
    private String brandName;
    private LocalDate bestBeforeDate;

    private String status; // Active, Completed, Expired

    @Column(name = "donor_id")
    private Long donorId;

    // Add user role field
    @Column(name = "donor_role")
    private String donorRole;

    private LocalDate createdAt;

    private LocalDate updatedAt;

    // Add these fields to your Donation class
    private Double latitude;
    private Double longitude;

    // And add their getters and setters
    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
    // Optional: Link to the original food item if created from merchant item
    @Column(name = "original_food_item_id")
    private Long originalFoodItemId;

    // Enum for donation categories
    public enum DonationCategory {
        HOMEMADE_FOOD("Homemade Food"),
        RESTAURANT_SURPLUS("Restaurant & Café Surplus"),
        CORPORATE_DONATION("Corporate & Office Donations"),
        GROCERY_EXCESS("Grocery Store Excess"),
        EVENT_LEFTOVER("Event & Wedding Leftovers"),
        PURCHASED_FOOD("Purchased Food for Donation"),
        OTHER("Other");

        private final String label;

        DonationCategory(String label) {
            this.label = label;
        }

        public String getLabel() {
            return label;
        }
    }

    public static Donation fromFoodItem(FoodItem foodItem) {
        Donation donation = new Donation();
        donation.setFoodName(foodItem.getName());
        donation.setDescription(foodItem.getDescription());

        // ENSURE image data is properly copied
        if (foodItem.getImageData() != null) {
            donation.setImageData(foodItem.getImageData());
            donation.setImageContentType(foodItem.getImageContentType());
        }

        // Set category based on food item category
        if (foodItem.getFoodCategory() == FoodItem.FoodCategory.RESTAURANT) {
            donation.setCategory(DonationCategory.RESTAURANT_SURPLUS);
            donation.setDonorType("Restaurant");
            donation.setCuisineType(foodItem.getFoodType());
        } else if (foodItem.getFoodCategory() == FoodItem.FoodCategory.GROCERY) {
            donation.setCategory(DonationCategory.GROCERY_EXCESS);
            donation.setDonorType("Grocery Store");
            donation.setProductType(foodItem.getFoodType());
        }

        donation.setQuantity(foodItem.getQuantity().toString());
        donation.setExpiryDate(foodItem.getExpiryDate());
        donation.setLocation(foodItem.getLocation());
        donation.setStoreName(foodItem.getStoreName());

        // FIX: Create a new copy of dietary info instead of sharing reference
        donation.setDietaryInfo(foodItem.getDietaryInfo() != null ?
                new ArrayList<>(foodItem.getDietaryInfo()) : new ArrayList<>());

        donation.setImageData(foodItem.getImageData());
        donation.setImageContentType(foodItem.getImageContentType());
        donation.setStatus("Active");
        donation.setCreatedAt(LocalDate.now());
        donation.setUpdatedAt(LocalDate.now());
        donation.setOriginalFoodItemId(foodItem.getId());

        return donation;
    }
    // Constructors, getters, and setters

    public Donation() {
        this.createdAt = LocalDate.now();
        this.updatedAt = LocalDate.now();
        this.status = "Active";
    }

    // Add pre-update lifecycle hook to update the updatedAt timestamp
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDate.now();
    }

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public DonationCategory getCategory() {
        return category;
    }

    public void setCategory(DonationCategory category) {
        this.category = category;
    }

    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
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

    public String getDonorType() {
        return donorType;
    }

    public void setDonorType(String donorType) {
        this.donorType = donorType;
    }

    public LocalDate getPreparationDate() {
        return preparationDate;
    }

    public void setPreparationDate(LocalDate preparationDate) {
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

    public LocalTime getServedTime() {
        return servedTime;
    }

    public void setServedTime(LocalTime servedTime) {
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

    public LocalDate getBestBeforeDate() {
        return bestBeforeDate;
    }

    public void setBestBeforeDate(LocalDate bestBeforeDate) {
        this.bestBeforeDate = bestBeforeDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getDonorId() {
        return donorId;
    }

    public void setDonorId(Long donorId) {
        this.donorId = donorId;
    }

    public String getDonorRole() {
        return donorRole;
    }

    public void setDonorRole(String donorRole) {
        this.donorRole = donorRole;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDate getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDate updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Long getOriginalFoodItemId() {
        return originalFoodItemId;
    }

    public void setOriginalFoodItemId(Long originalFoodItemId) {
        this.originalFoodItemId = originalFoodItemId;
    }

    public String getStoreName() {
        return storeName;
    }

    public void setStoreName(String storeName) {
        this.storeName = storeName;
    }
}

