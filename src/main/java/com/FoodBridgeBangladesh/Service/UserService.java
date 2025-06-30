package com.FoodBridgeBangladesh.Service;

import com.FoodBridgeBangladesh.Model.User;
import com.FoodBridgeBangladesh.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

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
}