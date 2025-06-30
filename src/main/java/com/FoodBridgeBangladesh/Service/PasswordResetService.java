package com.FoodBridgeBangladesh.Service;

import com.FoodBridgeBangladesh.Model.OTPEntity;
import com.FoodBridgeBangladesh.Model.User;
import com.FoodBridgeBangladesh.Model.admin.MerchantEntity;
import com.FoodBridgeBangladesh.Model.admin.adminManagementEntity;
import com.FoodBridgeBangladesh.Repository.OTPRepository;
import com.FoodBridgeBangladesh.Repository.UserRepository;
import com.FoodBridgeBangladesh.Repository.admin.MerchantAddRepository;
import com.FoodBridgeBangladesh.Repository.admin.adminManagementRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class PasswordResetService {

    // Explicit logger declaration instead of using @Slf4j
    private static final Logger logger = LoggerFactory.getLogger(PasswordResetService.class);

    // Dependencies explicitly declared
    private final UserRepository userRepository;
    private final MerchantAddRepository merchantRepository;
    private final adminManagementRepository adminRepository;
    private final OTPRepository otpRepository;
    private final JavaMailSender emailSender;

    private final Random random = new Random();

    // Explicit constructor instead of using @RequiredArgsConstructor
    @Autowired
    public PasswordResetService(
            UserRepository userRepository,
            MerchantAddRepository merchantRepository,
            adminManagementRepository adminRepository,
            OTPRepository otpRepository,
            JavaMailSender emailSender) {
        this.userRepository = userRepository;
        this.merchantRepository = merchantRepository;
        this.adminRepository = adminRepository;
        this.otpRepository = otpRepository;
        this.emailSender = emailSender;
    }

    /**
     * Check if a user with the given email exists in any of the repositories
     */
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email) ||
                merchantRepository.existsByEmail(email) ||
                adminRepository.existsByEmail(email);
    }

    /**
     * Generate a 6-digit OTP, save it to the database, and send it to the user's email
     */
    @Transactional
    public boolean generateAndSendOTP(String email) {
        try {
            // Generate 6-digit OTP
            int otpValue = 100000 + random.nextInt(900000);
            String otp = String.valueOf(otpValue);

            // Set expiration time to 2 minutes from now
            LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(2);

            // Save OTP to database (create new or update existing)
            OTPEntity otpEntity;
            try {
                Optional<OTPEntity> existingOTP = otpRepository.findByEmail(email);

                if (existingOTP.isPresent()) {
                    otpEntity = existingOTP.get();
                    otpEntity.setOtp(otp);
                    otpEntity.setExpiryTime(expiryTime);
                    otpEntity.setVerified(false);
                } else {
                    otpEntity = new OTPEntity();
                    otpEntity.setEmail(email);
                    otpEntity.setOtp(otp);
                    otpEntity.setExpiryTime(expiryTime);
                    otpEntity.setVerified(false);
                }

                otpRepository.save(otpEntity);
                logger.info("OTP entity saved successfully for email: {}", email);
            } catch (Exception e) {
                logger.error("Error saving OTP entity: {}", e.getMessage(), e);
                return false;
            }

            // Add debug logging to check if we get to this point
            logger.info("Attempting to send OTP email to: {}", email);

            // For debugging, log the OTP value (remove in production)
            logger.info("DEBUG MODE: OTP for {} is: {}", email, otp);

            try {
                // Send email with OTP
                sendOTPEmail(email, otp);
                logger.info("OTP email sent successfully to: {}", email);
            } catch (Exception e) {
                logger.error("Error sending OTP email: {}", e.getMessage(), e);
                // Don't throw the exception, just return false
                return false;
            }

            return true;

        } catch (Exception e) {
            logger.error("Unexpected error in generateAndSendOTP: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Send OTP to user's email with improved error handling
     */
    private void sendOTPEmail(String email, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setFrom("sfms0674@gmail.com"); // Add explicit from address
            message.setSubject("FoodShare Password Reset Verification Code");
            message.setText("Your verification code for password reset is: " + otp +
                    "\n\nThis code will expire in 2 minutes. If you did not request a password reset, please ignore this email.");

            emailSender.send(message);
            logger.info("OTP email sent to: {}", email);

        } catch (Exception e) {
            logger.error("Detailed error sending OTP email: {}", e.getMessage(), e);
            throw e; // Re-throw to be handled by the calling method
        }
    }
    /**
     * Verify if the provided OTP is valid and not expired
     */
    @Transactional
    public boolean verifyOTP(String email, String otp) {
        try {
            Optional<OTPEntity> otpEntityOpt = otpRepository.findByEmail(email);

            if (otpEntityOpt.isPresent()) {
                OTPEntity otpEntity = otpEntityOpt.get();

                // Check if OTP is correct and not expired
                if (otpEntity.getOtp().equals(otp) &&
                        LocalDateTime.now().isBefore(otpEntity.getExpiryTime())) {

                    // Mark OTP as verified
                    otpEntity.setVerified(true);
                    otpRepository.save(otpEntity);

                    logger.info("OTP verified successfully for: {}", email);
                    return true;
                }
            }

            logger.info("Invalid or expired OTP for: {}", email);
            return false;

        } catch (Exception e) {
            logger.error("Error verifying OTP: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Update user's password after OTP verification
     */
    @Transactional
    public boolean updatePassword(String email, String newPassword) {
        try {
            // Check if OTP was verified
            Optional<OTPEntity> otpEntityOpt = otpRepository.findByEmail(email);

            if (otpEntityOpt.isEmpty() || !otpEntityOpt.get().isVerified()) {
                logger.info("Password reset rejected - OTP not verified for: {}", email);
                return false;
            }

            // Update password in appropriate repository
            boolean passwordUpdated = false;

            // Check User table
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                user.setPassword(newPassword); // In a real app, this should be encoded
                user.setUpdatedAt(LocalDateTime.now());
                userRepository.save(user);
                passwordUpdated = true;
            }

            // Check Merchant table
            if (!passwordUpdated) {
                Optional<MerchantEntity> merchantOpt = merchantRepository.findByEmail(email);
                if (merchantOpt.isPresent()) {
                    MerchantEntity merchant = merchantOpt.get();
                    merchant.setPassword(newPassword); // In a real app, this should be encoded
                    merchant.setUpdatedAt(LocalDateTime.now());
                    merchantRepository.save(merchant);
                    passwordUpdated = true;
                }
            }

            // Check Admin table
            if (!passwordUpdated) {
                Optional<adminManagementEntity> adminOpt = adminRepository.findByEmail(email);
                if (adminOpt.isPresent()) {
                    adminManagementEntity admin = adminOpt.get();
                    admin.setPassword(newPassword); // In a real app, this should be encoded
                    admin.setLastActive(LocalDateTime.now());
                    adminRepository.save(admin);
                    passwordUpdated = true;
                }
            }

            // Delete the OTP record after successful password reset
            if (passwordUpdated) {
                otpRepository.delete(otpEntityOpt.get());
            }

            logger.info("Password reset " + (passwordUpdated ? "successful" : "failed") + " for: {}", email);
            return passwordUpdated;

        } catch (Exception e) {
            logger.error("Error updating password: {}", e.getMessage());
            return false;
        }
    }
}