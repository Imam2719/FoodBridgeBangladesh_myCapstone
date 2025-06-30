package com.FoodBridgeBangladesh.Service;

import com.FoodBridgeBangladesh.Model.User;
import com.FoodBridgeBangladesh.Model.admin.MerchantEntity;
import com.FoodBridgeBangladesh.Model.admin.adminManagementEntity;
import com.FoodBridgeBangladesh.Repository.UserRepository;
import com.FoodBridgeBangladesh.Repository.admin.MerchantAddRepository;
import com.FoodBridgeBangladesh.Repository.admin.adminManagementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class AuthenticationService {
    private static final Logger logger = Logger.getLogger(AuthenticationService.class.getName());

    private final UserRepository userRepository;
    private final adminManagementRepository adminRepository;
    private final MerchantAddRepository merchantRepository;

    @Autowired
    public AuthenticationService(UserRepository userRepository,
                                 adminManagementRepository adminRepository,
                                 MerchantAddRepository merchantRepository) {
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
        this.merchantRepository = merchantRepository;
    }

    /**
     * Authenticate user based on email and password
     * @param email User email
     * @param password User password
     * @return Authentication result with user type and status
     */
    @Transactional(readOnly = true)
    public Map<String, Object> authenticate(String email, String password) {
        Map<String, Object> result = new HashMap<>();
        // Default values
        result.put("authenticated", false);

        try {
            logger.info("Authenticating user with email: " + email);

            // Check User table (donors and receivers)
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                logger.info("Found user in User table with userType: " + user.getUserType());

                if (user.getPassword().equals(password)) {
                    logger.info("Password matched for user in User table");
                    populateAuthResult(result, true, user.getUserType(),
                            user.isVerified() ? "Active" : "Pending",
                            user.getId(), user.getFirstName(), user.getLastName());

                    // Don't include any LOB data in the result
                    // Just add the email for reference
                    result.put("email", user.getEmail());

                    return result;
                } else {
                    logger.info("Password did not match for user in User table");
                }
            } else {
                logger.info("User not found in User table");
            }

            // Check Admin table
            Optional<adminManagementEntity> adminOpt = adminRepository.findByEmail(email);
            if (adminOpt.isPresent()) {
                adminManagementEntity admin = adminOpt.get();
                logger.info("Found user in Admin table with userType: " + admin.getUserType());

                if (admin.getPassword().equals(password)) {
                    logger.info("Password matched for user in Admin table");
                    populateAuthResult(result, true, "admin", admin.getStatus(),
                            admin.getId(), admin.getFirstName(), admin.getLastName());

                    // Add admin-specific information
                    result.put("role", admin.getRole());
                    result.put("email", admin.getEmail());

                    // Update last active time
                    admin.setLastActive(LocalDateTime.now());
                    adminRepository.save(admin);
                    return result;
                } else {
                    logger.info("Password did not match for user in Admin table");
                }
            } else {
                logger.info("User not found in Admin table");
            }

            // Check Merchant table
            Optional<MerchantEntity> merchantOpt = merchantRepository.findByEmail(email);
            if (merchantOpt.isPresent()) {
                MerchantEntity merchant = merchantOpt.get();
                logger.info("Found user in Merchant table with userType: " + merchant.getUserType());

                if (merchant.getPassword().equals(password)) {
                    logger.info("Password matched for user in Merchant table");
                    populateAuthResult(result, true, "merchant", merchant.getStatus(),
                            merchant.getId(), merchant.getOwnerFirstName(), merchant.getOwnerLastName());

                    // Add merchant-specific information but avoid large LOB fields
                    result.put("businessName", merchant.getBusinessName());
                    result.put("merchantId", merchant.getMerchantId());
                    result.put("businessType", merchant.getBusinessType());
                    result.put("email", merchant.getEmail());

                    // Update last active time
                    merchant.setUpdatedAt(LocalDateTime.now());
                    merchantRepository.save(merchant);
                    return result;
                } else {
                    logger.info("Password did not match for user in Merchant table");
                }
            } else {
                logger.info("User not found in Merchant table");
            }

            logger.info("Authentication failed for email: " + email);
        } catch (Exception ex) {
            logger.log(Level.SEVERE, "Error during authentication: " + ex.getMessage(), ex);
            // For LOB access errors, log the specific error
            if (ex.getMessage() != null && ex.getMessage().contains("lob stream")) {
                logger.severe("LOB stream access error occurred. This typically happens when trying to access LOB data outside a transaction.");
            }
        }

        return result;
    }

    /**
     * Alternative authentication method that explicitly avoids loading LOB data
     * Use this method if the regular authenticate method is causing LOB stream errors
     */
    @Transactional(readOnly = true)
    public Map<String, Object> authenticateWithoutLobData(String email, String password) {
        Map<String, Object> result = new HashMap<>();
        result.put("authenticated", false);

        try {
            logger.info("Authenticating user (without LOB data) with email: " + email);

            // First check if the user exists in any repository to avoid multiple database trips
            boolean userExists = userRepository.existsByEmail(email) ||
                    adminRepository.existsByEmail(email) ||
                    merchantRepository.existsByEmail(email);

            if (!userExists) {
                logger.info("No user found with email: " + email);
                return result;
            }

            // Check User table but avoid loading the photo
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                if (user.getPassword().equals(password)) {
                    logger.info("Password matched for user in User table (safe mode)");
                    populateAuthResult(result, true, user.getUserType(),
                            user.isVerified() ? "Active" : "Pending",
                            user.getId(), user.getFirstName(), user.getLastName());
                    result.put("email", user.getEmail());
                    return result;
                }
            }

            // Check Admin table (no LOB data to worry about)
            Optional<adminManagementEntity> adminOpt = adminRepository.findByEmail(email);
            if (adminOpt.isPresent()) {
                adminManagementEntity admin = adminOpt.get();
                if (admin.getPassword().equals(password)) {
                    logger.info("Password matched for admin in Admin table (safe mode)");
                    populateAuthResult(result, true, "admin", admin.getStatus(),
                            admin.getId(), admin.getFirstName(), admin.getLastName());
                    result.put("role", admin.getRole());
                    result.put("email", admin.getEmail());
                    return result;
                }
            }

            // Check Merchant table but avoid loading Base64 encoded files
            Optional<MerchantEntity> merchantOpt = merchantRepository.findByEmail(email);
            if (merchantOpt.isPresent()) {
                MerchantEntity merchant = merchantOpt.get();
                if (merchant.getPassword().equals(password)) {
                    logger.info("Password matched for merchant in Merchant table (safe mode)");
                    populateAuthResult(result, true, "merchant", merchant.getStatus(),
                            merchant.getId(), merchant.getOwnerFirstName(), merchant.getOwnerLastName());
                    result.put("businessName", merchant.getBusinessName());
                    result.put("merchantId", merchant.getMerchantId());
                    result.put("email", merchant.getEmail());
                    return result;
                }
            }
        } catch (Exception ex) {
            logger.log(Level.SEVERE, "Error during safe authentication: " + ex.getMessage(), ex);
        }

        return result;
    }

    /**
     * Helper method to populate auth result with common fields
     * Reduces code duplication across different user types
     */
    private void populateAuthResult(Map<String, Object> result, boolean authenticated,
                                    String userType, String status, Long userId,
                                    String firstName, String lastName) {
        result.put("authenticated", authenticated);
        result.put("userType", userType);
        result.put("status", status);
        result.put("userId", userId);
        result.put("firstName", firstName);
        result.put("lastName", lastName);
        result.put("fullName", firstName + " " + lastName);

        logger.info("Populated auth result with userType: " + userType + ", status: " + status);
    }
}