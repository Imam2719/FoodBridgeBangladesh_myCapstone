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
            logger.info("Starting merchant registration");

            // Basic validation
            validateBasicFields(merchantDTO);

            // Create merchant entity
            MerchantEntity merchant = new MerchantEntity();

            // Set basic information (required fields)
            merchant.setBusinessName(merchantDTO.getBusinessName());
            merchant.setEmail(merchantDTO.getEmail());
            merchant.setPassword(merchantDTO.getPassword());
            merchant.setPhoneNumber(merchantDTO.getPhoneNumber());
            merchant.setBusinessLicenseNumber(merchantDTO.getBusinessLicenseNumber());

            // Set optional information
            if (merchantDTO.getBusinessType() != null) {
                merchant.setBusinessType(merchantDTO.getBusinessType());
            }
            if (merchantDTO.getBusinessDescription() != null) {
                merchant.setBusinessDescription(merchantDTO.getBusinessDescription());
            }
            if (merchantDTO.getOwnerFirstName() != null) {
                merchant.setOwnerFirstName(merchantDTO.getOwnerFirstName());
            }
            if (merchantDTO.getOwnerLastName() != null) {
                merchant.setOwnerLastName(merchantDTO.getOwnerLastName());
            }

            // Handle file uploads separately
            try {
                handleFileUploads(merchant, merchantDTO);
            } catch (Exception e) {
                logger.warning("File upload failed but continuing with merchant creation: " + e.getMessage());
            }

            // Save merchant
            merchant.setStatus("Pending");
            merchant.setCreatedAt(LocalDateTime.now());

            logger.info("Attempting to save merchant to database");
            return merchantAddRepository.save(merchant);

        } catch (Exception e) {
            logger.severe("Error in merchant registration: " + e.getMessage());
            throw new RuntimeException("Failed to register merchant: " + e.getMessage());
        }
    }

    private void validateBasicFields(MerchantDTO merchantDTO) {
        if (merchantDTO == null) {
            throw new IllegalArgumentException("Merchant data is required");
        }

        StringBuilder errors = new StringBuilder();

        if (isNullOrEmpty(merchantDTO.getBusinessName())) {
            errors.append("Business name is required. ");
        }
        if (isNullOrEmpty(merchantDTO.getEmail())) {
            errors.append("Email is required. ");
        }
        if (isNullOrEmpty(merchantDTO.getPassword())) {
            errors.append("Password is required. ");
        }
        if (isNullOrEmpty(merchantDTO.getBusinessLicenseNumber())) {
            errors.append("Business license number is required. ");
        }

        if (errors.length() > 0) {
            throw new IllegalArgumentException(errors.toString().trim());
        }
    }

    private void handleFileUploads(MerchantEntity merchant, MerchantDTO merchantDTO) {
        // Handle logo
        if (merchantDTO.getLogo() != null && !merchantDTO.getLogo().isEmpty()) {
            try {
                byte[] logoBytes = merchantDTO.getLogo().getBytes();
                merchant.setLogoBase64(Base64.getEncoder().encodeToString(logoBytes));
                merchant.setLogoName(merchantDTO.getLogo().getOriginalFilename());
                merchant.setLogoType(merchantDTO.getLogo().getContentType());
            } catch (IOException e) {
                logger.warning("Failed to process logo: " + e.getMessage());
            }
        }

        // Handle license document
        if (merchantDTO.getLicenseDocument() != null && !merchantDTO.getLicenseDocument().isEmpty()) {
            try {
                byte[] licenseBytes = merchantDTO.getLicenseDocument().getBytes();
                merchant.setLicenseDocumentBase64(Base64.getEncoder().encodeToString(licenseBytes));
                merchant.setLicenseDocumentName(merchantDTO.getLicenseDocument().getOriginalFilename());
                merchant.setLicenseDocumentType(merchantDTO.getLicenseDocument().getContentType());
            } catch (IOException e) {
                logger.warning("Failed to process license document: " + e.getMessage());
            }
        }
    }

    private boolean isNullOrEmpty(String value) {
        return value == null || value.trim().isEmpty();
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