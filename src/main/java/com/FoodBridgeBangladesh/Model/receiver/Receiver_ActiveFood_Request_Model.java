package com.FoodBridgeBangladesh.Model.receiver;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "receiver_food_requests")
public class Receiver_ActiveFood_Request_Model {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pickup_method")
    private String pickupMethod;

    @Column(name = "donation_id", nullable = false)
    private Long donationId;

    @Column(name = "receiver_id", nullable = false)
    private Long receiverId;

    @Column(name = "request_date")
    private LocalDateTime requestDate;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "note", length = 500)
    private String note;

    @Column(name = "status")
    private String status; // "PENDING", "ACCEPTED", "REJECTED", "COMPLETED"

    @Column(name = "response_date")
    private LocalDateTime responseDate;

    @Column(name = "response_note", length = 500)
    private String responseNote;

    // Default constructor
    public Receiver_ActiveFood_Request_Model() {
        this.requestDate = LocalDateTime.now();
        this.status = "PENDING";
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public String getPickupMethod() {
        return pickupMethod;
    }

    public void setPickupMethod(String pickupMethod) {
        this.pickupMethod = pickupMethod;
    }
    public Long getDonationId() {
        return donationId;
    }

    public void setDonationId(Long donationId) {
        this.donationId = donationId;
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
    }

    public LocalDateTime getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(LocalDateTime requestDate) {
        this.requestDate = requestDate;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getResponseDate() {
        return responseDate;
    }

    public void setResponseDate(LocalDateTime responseDate) {
        this.responseDate = responseDate;
    }

    public String getResponseNote() {
        return responseNote;
    }

    public void setResponseNote(String responseNote) {
        this.responseNote = responseNote;
    }
}