package com.FoodBridgeBangladesh.Service.admin;

import com.FoodBridgeBangladesh.Model.admin.MerchantEntity;
import com.FoodBridgeBangladesh.Model.admin.dto.MerchantDTO;
import com.FoodBridgeBangladesh.Repository.admin.MerchantAddRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@Service
public class MerchantAddService {
    private static final Logger logger = Logger.getLogger(MerchantAddService.class.getName());

    private final MerchantAddRepository merchantAddRepository;

    @Autowired
    public MerchantAddService(MerchantAddRepository merchantAddRepository) {
        this.merchantAddRepository = merchantAddRepository;
    }

    @Transactional
    public MerchantEntity addMerchant(MerchantDTO merchantDTO) {
        try {
            logger.info("Starting merchant registration process");

            // Validate the DTO
            validateMerchantDTO(merchantDTO);

            // Validate file types if files are present
            if (merchantDTO.getLogo() != null && !merchantDTO.getLogo().isEmpty()) {
                validateFileType(merchantDTO.getLogo(), "image");
            }
            if (merchantDTO.getLicenseDocument() != null && !merchantDTO.getLicenseDocument().isEmpty()) {
                validateFileType(merchantDTO.getLicenseDocument(), "document");
            }

            // Create and populate merchant entity
            MerchantEntity merchant = createMerchantFromDTO(merchantDTO);

            // Save to database
            try {
                logger.info("Attempting to save merchant to database");
                MerchantEntity savedMerchant = merchantAddRepository.save(merchant);
                logger.info("Merchant saved successfully with ID: " + savedMerchant.getMerchantId());
                return savedMerchant;
            } catch (Exception e) {
                String errorMessage = e.getMessage();
                logger.severe("Database error while saving merchant: " + errorMessage);
                
                if (errorMessage.contains("duplicate key") || errorMessage.contains("unique constraint")) {
                    if (errorMessage.contains("email")) {
                        throw new RuntimeException("Email already in use");
                    } else if (errorMessage.contains("business_license_number")) {
                        throw new RuntimeException("Business license number already registered");
                    }
                }
                
                throw new RuntimeException("Failed to save merchant: " + errorMessage);
            }

        } catch (Exception e) {
            logger.severe("Error in addMerchant: " + e.getMessage());
            throw e; // Re-throw the exception to be handled by the controller
        }
    }

    private void validateFileType(MultipartFile file, String type) {
        String contentType = file.getContentType();
        if (contentType == null) {
            throw new RuntimeException("Invalid file format: Content type is null");
        }

        if (type.equals("image")) {
            if (!contentType.startsWith("image/")) {
                throw new RuntimeException("Invalid file format: Logo must be an image file");
            }
        } else if (type.equals("document")) {
            List<String> allowedTypes = Arrays.asList(
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            );
            if (!allowedTypes.contains(contentType)) {
                throw new RuntimeException("Invalid file format: License document must be a PDF or Word file");
            }
        }
    }

    private void validateMerchantDTO(MerchantDTO merchantDTO) {
        if (merchantDTO == null) {
            logger.severe("MerchantDTO is null");
            throw new IllegalArgumentException("Merchant data cannot be null");
        }

        // Validate email
        if (merchantDTO.getEmail() == null || merchantDTO.getEmail().trim().isEmpty()) {
            logger.severe("Email is null or empty");
            throw new IllegalArgumentException("Email is required");
        }

        // Check if email exists
        if (merchantAddRepository.existsByEmail(merchantDTO.getEmail())) {
            logger.warning("Email already in use: " + merchantDTO.getEmail());
            throw new RuntimeException("Email already in use");
        }

        // Validate business license
        if (merchantDTO.getBusinessLicenseNumber() == null || merchantDTO.getBusinessLicenseNumber().trim().isEmpty()) {
            logger.severe("Business license number is null or empty");
            throw new IllegalArgumentException("Business license number is required");
        }

        // Check if business license exists
        if (merchantAddRepository.existsByBusinessLicenseNumber(merchantDTO.getBusinessLicenseNumber())) {
            logger.warning("Business license already registered: " + merchantDTO.getBusinessLicenseNumber());
            throw new RuntimeException("Business license number already registered");
        }
    }

    private MerchantEntity createMerchantFromDTO(MerchantDTO merchantDTO) {
        try {
            MerchantEntity merchant = new MerchantEntity();
            
            // Set basic information
            merchant.setBusinessName(merchantDTO.getBusinessName());
            merchant.setBusinessType(merchantDTO.getBusinessType());
            merchant.setBusinessDescription(merchantDTO.getBusinessDescription());
            merchant.setOwnerFirstName(merchantDTO.getOwnerFirstName());
            merchant.setOwnerLastName(merchantDTO.getOwnerLastName());
            merchant.setEmail(merchantDTO.getEmail());
            merchant.setPassword(merchantDTO.getPassword());
            merchant.setPhoneNumber(merchantDTO.getPhoneNumber());

            // Set identification details
            merchant.setNationalIdNumber(merchantDTO.getNationalIdNumber());
            merchant.setPassportNumber(merchantDTO.getPassportNumber());
            merchant.setBirthCertificateNumber(merchantDTO.getBirthCertificateNumber());
            merchant.setBloodGroup(merchantDTO.getBloodGroup());
            merchant.setBusinessLicenseNumber(merchantDTO.getBusinessLicenseNumber());

            // Set location details
            merchant.setBusinessAddress(merchantDTO.getBusinessAddress());
            merchant.setCity(merchantDTO.getCity());
            merchant.setStateProvince(merchantDTO.getStateProvince());
            merchant.setPostalCode(merchantDTO.getPostalCode());
            merchant.setBusinessHours(merchantDTO.getBusinessHours());

            // Process logo
            processLogoFile(merchant, merchantDTO);

            // Process license document
            processLicenseFile(merchant, merchantDTO);

            return merchant;
        } catch (Exception e) {
            logger.severe("Error creating merchant entity: " + e.getMessage());
            throw new RuntimeException("Failed to create merchant entity", e);
        }
    }

    private void processLogoFile(MerchantEntity merchant, MerchantDTO merchantDTO) {
        try {
            if (merchantDTO.getLogo() != null && !merchantDTO.getLogo().isEmpty()) {
                byte[] logoBytes = merchantDTO.getLogo().getBytes();
                String logoBase64 = Base64.getEncoder().encodeToString(logoBytes);
                merchant.setLogoBase64(logoBase64);
                merchant.setLogoName(merchantDTO.getLogo().getOriginalFilename());
                merchant.setLogoType(merchantDTO.getLogo().getContentType());
                logger.info("Logo processed successfully");
            }
        } catch (IOException e) {
            logger.warning("Error processing logo file: " + e.getMessage());
            // Continue without logo rather than failing the whole request
            merchant.setLogoBase64(null);
            merchant.setLogoName(null);
            merchant.setLogoType(null);
        }
    }

    private void processLicenseFile(MerchantEntity merchant, MerchantDTO merchantDTO) {
        try {
            if (merchantDTO.getLicenseDocument() != null && !merchantDTO.getLicenseDocument().isEmpty()) {
                byte[] licenseBytes = merchantDTO.getLicenseDocument().getBytes();
                String licenseBase64 = Base64.getEncoder().encodeToString(licenseBytes);
                merchant.setLicenseDocumentBase64(licenseBase64);
                merchant.setLicenseDocumentName(merchantDTO.getLicenseDocument().getOriginalFilename());
                merchant.setLicenseDocumentType(merchantDTO.getLicenseDocument().getContentType());
                logger.info("License document processed successfully");
            }
        } catch (IOException e) {
            logger.warning("Error processing license document: " + e.getMessage());
            // Continue without license document rather than failing the whole request
            merchant.setLicenseDocumentBase64(null);
            merchant.setLicenseDocumentName(null);
            merchant.setLicenseDocumentType(null);
        }
    }

    @Transactional(readOnly = true)
    public List<MerchantEntity> getAllMerchants() {
        return merchantAddRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<MerchantEntity> getMerchantById(String merchantId) {
        return merchantAddRepository.findByMerchantId(merchantId);
    }

    @Transactional
    public MerchantEntity updateMerchantStatus(String merchantId, String status) {
        Optional<MerchantEntity> merchantOpt = merchantAddRepository.findByMerchantId(merchantId);
        if (merchantOpt.isPresent()) {
            MerchantEntity merchant = merchantOpt.get();
            merchant.setStatus(status);
            merchant.setUpdatedAt(LocalDateTime.now());
            return merchantAddRepository.save(merchant);
        } else {
            throw new RuntimeException("Merchant not found with ID: " + merchantId);
        }
    }

    @Transactional
    public void deleteMerchant(String merchantId) {
        Optional<MerchantEntity> merchantOpt = merchantAddRepository.findByMerchantId(merchantId);
        if (merchantOpt.isPresent()) {
            merchantAddRepository.delete(merchantOpt.get());
        } else {
            throw new RuntimeException("Merchant not found with ID: " + merchantId);
        }
    }
}