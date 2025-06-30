package com.FoodBridgeBangladesh.Service.admin;

import com.FoodBridgeBangladesh.Model.User;
import com.FoodBridgeBangladesh.Model.admin.dto.AdminUserDTO;
import com.FoodBridgeBangladesh.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service

public class AdminUserService {

    private final UserRepository userRepository;
    public AdminUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Get all users
     */
    public List<AdminUserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get user by ID
     */
    public AdminUserDTO getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        return convertToDTO(user);
    }

    /**
     * Create user
     */
    @Transactional
    public AdminUserDTO createUser(User user) {
        // Check if email already exists
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists: " + user.getEmail());
        }

        // Check if phone already exists
        if (userRepository.existsByPhone(user.getPhone())) {
            throw new RuntimeException("Phone number already exists: " + user.getPhone());
        }

        // Check if national ID already exists (if provided)
        String nationalId = user.getNationalId();
        if (nationalId != null && !nationalId.isEmpty() && userRepository.existsByNationalId(nationalId)) {
            throw new RuntimeException("National ID already exists: " + nationalId);
        }

        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }

    /**
     * Update user
     */
    @Transactional
    public AdminUserDTO updateUser(Long userId, User updatedUser) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        // Check email uniqueness if changed
        if (!existingUser.getEmail().equals(updatedUser.getEmail()) &&
                userRepository.existsByEmail(updatedUser.getEmail())) {
            throw new RuntimeException("Email already exists: " + updatedUser.getEmail());
        }

        // Check phone uniqueness if changed
        if (!existingUser.getPhone().equals(updatedUser.getPhone()) &&
                userRepository.existsByPhone(updatedUser.getPhone())) {
            throw new RuntimeException("Phone number already exists: " + updatedUser.getPhone());
        }

        // Check national ID uniqueness if changed
        String newNationalId = updatedUser.getNationalId();
        if (newNationalId != null && !newNationalId.isEmpty() &&
                !newNationalId.equals(existingUser.getNationalId()) &&
                userRepository.existsByNationalId(newNationalId)) {
            throw new RuntimeException("National ID already exists: " + newNationalId);
        }

        // Update fields
        existingUser.setFirstName(updatedUser.getFirstName());
        existingUser.setLastName(updatedUser.getLastName());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setPhone(updatedUser.getPhone());
        existingUser.setBirthdate(updatedUser.getBirthdate());
        existingUser.setBloodGroup(updatedUser.getBloodGroup());
        existingUser.setNationalId(updatedUser.getNationalId());
        existingUser.setPassportNumber(updatedUser.getPassportNumber());
        existingUser.setBirthCertificateNumber(updatedUser.getBirthCertificateNumber());
        existingUser.setAddress(updatedUser.getAddress());
        existingUser.setAddressDescription(updatedUser.getAddressDescription());
        existingUser.setUserType(updatedUser.getUserType());
        existingUser.setBio(updatedUser.getBio());
        existingUser.setVerified(updatedUser.isVerified());

        // Only update photo if a new one is provided
        if (updatedUser.getUserPhoto() != null && updatedUser.getUserPhoto().length > 0) {
            existingUser.setUserPhoto(updatedUser.getUserPhoto());
            existingUser.setPhotoContentType(updatedUser.getPhotoContentType());
        }

        User savedUser = userRepository.save(existingUser);
        return convertToDTO(savedUser);
    }

    /**
     * Delete user
     */
    @Transactional
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with ID: " + userId);
        }
        userRepository.deleteById(userId);
    }

    /**
     * Update verification status - FIXED VERSION
     */
    @Transactional
    public void updateVerificationStatus(Long userId, boolean verified) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        // Ensure we're setting the correct verification status
        user.setVerified(verified);
        userRepository.save(user);

        // Force flush to ensure immediate database update
        userRepository.flush();
    }

    /**
     * Get users by type (donor/receiver)
     */
    public List<AdminUserDTO> getUsersByType(String userType) {
        List<User> users = userRepository.findAll().stream()
                .filter(user -> user.getUserType().equalsIgnoreCase(userType))
                .collect(Collectors.toList());

        return users.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Search users by keyword
     */
    public List<AdminUserDTO> searchUsers(String keyword) {
        List<User> users = userRepository.findAll().stream()
                .filter(user -> containsKeyword(user, keyword))
                .collect(Collectors.toList());

        return users.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Helper method to check if user contains the search keyword
     */
    private boolean containsKeyword(User user, String keyword) {
        keyword = keyword.toLowerCase();

        return user.getFirstName().toLowerCase().contains(keyword) ||
                user.getLastName().toLowerCase().contains(keyword) ||
                user.getEmail().toLowerCase().contains(keyword) ||
                user.getPhone().toLowerCase().contains(keyword) ||
                (user.getAddress() != null && user.getAddress().toLowerCase().contains(keyword));
    }

    /**
     * Convert User entity to AdminUserDTO
     */
    private AdminUserDTO convertToDTO(User user) {
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
            dto.setPhotoBase64(Base64.getEncoder().encodeToString(user.getUserPhoto()));
        }

        return dto;
    }
}