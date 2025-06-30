package com.FoodBridgeBangladesh.Model.receiver;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "food_requests")
public class NeedFoodRequestModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // User details
    @Column(name = "user_id", nullable = false)
    private Long userId;

    // Request details
    @Column(name = "priority")
    private String priority;

    @ElementCollection
    @CollectionTable(name = "food_request_types", joinColumns = @JoinColumn(name = "request_id"))
    @Column(name = "food_type")
    private List<String> foodTypes;

    @ElementCollection
    @CollectionTable(name = "food_request_recipients", joinColumns = @JoinColumn(name = "request_id"))
    @Column(name = "recipient")
    private List<String> recipients;

    @Column(name = "people_count")
    private Integer peopleCount;

    @Column(name = "time_needed")
    private String timeNeeded;

    @Column(name = "specific_date")
    private String specificDate;

    @Column(name = "specific_time")
    private String specificTime;

    @Column(name = "location", length = 500)
    private String location;

    @Column(name = "delivery_preference")
    private String deliveryPreference;

    @Column(name = "notes", length = 1000)
    private String notes;

    // Image storage
    @Lob
    @Column(name = "image_data")
    private byte[] imageData;

    @Column(name = "image_content_type")
    private String imageContentType;

    @Column(name = "requested_at")
    private LocalDateTime requestedAt;

    @Column(name = "request_status")
    private String requestStatus;

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

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public List<String> getFoodTypes() {
        return foodTypes;
    }

    public void setFoodTypes(List<String> foodTypes) {
        this.foodTypes = foodTypes;
    }

    public List<String> getRecipients() {
        return recipients;
    }

    public void setRecipients(List<String> recipients) {
        this.recipients = recipients;
    }

    public Integer getPeopleCount() {
        return peopleCount;
    }

    public void setPeopleCount(Integer peopleCount) {
        this.peopleCount = peopleCount;
    }

    public String getTimeNeeded() {
        return timeNeeded;
    }

    public void setTimeNeeded(String timeNeeded) {
        this.timeNeeded = timeNeeded;
    }

    public String getSpecificDate() {
        return specificDate;
    }

    public void setSpecificDate(String specificDate) {
        this.specificDate = specificDate;
    }

    public String getSpecificTime() {
        return specificTime;
    }

    public void setSpecificTime(String specificTime) {
        this.specificTime = specificTime;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDeliveryPreference() {
        return deliveryPreference;
    }

    public void setDeliveryPreference(String deliveryPreference) {
        this.deliveryPreference = deliveryPreference;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public byte[] getImageData() {
        return imageData;
    }

    public void setImageData(byte[] imageData) {
        this.imageData = imageData;
    }

    public String getImageContentType() {
        return imageContentType;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public LocalDateTime getRequestedAt() {
        return requestedAt;
    }

    public void setRequestedAt(LocalDateTime requestedAt) {
        this.requestedAt = requestedAt;
    }

    public String getRequestStatus() {
        return requestStatus;
    }

    public void setRequestStatus(String requestStatus) {
        this.requestStatus = requestStatus;
    }
}