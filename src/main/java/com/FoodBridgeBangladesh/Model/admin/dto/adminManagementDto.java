package com.FoodBridgeBangladesh.Model.admin.dto;

import java.time.LocalDateTime;

public class adminManagementDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String password;
    private String role;
    private String userType;
    private String profilePhotoBase64;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime lastActive;
    private Boolean twoFactorAuthEnabled;

    public adminManagementDto() {
        // Default constructor
    }

    // Constructor with essential fields for admin creation
    public adminManagementDto(String firstName, String lastName, String email,
                              String phoneNumber, String password, String role) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.password = password;
        this.role = role;
        this.userType = "admin"; // Fixed as "admin"
        this.status = "Active";
        this.createdAt = LocalDateTime.now();
        this.lastActive = LocalDateTime.now();
        this.twoFactorAuthEnabled = false;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public String getProfilePhotoBase64() {
        return profilePhotoBase64;
    }

    public void setProfilePhotoBase64(String profilePhotoBase64) {
        this.profilePhotoBase64 = profilePhotoBase64;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getLastActive() {
        return lastActive;
    }

    public void setLastActive(LocalDateTime lastActive) {
        this.lastActive = lastActive;
    }

    public Boolean getTwoFactorAuthEnabled() {
        return twoFactorAuthEnabled;
    }

    public void setTwoFactorAuthEnabled(Boolean twoFactorAuthEnabled) {
        this.twoFactorAuthEnabled = twoFactorAuthEnabled;
    }

    // Response DTO class for returning admin data
    public static class AdminResponse {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;
        private String phoneNumber;
        private String role;
        private String userType;
        private String profilePhotoBase64;
        private String status;
        private LocalDateTime createdAt;
        private LocalDateTime lastActive;

        public AdminResponse(Long id, String firstName, String lastName, String email,
                             String phoneNumber, String role, String userType, String profilePhotoBase64,
                             String status, LocalDateTime createdAt, LocalDateTime lastActive) {
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.phoneNumber = phoneNumber;
            this.role = role;
            this.userType = userType;
            this.profilePhotoBase64 = profilePhotoBase64;
            this.status = status;
            this.createdAt = createdAt;
            this.lastActive = lastActive;
        }

        // Getters only for response DTO
        public Long getId() {
            return id;
        }

        public String getFirstName() {
            return firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public String getEmail() {
            return email;
        }

        public String getPhoneNumber() {
            return phoneNumber;
        }

        public String getRole() {
            return role;
        }

        public String getUserType() {
            return userType;
        }

        public String getProfilePhotoBase64() {
            return profilePhotoBase64;
        }

        public String getStatus() {
            return status;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public LocalDateTime getLastActive() {
            return lastActive;
        }
    }
}