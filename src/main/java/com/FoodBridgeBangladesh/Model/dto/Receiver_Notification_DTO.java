package com.FoodBridgeBangladesh.Model.dto;

import com.FoodBridgeBangladesh.Model.receiver.Receiver_ActiveFood_Request_Model;
import java.time.LocalDateTime;

public class Receiver_Notification_DTO {
    private Long id;
    private Long requestId;
    private Long donationId;
    private String foodName;
    private String status; // e.g., "ACCEPTED"
    private String donorName;
    private String donorContact;
    private String pickupMethod;
    private LocalDateTime responseDate;
    private String responseNote;

    private String donorAddress;  // Add donor address
    private String donorProfileImage;  // Add profile image

    private String receiverName;
    private String receiverPhone;
    private String receiverAddress;
    private String receiverProfileImage;

    // Donation-related fields
    private String pickupLocation;  // From Donation table

    private String foodImageData;
    private String foodImageContentType;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getRequestId() { return requestId; }
    public void setRequestId(Long requestId) { this.requestId = requestId; }

    public Long getDonationId() { return donationId; }
    public void setDonationId(Long donationId) { this.donationId = donationId; }

    public String getFoodName() { return foodName; }
    public void setFoodName(String foodName) { this.foodName = foodName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDonorName() { return donorName; }
    public void setDonorName(String donorName) { this.donorName = donorName; }

    public String getDonorContact() { return donorContact; }
    public void setDonorContact(String donorContact) { this.donorContact = donorContact; }

    public String getPickupMethod() { return pickupMethod; }
    public void setPickupMethod(String pickupMethod) { this.pickupMethod = pickupMethod; }

    public LocalDateTime getResponseDate() { return responseDate; }
    public void setResponseDate(LocalDateTime responseDate) { this.responseDate = responseDate; }

    public String getResponseNote() { return responseNote; }
    public void setResponseNote(String responseNote) { this.responseNote = responseNote; }

    // Constructor and fromRequestModel method
    public Receiver_Notification_DTO() {}

    public static Receiver_Notification_DTO fromRequestModel(Receiver_ActiveFood_Request_Model request) {
        Receiver_Notification_DTO dto = new Receiver_Notification_DTO();
        dto.setId(request.getId());
        dto.setRequestId(request.getId());
        dto.setDonationId(request.getDonationId());
        dto.setStatus(request.getStatus());
        dto.setResponseDate(request.getResponseDate());
        dto.setResponseNote(request.getResponseNote());
        dto.setPickupMethod(request.getPickupMethod());
        return dto;
    }
}