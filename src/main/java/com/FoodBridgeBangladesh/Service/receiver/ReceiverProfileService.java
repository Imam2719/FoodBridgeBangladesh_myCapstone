package com.FoodBridgeBangladesh.Service.receiver;

import com.FoodBridgeBangladesh.Model.User;
import com.FoodBridgeBangladesh.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
import java.util.logging.Logger; 

@Service
@RequiredArgsConstructor
@Slf4j
public class ReceiverProfileService {
    private static final Logger log = Logger.getLogger(ReceiverProfileService.class.getName());


    private final UserRepository userRepository;

    /**
     * Get a receiver by ID, ensuring they have userType = 'receiver'
     */
    @Transactional(readOnly = true)
    public User getReceiverById(Long userId) {
        log.info("Fetching receiver with ID: {}", userId);

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if ("receiver".equalsIgnoreCase(user.getUserType())) {
                log.info("Found receiver with ID: {}", userId);
                return user;
            } else {
                log.warn("User with ID: {} is not a receiver but a {}", userId, user.getUserType());
                return null;
            }
        } else {
            log.warn("No user found with ID: {}", userId);
            return null;
        }
    }

    /**
     * Update receiver profile information
     */
    @Transactional
    public User updateReceiver(Long userId, String firstName, String lastName, String phone,
                               String address, String addressDescription, String bloodGroup,
                               String birthdate, String nationalId, String passportNumber,
                               String birthCertificateNumber, String bio,
                               MultipartFile userPhoto, String newPassword) throws IOException {

        log.info("Updating receiver profile for user ID: {}", userId);

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty() || !"receiver".equalsIgnoreCase(userOpt.get().getUserType())) {
            log.warn("Cannot update: User with ID: {} not found or not a receiver", userId);
            throw new IllegalArgumentException("Receiver not found with ID: " + userId);
        }

        User receiver = userOpt.get();

        // Update fields if provided
        if (firstName != null && !firstName.isEmpty()) {
            receiver.setFirstName(firstName);
        }

        if (lastName != null && !lastName.isEmpty()) {
            receiver.setLastName(lastName);
        }

        if (phone != null && !phone.isEmpty()) {
            receiver.setPhone(phone);
        }

        if (address != null && !address.isEmpty()) {
            receiver.setAddress(address);
        }

        if (addressDescription != null && !addressDescription.isEmpty()) {
            receiver.setAddressDescription(addressDescription);
        }

        if (bloodGroup != null && !bloodGroup.isEmpty()) {
            receiver.setBloodGroup(bloodGroup);
        }

        if (birthdate != null && !birthdate.isEmpty()) {
            LocalDate parsedBirthdate = LocalDate.parse(birthdate, DateTimeFormatter.ISO_DATE);
            receiver.setBirthdate(parsedBirthdate);
        }

        if (nationalId != null) {
            receiver.setNationalId(nationalId.isEmpty() ? null : nationalId);
        }

        if (passportNumber != null) {
            receiver.setPassportNumber(passportNumber.isEmpty() ? null : passportNumber);
        }

        if (birthCertificateNumber != null) {
            receiver.setBirthCertificateNumber(birthCertificateNumber.isEmpty() ? null : birthCertificateNumber);
        }

        if (bio != null) {
            receiver.setBio(bio.isEmpty() ? null : bio);
        }

        if (newPassword != null && !newPassword.isEmpty()) {
            receiver.setPassword(newPassword);
        }

        // Update photo if provided
        if (userPhoto != null && !userPhoto.isEmpty()) {
            receiver.setUserPhoto(userPhoto.getBytes());
            receiver.setPhotoContentType(userPhoto.getContentType());
        }

        // Save updated user
        User updatedReceiver = userRepository.save(receiver);
        log.info("Successfully updated receiver profile for user ID: {}", userId);

        return updatedReceiver;
    }

    /**
     * Update only the profile photo
     */
    @Transactional
    public User updateProfilePhoto(Long userId, MultipartFile userPhoto) throws IOException {
        log.info("Updating profile photo for user ID: {}", userId);

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty() || !"receiver".equalsIgnoreCase(userOpt.get().getUserType())) {
            log.warn("Cannot update photo: User with ID: {} not found or not a receiver", userId);
            throw new IllegalArgumentException("Receiver not found with ID: " + userId);
        }

        User receiver = userOpt.get();

        // Update photo
        receiver.setUserPhoto(userPhoto.getBytes());
        receiver.setPhotoContentType(userPhoto.getContentType());

        // Save updated user
        User updatedReceiver = userRepository.save(receiver);
        log.info("Successfully updated profile photo for user ID: {}", userId);

        return updatedReceiver;
    }

    /**
     * Delete a receiver account after password validation
     */
    @Transactional
    public boolean deleteReceiver(Long userId, String password) {
        log.info("Processing request to delete receiver account for user ID: {}", userId);

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty() || !"receiver".equalsIgnoreCase(userOpt.get().getUserType())) {
            log.warn("Cannot delete: User with ID: {} not found or not a receiver", userId);
            return false;
        }

        User receiver = userOpt.get();

        // Validate password
        if (!receiver.getPassword().equals(password)) {
            log.warn("Cannot delete: Password validation failed for user ID: {}", userId);
            return false;
        }

        // Delete the user
        userRepository.delete(receiver);
        log.info("Successfully deleted receiver account for user ID: {}", userId);

        return true;
    }
}
