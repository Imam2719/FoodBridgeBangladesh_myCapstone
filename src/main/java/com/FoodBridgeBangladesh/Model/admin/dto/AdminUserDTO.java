package com.FoodBridgeBangladesh.Model.admin.dto;

import com.FoodBridgeBangladesh.Model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Base64;

/**
 * Data Transfer Object for User entity to be used in admin operations
 * Excludes sensitive data like password and provides photo as Base64 string
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserDTO {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private LocalDate birthdate;
    private String bloodGroup;
    private String nationalId;
    private String passportNumber;
    private String birthCertificateNumber;
    private String address;
    private String addressDescription;
    private String userType; // donor or receiver
    private String bio;
    private boolean isVerified;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Photo data as Base64 string
    private String photoBase64;
    private String photoContentType;

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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public LocalDate getBirthdate() {
        return birthdate;
    }

    public void setBirthdate(LocalDate birthdate) {
        this.birthdate = birthdate;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public String getNationalId() {
        return nationalId;
    }

    public void setNationalId(String nationalId) {
        this.nationalId = nationalId;
    }

    public String getPassportNumber() {
        return passportNumber;
    }

    public void setPassportNumber(String passportNumber) {
        this.passportNumber = passportNumber;
    }

    public String getBirthCertificateNumber() {
        return birthCertificateNumber;
    }

    public void setBirthCertificateNumber(String birthCertificateNumber) {
        this.birthCertificateNumber = birthCertificateNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getAddressDescription() {
        return addressDescription;
    }

    public void setAddressDescription(String addressDescription) {
        this.addressDescription = addressDescription;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public boolean isVerified() {
        return isVerified;
    }

    public void setVerified(boolean verified) {
        isVerified = verified;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getPhotoBase64() {
        return photoBase64;
    }

    public void setPhotoBase64(String photoBase64) {
        this.photoBase64 = photoBase64;
    }

    public String getPhotoContentType() {
        return photoContentType;
    }

    public void setPhotoContentType(String photoContentType) {
        this.photoContentType = photoContentType;
    }

    /**
     * Static factory method to create AdminUserDTO from User entity
     */
    public static AdminUserDTO fromEntity(User user) {
        AdminUserDTO dto = new AdminUserDTO();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setBirthdate(user.getBirthdate());
        dto.setBloodGroup(user.getBloodGroup());
        dto.setNationalId(user.getNationalId());
        dto.setPassportNumber(user.getPassportNumber());
        dto.setBirthCertificateNumber(user.getBirthCertificateNumber());
        dto.setAddress(user.getAddress());
        dto.setAddressDescription(user.getAddressDescription());
        dto.setUserType(user.getUserType());
        dto.setBio(user.getBio());
        dto.setVerified(user.isVerified());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        dto.setPhotoContentType(user.getPhotoContentType());

// Convert photo to Base64 if available
        if (user.getUserPhoto() != null && user.getUserPhoto().length > 0) {
            // The line below might be the issue
            dto.setPhotoBase64(Base64.getEncoder().encodeToString(user.getUserPhoto()));
        }

        return dto;
    }

    /**
     * Get user's full name
     */
    public String getFullName() {
        return firstName + " " + lastName;
    }

    /**
     * Check if user has valid identification
     */
    public boolean hasValidIdentification() {
        return (nationalId != null && !nationalId.isEmpty()) ||
                (passportNumber != null && !passportNumber.isEmpty()) ||
                (birthCertificateNumber != null && !birthCertificateNumber.isEmpty());
    }

    /**
     * Get primary identification type and number
     */
    public String getPrimaryIdentification() {
        if (nationalId != null && !nationalId.isEmpty()) {
            return "National ID: " + nationalId;
        } else if (passportNumber != null && !passportNumber.isEmpty()) {
            return "Passport: " + passportNumber;
        } else if (birthCertificateNumber != null && !birthCertificateNumber.isEmpty()) {
            return "Birth Certificate: " + birthCertificateNumber;
        } else {
            return "No identification provided";
        }
    }

    /**
     * Check if user profile has photo
     */
    public boolean hasPhoto() {
        return photoBase64 != null && !photoBase64.isEmpty();
    }

    /**
     * Get account age in days
     */
    public long getAccountAgeInDays() {
        if (createdAt == null) {
            return 0;
        }
        return java.time.Duration.between(createdAt, LocalDateTime.now()).toDays();
    }
}