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
    public MerchantEntity addMerchant(MerchantDTO merchantDTO) throws Exception {
        try {
            logger.info("Starting merchant registration process");
            logger.info("Validating merchant data...");

            if (merchantDTO == null) {
                logger.severe("MerchantDTO is null");
                throw new IllegalArgumentException("Merchant data cannot be null");
            }

            // Log the validation checks
            logger.info("Checking email: " + merchantDTO.getEmail());
            if (merchantAddRepository.existsByEmail(merchantDTO.getEmail())) {
                logger.warning("Email already in use: " + merchantDTO.getEmail());
                throw new RuntimeException("Email already in use");
            }

            logger.info("Checking business license: " + merchantDTO.getBusinessLicenseNumber());
            if (merchantAddRepository.existsByBusinessLicenseNumber(merchantDTO.getBusinessLicenseNumber())) {
                logger.warning("Business license already registered: " + merchantDTO.getBusinessLicenseNumber());
                throw new RuntimeException("Business license number already registered");
            }

            // Create a new merchant entity
            MerchantEntity merchant = new MerchantEntity();
            logger.info("Created new merchant entity");

            try {
                // Set business information
                merchant.setBusinessName(merchantDTO.getBusinessName());
                merchant.setBusinessType(merchantDTO.getBusinessType());
                merchant.setBusinessDescription(merchantDTO.getBusinessDescription());
                logger.info("Business information set successfully");

                // Set owner information
                merchant.setOwnerFirstName(merchantDTO.getOwnerFirstName());
                merchant.setOwnerLastName(merchantDTO.getOwnerLastName());
                merchant.setEmail(merchantDTO.getEmail());
                merchant.setPassword(merchantDTO.getPassword()); // Note: In a production app, password should be encrypted
                merchant.setPhoneNumber(merchantDTO.getPhoneNumber());
                logger.info("Owner information set successfully");

                // Set identification details
                merchant.setNationalIdNumber(merchantDTO.getNationalIdNumber());
                merchant.setPassportNumber(merchantDTO.getPassportNumber());
                merchant.setBirthCertificateNumber(merchantDTO.getBirthCertificateNumber());
                merchant.setBloodGroup(merchantDTO.getBloodGroup());
                logger.info("Identification details set successfully");

                // Set business license
                merchant.setBusinessLicenseNumber(merchantDTO.getBusinessLicenseNumber());
                logger.info("Business license set successfully");

                // Set location details
                merchant.setBusinessAddress(merchantDTO.getBusinessAddress());
                merchant.setCity(merchantDTO.getCity());
                merchant.setStateProvince(merchantDTO.getStateProvince());
                merchant.setPostalCode(merchantDTO.getPostalCode());
                merchant.setBusinessHours(merchantDTO.getBusinessHours());
                logger.info("Location details set successfully");

                // Set donation information
                merchant.setDonatesPreparedMeals(merchantDTO.isDonatesPreparedMeals());
                merchant.setDonatesFreshProduce(merchantDTO.isDonatesFreshProduce());
                merchant.setDonatesBakedGoods(merchantDTO.isDonatesBakedGoods());
                merchant.setDonatesPackagedFoods(merchantDTO.isDonatesPackagedFoods());
                merchant.setDonatesDairyProducts(merchantDTO.isDonatesDairyProducts());
                merchant.setDonationFrequency(merchantDTO.getDonationFrequency());
                merchant.setDonationSize(merchantDTO.getDonationSize());
                logger.info("Donation information set successfully");

                // Handle logo upload
                if (merchantDTO.getLogo() != null && !merchantDTO.getLogo().isEmpty()) {
                    logger.info("Processing logo file: " + merchantDTO.getLogo().getOriginalFilename());
                    try {
                        byte[] logoBytes = merchantDTO.getLogo().getBytes();
                        String logoBase64 = Base64.getEncoder().encodeToString(logoBytes);
                        merchant.setLogoBase64(logoBase64);
                        merchant.setLogoName(merchantDTO.getLogo().getOriginalFilename());
                        merchant.setLogoType(merchantDTO.getLogo().getContentType());
                        logger.info("Logo processed successfully");
                    } catch (IOException e) {
                        logger.severe("Error processing logo: " + e.getMessage());
                        throw new RuntimeException("Error processing logo file", e);
                    }
                } else {
                    logger.info("No logo file provided or empty file");
                }

                // Handle license document
                if (merchantDTO.getLicenseDocument() != null && !merchantDTO.getLicenseDocument().isEmpty()) {
                    logger.info("Processing license document: " + merchantDTO.getLicenseDocument().getOriginalFilename());
                    try {
                        byte[] licenseBytes = merchantDTO.getLicenseDocument().getBytes();
                        String licenseBase64 = Base64.getEncoder().encodeToString(licenseBytes);
                        merchant.setLicenseDocumentBase64(licenseBase64);
                        merchant.setLicenseDocumentName(merchantDTO.getLicenseDocument().getOriginalFilename());
                        merchant.setLicenseDocumentType(merchantDTO.getLicenseDocument().getContentType());
                        logger.info("License document processed successfully");
                    } catch (IOException e) {
                        logger.severe("Error processing license document: " + e.getMessage());
                        throw new RuntimeException("Error processing license document", e);
                    }
                } else {
                    logger.info("No license file provided or empty file");
                }

                logger.info("Attempting to save merchant to database");
                MerchantEntity savedMerchant = merchantAddRepository.save(merchant);
                logger.info("Merchant saved successfully with ID: " + savedMerchant.getMerchantId());
                return savedMerchant;

            } catch (Exception e) {
                logger.severe("Error while setting merchant properties: " + e.getMessage());
                throw new RuntimeException("Error setting merchant properties", e);
            }

        } catch (Exception e) {
            logger.severe("Error in addMerchant: " + e.getMessage());
            e.printStackTrace();
            throw e;
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