package com.FoodBridgeBangladesh.Model.dto;

public class Receiver_ActiveFood_Request_StatusDTO {
    private Long requestId;
    private String status; // "PENDING", "ACCEPTED", "REJECTED", "COMPLETED"
    private String responseNote;

    // Constructor
    public Receiver_ActiveFood_Request_StatusDTO() {
    }

    // Constructor with parameters
    public Receiver_ActiveFood_Request_StatusDTO(Long requestId, String status, String responseNote) {
        this.requestId = requestId;
        this.status = status;
        this.responseNote = responseNote;
    }

    // Getters and Setters
    public Long getRequestId() {
        return requestId;
    }

    public void setRequestId(Long requestId) {
        this.requestId = requestId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getResponseNote() {
        return responseNote;
    }

    public void setResponseNote(String responseNote) {
        this.responseNote = responseNote;
    }
}