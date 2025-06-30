package com.FoodBridgeBangladesh.Service.donor;

import com.FoodBridgeBangladesh.Model.User;
import com.FoodBridgeBangladesh.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class DonorProfileService {

    private final UserRepository userRepository;

    /**
     * Get donor by ID
     */
    public User getDonorById(Long donorId) {
        Optional<User> donor = userRepository.findById(donorId);
        return donor.orElse(null);
    }

    /**
     * Update donor profile
     */
    public User updateDonorProfile(
            Long donorId,
            String firstName,
            String lastName,
            String phone,
            String bloodGroup,
            String address,
            String addressDescription,
            String bio,
            MultipartFile userPhoto) throws IOException {

        // Find the donor by ID
        User donor = userRepository.findById(donorId)
                .orElseThrow(() -> new RuntimeException("Donor not found"));

        // Update donor information if provided
        if (firstName != null && !firstName.isEmpty()) {
            donor.setFirstName(firstName);
        }

        if (lastName != null && !lastName.isEmpty()) {
            donor.setLastName(lastName);
        }

        if (phone != null && !phone.isEmpty()) {
            // Check if phone number is already used by another user
            if (!phone.equals(donor.getPhone()) && userRepository.existsByPhone(phone)) {
                throw new RuntimeException("Phone number already in use");
            }
            donor.setPhone(phone);
        }

        if (bloodGroup != null && !bloodGroup.isEmpty()) {
            donor.setBloodGroup(bloodGroup);
        }

        if (address != null && !address.isEmpty()) {
            donor.setAddress(address);
        }

        if (addressDescription != null && !addressDescription.isEmpty()) {
            donor.setAddressDescription(addressDescription);
        }

        if (bio != null) {
            donor.setBio(bio);
        }

        // Update photo if provided
        if (userPhoto != null && !userPhoto.isEmpty()) {
            donor.setUserPhoto(userPhoto.getBytes());
            donor.setPhotoContentType(userPhoto.getContentType());
        }

        // Save updated donor
        return userRepository.save(donor);
    }

    /**
     * Change donor password
     */
    public boolean changePassword(Long donorId, String currentPassword, String newPassword) {
        // Find the donor by ID
        User donor = userRepository.findById(donorId)
                .orElseThrow(() -> new RuntimeException("Donor not found"));

        // Check if current password matches
        // In a real application, you would use password encoding
        if (!donor.getPassword().equals(currentPassword)) {
            return false;
        }

        // Update password
        donor.setPassword(newPassword); // In a real application, this would be encoded
        userRepository.save(donor);

        return true;
    }
}