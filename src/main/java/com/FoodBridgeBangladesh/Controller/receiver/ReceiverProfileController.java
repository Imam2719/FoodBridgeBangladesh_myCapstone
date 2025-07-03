package com.FoodBridgeBangladesh.Controller.receiver;


import com.FoodBridgeBangladesh.Model.User;
import com.FoodBridgeBangladesh.Service.receiver.ReceiverProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger; 

@RestController
@RequestMapping("/api/receiver/profile")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
public class ReceiverProfileController {

    private final ReceiverProfileService receiverProfileService;

    /**
     * Get receiver profile by user ID
     */
    @GetMapping("/{userId}")
    public ResponseEntity<?> getReceiverProfile(@PathVariable Long userId) {
        try {
            log.info("Fetching receiver profile for user ID: {}", userId);
            User receiver = receiverProfileService.getReceiverById(userId);

            if (receiver == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Receiver not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            // Creating a response map without sensitive data like password
            Map<String, Object> receiverData = new HashMap<>();
            receiverData.put("id", receiver.getId());
            receiverData.put("firstName", receiver.getFirstName());
            receiverData.put("lastName", receiver.getLastName());
            receiverData.put("email", receiver.getEmail());
            receiverData.put("phone", receiver.getPhone());
            receiverData.put("address", receiver.getAddress());
            receiverData.put("addressDescription", receiver.getAddressDescription());
            receiverData.put("bloodGroup", receiver.getBloodGroup());
            receiverData.put("birthdate", receiver.getBirthdate());
            receiverData.put("nationalId", receiver.getNationalId());
            receiverData.put("passportNumber", receiver.getPassportNumber());
            receiverData.put("birthCertificateNumber", receiver.getBirthCertificateNumber());
            receiverData.put("bio", receiver.getBio());
            receiverData.put("userType", receiver.getUserType());
            receiverData.put("isVerified", receiver.isVerified());
            receiverData.put("createdAt", receiver.getCreatedAt());
            receiverData.put("updatedAt", receiver.getUpdatedAt());

            // Add photo if it exists (base64 encoded)
            if (receiver.getUserPhoto() != null) {
                receiverData.put("photoContentType", receiver.getPhotoContentType());
                receiverData.put("userPhotoBase64",
                        java.util.Base64.getEncoder().encodeToString(receiver.getUserPhoto()));
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", receiverData);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error fetching receiver profile: {}", e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching profile: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Update receiver profile information
     */
    @PutMapping(value = "/update/{userId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateReceiverProfile(
            @PathVariable Long userId,
            @RequestParam(value = "firstName", required = false) String firstName,
            @RequestParam(value = "lastName", required = false) String lastName,
            @RequestParam(value = "phone", required = false) String phone,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "addressDescription", required = false) String addressDescription,
            @RequestParam(value = "bloodGroup", required = false) String bloodGroup,
            @RequestParam(value = "birthdate", required = false) String birthdate,
            @RequestParam(value = "nationalId", required = false) String nationalId,
            @RequestParam(value = "passportNumber", required = false) String passportNumber,
            @RequestParam(value = "birthCertificateNumber", required = false) String birthCertificateNumber,
            @RequestParam(value = "bio", required = false) String bio,
            @RequestParam(value = "userPhoto", required = false) MultipartFile userPhoto,
            @RequestParam(value = "currentPassword", required = false) String currentPassword,
            @RequestParam(value = "newPassword", required = false) String newPassword) {

        try {
            log.info("Updating receiver profile for user ID: {}", userId);

            // Validate if this is a receiver
            User receiver = receiverProfileService.getReceiverById(userId);
            if (receiver == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Receiver not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            // If trying to update password, validate current password
            if (newPassword != null && !newPassword.isEmpty()) {
                if (currentPassword == null || !currentPassword.equals(receiver.getPassword())) {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "Current password is incorrect");
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
                }
            }

            // Update receiver profile
            User updatedReceiver = receiverProfileService.updateReceiver(
                    userId, firstName, lastName, phone, address, addressDescription,
                    bloodGroup, birthdate, nationalId, passportNumber,
                    birthCertificateNumber, bio, userPhoto, newPassword
            );

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Profile updated successfully");
            response.put("userId", updatedReceiver.getId());

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            log.error("Error processing file upload: {}", e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error processing file upload: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        } catch (Exception e) {
            log.error("Error updating receiver profile: {}", e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Update failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Update only profile photo
     */
    @PutMapping(value = "/update-photo/{userId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProfilePhoto(
            @PathVariable Long userId,
            @RequestParam("userPhoto") MultipartFile userPhoto) {

        try {
            log.info("Updating profile photo for user ID: {}", userId);

            if (userPhoto.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "User photo is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            User updatedReceiver = receiverProfileService.updateProfilePhoto(userId, userPhoto);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Profile photo updated successfully");
            response.put("userId", updatedReceiver.getId());

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            log.error("Error processing file upload: {}", e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error processing file upload: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        } catch (Exception e) {
            log.error("Error updating profile photo: {}", e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Update failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Delete receiver account
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteReceiverAccount(
            @PathVariable Long userId,
            @RequestParam("password") String password) {

        try {
            log.info("Request to delete receiver account for user ID: {}", userId);

            // Validate password
            boolean isDeleted = receiverProfileService.deleteReceiver(userId, password);

            if (isDeleted) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Account deleted successfully");
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Password validation failed or account not found");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

        } catch (Exception e) {
            log.error("Error deleting receiver account: {}", e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error deleting account: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
