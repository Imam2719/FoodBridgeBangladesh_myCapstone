package com.FoodBridgeBangladesh.Model.receiver;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "saved_donations",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "donation_id"}))
public class SavedDonation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "donation_id", nullable = false)
    private Long donationId;

    @Column(name = "saved_at", nullable = false)
    private LocalDateTime savedAt;

    // Denormalized fields for quick access (optional)
    @Column(name = "food_name")
    private String foodName;

    @Column(name = "food_category")
    private String foodCategory;

    @Column(name = "location")
    private String location;

    @Column(name = "expiry_date")
    private String expiryDate;

    @Column(name = "donor_name")
    private String donorName;

    // Constructors
    public SavedDonation() {
        this.savedAt = LocalDateTime.now();
    }

    public SavedDonation(Long userId, Long donationId) {
        this.userId = userId;
        this.donationId = donationId;
        this.savedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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
}