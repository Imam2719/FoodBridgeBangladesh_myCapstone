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
import java.util.ArrayList;
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
            logger.info("Starting merchant registration for business: " + merchantDTO.getBusinessName());

            // Basic validation
            if (merchantDTO == null) {
                logger.severe("MerchantDTO is null");
                throw new IllegalArgumentException("Merchant data cannot be null");
            }

            // Extended validation
            validateMerchantDTO(merchantDTO);
            
            // File validation
            validateFiles(merchantDTO);

            // Create merchant entity
            MerchantEntity merchant = createMerchantFromDTO(merchantDTO);
            
            // Debug log before save
            logger.info("Attempting to save merchant: " + merchant.getBusinessName());
            logger.info("Email: " + merchant.getEmail());
            logger.info("Business License: " + merchant.getBusinessLicenseNumber());

            try {
                merchant = merchantAddRepository.save(merchant);
                logger.info("Merchant saved successfully with ID: " + merchant.getMerchantId());
                return merchant;
            } catch (Exception e) {
                logger.severe("Database error: " + e.getMessage());
                if (e.getMessage().contains("constraint")) {
                    if (e.getMessage().toLowerCase().contains("email")) {
                        throw new RuntimeException("Email already registered: " + merchant.getEmail());
                    } else if (e.getMessage().toLowerCase().contains("business_license")) {
                        throw new RuntimeException("Business license already exists: " + merchant.getBusinessLicenseNumber());
                    }
                }
                throw e;
            }
        } catch (Exception e) {
            logger.severe("Error in addMerchant: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to add merchant: " + e.getMessage());
        }
    }

    private void validateFiles(MerchantDTO merchantDTO) {
        // Logo validation
        if (merchantDTO.getLogo() != null && !merchantDTO.getLogo().isEmpty()) {
            if (merchantDTO.getLogo().getSize() > 5242880) { // 5MB
                throw new IllegalArgumentException("Logo file size must be less than 5MB");
            }
            if (!merchantDTO.getLogo().getContentType().startsWith("image/")) {
                throw new IllegalArgumentException("Logo must be an image file");
            }
        }

        // License document validation
        if (merchantDTO.getLicenseDocument() != null && !merchantDTO.getLicenseDocument().isEmpty()) {
            if (merchantDTO.getLicenseDocument().getSize() > 10485760) { // 10MB
                throw new IllegalArgumentException("License document size must be less than 10MB");
            }
            String contentType = merchantDTO.getLicenseDocument().getContentType();
            if (!contentType.equals("application/pdf") && 
                !contentType.equals("application/msword") && 
                !contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
                throw new IllegalArgumentException("License document must be PDF or Word file");
            }
        }
    }

    private void validateMerchantDTO(MerchantDTO merchantDTO) {
        List<String> errors = new ArrayList<>();

        // Required fields validation
        if (isNullOrEmpty(merchantDTO.getBusinessName())) errors.add("Business name is required");
        if (isNullOrEmpty(merchantDTO.getEmail())) errors.add("Email is required");
        if (isNullOrEmpty(merchantDTO.getPassword())) errors.add("Password is required");
        if (isNullOrEmpty(merchantDTO.getBusinessLicenseNumber())) errors.add("Business license number is required");
        
        // Email format validation
        if (!isNullOrEmpty(merchantDTO.getEmail()) && !merchantDTO.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            errors.add("Invalid email format");
        }

        // Business license format validation (assuming a specific format)
        if (!isNullOrEmpty(merchantDTO.getBusinessLicenseNumber()) && 
            !merchantDTO.getBusinessLicenseNumber().matches("^[A-Z0-9-]{5,15}$")) {
            errors.add("Invalid business license format");
        }

        if (!errors.isEmpty()) {
            logger.severe("Validation errors: " + String.join(", ", errors));
            throw new IllegalArgumentException("Validation failed: " + String.join(", ", errors));
        }
    }

    private boolean isNullOrEmpty(String value) {
        return value == null || value.trim().isEmpty();
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