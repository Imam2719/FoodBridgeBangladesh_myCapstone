package com.FoodBridgeBangladesh.Service;

import com.FoodBridgeBangladesh.Model.User;
import com.FoodBridgeBangladesh.Model.dto.UserDTO;
import com.FoodBridgeBangladesh.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    /**
     * Check if email exists
     */
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * Check if phone exists
     */
    public boolean existsByPhone(String phone) {
        return userRepository.existsByPhone(phone);
    }

    /**
     * Check if national ID exists
     */
    public boolean existsByNationalId(String nationalId) {
        if(nationalId == null || nationalId.isBlank()) {
            return false;
        }
        return userRepository.existsByNationalId(nationalId);
    }

    /**
     * Create a new user with all details
     */
    public User createUser(
            String firstName,
            String lastName,
            String email,
            String password,
            String phone,
            String birthdate,
            String bloodGroup,
            String nationalId,
            String passportNumber,
            String birthCertificateNumber,
            String address,
            String addressDescription,
            String userType,
            String bio,
            MultipartFile userPhoto) throws IOException {

        // Parse birthdate from string to LocalDate
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate parsedBirthdate = LocalDate.parse(birthdate, formatter);

        // Build user entity
        User user = User.builder()
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .password(password) // In a real application, this would be encoded
                .phone(phone)
                .birthdate(parsedBirthdate)
                .bloodGroup(bloodGroup)
                .nationalId(nationalId)
                .passportNumber(passportNumber)
                .birthCertificateNumber(birthCertificateNumber)
                .address(address)
                .addressDescription(addressDescription)
                .userType(userType)
                .bio(bio)
                .userPhoto(userPhoto.getBytes())
                .photoContentType(userPhoto.getContentType())
                .isVerified(false) // User starts as unverified
                .build();

        // Save user to database
        return userRepository.save(user);
    }

    // ===========================================
    // NEW DTO METHODS - ADD THESE TO FIX ERRORS
    // ===========================================

    /**
     * Get all users with userType = "donor" as DTOs (avoids LOB issues)
     */
    public List<UserDTO> getAllDonorsDTO() {
        System.out.println("Fetching all donors as DTOs from database...");
        try {
            List<User> donors = userRepository.findByUserType("donor");
            System.out.println("Found " + donors.size() + " donors");

            List<UserDTO> donorDTOs = donors.stream()
                    .map(UserDTO::fromUser)
                    .collect(Collectors.toList());

            System.out.println("Converted to " + donorDTOs.size() + " DTOs");
            return donorDTOs;
        } catch (Exception e) {
            System.err.println("Error fetching donors: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * Get donors by IDs as DTOs
     */
    public List<UserDTO> getDonorsByIdsDTO(List<Long> donorIds) {
        System.out.println("Fetching donors by IDs as DTOs: " + donorIds);
        try {
            List<User> donors = userRepository.findByIdInAndUserType(donorIds, "donor");
            System.out.println("Found " + donors.size() + " donors for given IDs");

            return donors.stream()
                    .map(UserDTO::fromUser)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error fetching donors by IDs: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * Get all verified donors as DTOs
     */
    public List<UserDTO> getAllVerifiedDonorsDTO() {
        try {
            List<User> donors = userRepository.findByUserTypeAndIsVerifiedTrue("donor");
            return donors.stream()
                    .map(UserDTO::fromUser)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error fetching verified donors: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * Get simplified user data (for admin dashboard - avoiding LOB fields)
     */
    public List<UserDTO> getAllUsersDTO() {
        try {
            List<User> users = userRepository.findAll();
            return users.stream()
                    .map(UserDTO::fromUser)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error fetching all users as DTOs: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * Get user by ID (for when full entity is needed - e.g., email sending)
     */
    public Optional<User> getUserById(Long userId) {
        try {
            return userRepository.findById(userId);
        } catch (Exception e) {
            System.err.println("Error fetching user by ID " + userId + ": " + e.getMessage());
            return Optional.empty();
        }
    }

    // ===========================================
    // EXISTING METHODS (keep these as they were)
    // ===========================================

    /**
     * Get all users with userType = "donor" (original method - may cause LOB issues)
     */
    public List<User> getAllDonors() {
        System.out.println("Fetching all donors from database...");
        List<User> donors = userRepository.findByUserType("donor");
        System.out.println("Found " + donors.size() + " donors");
        return donors;
    }

    /**
     * Get donors by their IDs (original method - may cause LOB issues)
     */
    public List<User> getDonorsByIds(List<Long> donorIds) {
        System.out.println("Fetching donors by IDs: " + donorIds);
        List<User> donors = userRepository.findByIdInAndUserType(donorIds, "donor");
        System.out.println("Found " + donors.size() + " donors for given IDs");
        return donors;
    }

    /**
     * Get all verified donors only (original method)
     */
    public List<User> getAllVerifiedDonors() {
        return userRepository.findByUserTypeAndIsVerifiedTrue("donor");
    }

    /**
     * Get all users (for admin purposes)
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Count donors
     */
    public long countDonors() {
        return userRepository.countByUserType("donor");
    }

    /**
     * Count verified donors
     */
    public long countVerifiedDonors() {
        return userRepository.countByUserTypeAndIsVerifiedTrue("donor");
    }
    /**
     * Count total users
     */
    public long countUsers() {
        return userRepository.count();
    }


    /**
     * 🚨 EMERGENCY-SPECIFIC: Get donors without LOB fields (for emergency requests only)
     */
    public List<UserDTO> getDonorsForEmergencyRequests() {
        System.out.println("🚨 Fetching donors for emergency (no LOB fields)...");
        try {
            List<UserDTO> donors = userRepository.findDonorsForEmergency();
            System.out.println("✅ Found " + donors.size() + " donors for emergency");
            return donors;
        } catch (Exception e) {
            System.err.println("❌ Error fetching emergency donors: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * 🚨 EMERGENCY-SPECIFIC: Get specific donors by IDs without LOB fields
     */
    public List<UserDTO> getDonorsByIdsForEmergencyRequests(List<Long> donorIds) {
        System.out.println("🚨 Fetching donors by IDs for emergency (no LOB fields): " + donorIds);
        try {
            List<UserDTO> donors = userRepository.findDonorsByIdsForEmergency(donorIds);
            System.out.println("✅ Found " + donors.size() + " donors for emergency by IDs");
            return donors;
        } catch (Exception e) {
            System.err.println("❌ Error fetching emergency donors by IDs: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * 🚨 EMERGENCY-SPECIFIC: Count donors without loading entities
     */
    public long countDonorsForEmergency() {
        try {
            return userRepository.countDonorsOnly();
        } catch (Exception e) {
            System.err.println("❌ Error counting emergency donors: " + e.getMessage());
            return 0;
        }
    }
}