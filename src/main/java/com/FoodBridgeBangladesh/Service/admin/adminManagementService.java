package com.FoodBridgeBangladesh.Service.admin;

import com.FoodBridgeBangladesh.Model.admin.adminManagementEntity;
import com.FoodBridgeBangladesh.Model.admin.dto.adminManagementDto;
import com.FoodBridgeBangladesh.Repository.admin.adminManagementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class adminManagementService {

    @Autowired
    private adminManagementRepository adminRepository;

    /**
     * Create a new admin user
     */
    public adminManagementDto.AdminResponse createAdmin(adminManagementDto adminDto) {
        // Check if email already exists
        if (adminRepository.existsByEmail(adminDto.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Create new admin entity from DTO
        adminManagementEntity admin = new adminManagementEntity();
        admin.setFirstName(adminDto.getFirstName());
        admin.setLastName(adminDto.getLastName());
        admin.setEmail(adminDto.getEmail());
        admin.setPhoneNumber(adminDto.getPhoneNumber());
        admin.setPassword(adminDto.getPassword()); // In production, password should be encoded
        admin.setRole(adminDto.getRole());
        // userType is automatically set to "admin" via entity default value
        admin.setProfilePhotoBase64(adminDto.getProfilePhotoBase64());
        admin.setStatus("Active");
        admin.setCreatedAt(LocalDateTime.now());
        admin.setLastActive(LocalDateTime.now());
        admin.setTwoFactorAuthEnabled(false);

        // Save admin to database
        adminManagementEntity savedAdmin = adminRepository.save(admin);

        // Return response DTO
        return convertToResponseDto(savedAdmin);
    }

    /**
     * Get all admin users
     */
    public List<adminManagementDto.AdminResponse> getAllAdmins() {
        List<adminManagementEntity> admins = adminRepository.findAll();
        return admins.stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * Get admin by ID
     */
    public adminManagementDto.AdminResponse getAdminById(Long id) {
        Optional<adminManagementEntity> adminOpt = adminRepository.findById(id);
        if (adminOpt.isPresent()) {
            return convertToResponseDto(adminOpt.get());
        } else {
            throw new IllegalArgumentException("Admin not found with ID: " + id);
        }
    }

    /**
     * Update admin details
     */
    public adminManagementDto.AdminResponse updateAdmin(Long id, adminManagementDto adminDto) {
        Optional<adminManagementEntity> adminOpt = adminRepository.findById(id);
        if (adminOpt.isPresent()) {
            adminManagementEntity admin = adminOpt.get();

            // Update fields if provided
            if (adminDto.getFirstName() != null) admin.setFirstName(adminDto.getFirstName());
            if (adminDto.getLastName() != null) admin.setLastName(adminDto.getLastName());
            if (adminDto.getPhoneNumber() != null) admin.setPhoneNumber(adminDto.getPhoneNumber());
            if (adminDto.getUserType() != null) admin.setUserType(adminDto.getUserType());
            if (adminDto.getProfilePhotoBase64() != null) admin.setProfilePhotoBase64(adminDto.getProfilePhotoBase64());
            if (adminDto.getStatus() != null) admin.setStatus(adminDto.getStatus());
            if (adminDto.getTwoFactorAuthEnabled() != null) admin.setTwoFactorAuthEnabled(adminDto.getTwoFactorAuthEnabled());

            // Update email only if it's different and not already taken
            if (adminDto.getEmail() != null && !admin.getEmail().equals(adminDto.getEmail())) {
                if (adminRepository.existsByEmail(adminDto.getEmail())) {
                    throw new IllegalArgumentException("Email already exists");
                }
                admin.setEmail(adminDto.getEmail());
            }

            // Update password if provided
            if (adminDto.getPassword() != null && !adminDto.getPassword().isEmpty()) {
                admin.setPassword(adminDto.getPassword()); // In production, password should be encoded
            }

            // Update last active time
            admin.setLastActive(LocalDateTime.now());

            // Save updated admin
            adminManagementEntity updatedAdmin = adminRepository.save(admin);
            return convertToResponseDto(updatedAdmin);
        } else {
            throw new IllegalArgumentException("Admin not found with ID: " + id);
        }
    }
    /**
     * Get admin by email
     */
    public adminManagementDto.AdminResponse getAdminByEmail(String email) {
        Optional<adminManagementEntity> adminOpt = adminRepository.findByEmail(email);
        if (adminOpt.isPresent()) {
            return convertToResponseDto(adminOpt.get());
        } else {
            throw new IllegalArgumentException("Admin not found with email: " + email);
        }
    }
    /**
     * Delete admin by ID
     */
    public void deleteAdmin(Long id) {
        if (adminRepository.existsById(id)) {
            adminRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Admin not found with ID: " + id);
        }
    }

    /**
     * Update admin status (activate/deactivate)
     */
    public adminManagementDto.AdminResponse updateAdminStatus(Long id, String status) {
        Optional<adminManagementEntity> adminOpt = adminRepository.findById(id);
        if (adminOpt.isPresent()) {
            adminManagementEntity admin = adminOpt.get();
            admin.setStatus(status);
            admin.setLastActive(LocalDateTime.now());

            adminManagementEntity updatedAdmin = adminRepository.save(admin);
            return convertToResponseDto(updatedAdmin);
        } else {
            throw new IllegalArgumentException("Admin not found with ID: " + id);
        }
    }

    /**
     * Get admin statistics
     */
    public Map<String, Long> getAdminStats() {
        Map<String, Long> stats = new HashMap<>();

        // Total number of admins
        stats.put("totalAdmins", adminRepository.count());

        // Count by role
        stats.put("systemAdmins", adminRepository.countByRole("system_admin"));
        stats.put("contentManagers", adminRepository.countByRole("content_control"));
        stats.put("userManagers", adminRepository.countByRole("user_management"));
        stats.put("reportViewers", adminRepository.countByRole("reports_analytics"));
        stats.put("merchantAdmins", adminRepository.countByRole("merchant_admin"));

        // Count by status
        stats.put("activeAdmins", (long) adminRepository.findByStatus("Active").size());
        stats.put("inactiveAdmins", (long) adminRepository.findByStatus("Inactive").size());

        return stats;
    }

    /**
     * Convert Entity to Response DTO
     */
    private adminManagementDto.AdminResponse convertToResponseDto(adminManagementEntity admin) {
        return new adminManagementDto.AdminResponse(
                admin.getId(),
                admin.getFirstName(),
                admin.getLastName(),
                admin.getEmail(),
                admin.getPhoneNumber(),
                admin.getRole(),
                admin.getUserType(),
                admin.getProfilePhotoBase64(),
                admin.getStatus(),
                admin.getCreatedAt(),
                admin.getLastActive()
        );
    }
}