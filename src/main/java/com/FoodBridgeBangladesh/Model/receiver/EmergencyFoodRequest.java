package com.FoodBridgeBangladesh.Model.receiver;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "emergency_food_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyFoodRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 500)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FoodCategory category;

    @Column(nullable = false)
    private Integer peopleCount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UrgencyLevel urgency;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status = RequestStatus.PENDING;

    @Lob
    @Column(name = "image_data")
    private byte[] imageData;

    @Column(name = "image_content_type")
    private String imageContentType;

    @Column(name = "image_filename")
    private String imageFilename;

    @CreationTimestamp
    @Column(name = "request_date", nullable = false)
    private LocalDateTime requestDate;

    @UpdateTimestamp
    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    @Column(name = "response_date")
    private LocalDateTime responseDate;

    @Column(name = "response_note", columnDefinition = "TEXT")
    private String responseNote;

    @Column(name = "responder_id")
    private Long responderId;

    @Column(name = "responder_name")
    private String responderName;

    @Column(name = "responder_contact")
    private String responderContact;

    // User information (denormalized for quick access)
    @Column(name = "requester_name")
    private String requesterName;

    @Column(name = "requester_email")
    private String requesterEmail;

    @Column(name = "requester_phone")
    private String requesterPhone;

    @Column(name = "is_fulfilled")
    private Boolean isFulfilled = false;

    @Column(name = "fulfillment_date")
    private LocalDateTime fulfillmentDate;

    @Column(name = "priority_score")
    private Integer priorityScore; // Calculated based on urgency and other factors

    // Enums
    public enum FoodCategory {
        MEAL("Complete Meals"),
        WATER("Drinking Water"),
        DRY("Dry Rations"),
        BABY("Baby Food"),
        MIXED("Mixed Food Items");

        private final String displayName;

        FoodCategory(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    public enum UrgencyLevel {
        CRITICAL("Critical - Need within hours", 100),
        HIGH("High - Need today", 75),
        MEDIUM("Medium - Need within 24 hours", 50);

        private final String displayName;
        private final int priorityScore;

        UrgencyLevel(String displayName, int priorityScore) {
            this.displayName = displayName;
            this.priorityScore = priorityScore;
        }

        public String getDisplayName() {
            return displayName;
        }

        public int getPriorityScore() {
            return priorityScore;
        }
    }

    public enum RequestStatus {
        PENDING("Pending Review"),
        APPROVED("Approved - Help Coming"),
        IN_PROGRESS("Help In Progress"),
        FULFILLED("Request Fulfilled"),
        REJECTED("Request Rejected"),
        CANCELLED("Request Cancelled");

        private final String displayName;

        RequestStatus(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    // Helper methods
    @PrePersist
    public void prePersist() {
        if (this.requestDate == null) {
            this.requestDate = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = RequestStatus.PENDING;
        }
        if (this.isFulfilled == null) {
            this.isFulfilled = false;
        }
        // Calculate priority score based on urgency and people count
        calculatePriorityScore();
    }

    @PreUpdate
    public void preUpdate() {
        this.lastUpdated = LocalDateTime.now();
        calculatePriorityScore();
    }

    private void calculatePriorityScore() {
        int baseScore = this.urgency != null ? this.urgency.getPriorityScore() : 50;
        int peopleMultiplier = this.peopleCount != null ? Math.min(this.peopleCount * 5, 50) : 0;
        this.priorityScore = baseScore + peopleMultiplier;
    }

    public boolean isUrgent() {
        return this.urgency == UrgencyLevel.CRITICAL || this.urgency == UrgencyLevel.HIGH;
    }

    public boolean isPending() {
        return this.status == RequestStatus.PENDING;
    }

    public boolean isActive() {
        return this.status == RequestStatus.PENDING ||
                this.status == RequestStatus.APPROVED ||
                this.status == RequestStatus.IN_PROGRESS;
    }
}