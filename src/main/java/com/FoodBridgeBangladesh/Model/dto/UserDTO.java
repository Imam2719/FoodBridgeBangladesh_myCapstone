package com.FoodBridgeBangladesh.Model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String userType;
    private String bloodGroup;
    private String address;
    private String addressDescription;
    private boolean isVerified;
    private LocalDateTime createdAt;

    // Computed fields
    private String fullName;

    // 🎯 ADD THIS CONSTRUCTOR for the custom query
    public UserDTO(Long id, String firstName, String lastName, String email, String phone,
                   String userType, String bloodGroup, String address, String addressDescription,
                   boolean isVerified, LocalDateTime createdAt) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.userType = userType;
        this.bloodGroup = bloodGroup;
        this.address = address;
        this.addressDescription = addressDescription;
        this.isVerified = isVerified;
        this.createdAt = createdAt;
        this.fullName = (firstName != null ? firstName : "") + " " + (lastName != null ? lastName : "");
    }

    // Helper method to get full name
    public String getFullName() {
        if (fullName != null) {
            return fullName;
        }
        return (firstName != null ? firstName : "") + " " + (lastName != null ? lastName : "");
    }

    // Static method to create from User entity (keep existing)
    public static UserDTO fromUser(com.FoodBridgeBangladesh.Model.User user) {
        if (user == null) {
            return null;
        }

        return UserDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .userType(user.getUserType())
                .bloodGroup(user.getBloodGroup())
                .address(user.getAddress())
                .addressDescription(user.getAddressDescription())
                .isVerified(user.isVerified())
                .createdAt(user.getCreatedAt())
                .fullName(user.getFirstName() + " " + user.getLastName())
                .build();
    }
}