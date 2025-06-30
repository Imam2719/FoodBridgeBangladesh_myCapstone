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

            // Check if email already exists
            if (merchantAddRepository.existsByEmail(merchantDTO.getEmail())) {
                logger.warning("Email already in use: " + merchantDTO.getEmail());
                throw new RuntimeException("Email already in use");
            }

            // Check if business license number already exists
            if (merchantAddRepository.existsByBusinessLicenseNumber(merchantDTO.getBusinessLicenseNumber())) {
                logger.warning("Business license already registered: " + merchantDTO.getBusinessLicenseNumber());
                throw new RuntimeException("Business license number already registered");
            }

            // Create a new merchant entity
            MerchantEntity merchant = new MerchantEntity();
            logger.info("Created new merchant entity");

            // Set business information
            merchant.setBusinessName(merchantDTO.getBusinessName());
            merchant.setBusinessType(merchantDTO.getBusinessType());
            merchant.setBusinessDescription(merchantDTO.getBusinessDescription());
            logger.info("Set business information successfully");

            // Set owner information
            merchant.setOwnerFirstName(merchantDTO.getOwnerFirstName());
            merchant.setOwnerLastName(merchantDTO.getOwnerLastName());
            merchant.setEmail(merchantDTO.getEmail());
            merchant.setPassword(merchantDTO.getPassword()); // Note: In a production app, password should be encrypted
            merchant.setPhoneNumber(merchantDTO.getPhoneNumber());
            logger.info("Set owner information successfully");

            // Set identification details
            merchant.setNationalIdNumber(merchantDTO.getNationalIdNumber());
            merchant.setPassportNumber(merchantDTO.getPassportNumber());
            merchant.setBirthCertificateNumber(merchantDTO.getBirthCertificateNumber());
            merchant.setBloodGroup(merchantDTO.getBloodGroup());
            logger.info("Set identification details successfully");

            // Set business license
            merchant.setBusinessLicenseNumber(merchantDTO.getBusinessLicenseNumber());
            logger.info("Set business license successfully");

            // Set location details
            merchant.setBusinessAddress(merchantDTO.getBusinessAddress());
            merchant.setCity(merchantDTO.getCity());
            merchant.setStateProvince(merchantDTO.getStateProvince());
            merchant.setPostalCode(merchantDTO.getPostalCode());
            merchant.setBusinessHours(merchantDTO.getBusinessHours());
            logger.info("Set location details successfully");

            // Set donation information
            merchant.setDonatesPreparedMeals(merchantDTO.isDonatesPreparedMeals());
            merchant.setDonatesFreshProduce(merchantDTO.isDonatesFreshProduce());
            merchant.setDonatesBakedGoods(merchantDTO.isDonatesBakedGoods());
            merchant.setDonatesPackagedFoods(merchantDTO.isDonatesPackagedFoods());
            merchant.setDonatesDairyProducts(merchantDTO.isDonatesDairyProducts());
            merchant.setDonationFrequency(merchantDTO.getDonationFrequency());
            merchant.setDonationSize(merchantDTO.getDonationSize());
            logger.info("Set donation information successfully");

            // Handle logo upload if provided
            MultipartFile logoFile = merchantDTO.getLogo();
            if (logoFile != null && !logoFile.isEmpty()) {
                try {
                    logger.info("Processing logo file: " + logoFile.getOriginalFilename() +
                            ", Size: " + logoFile.getSize() +
                            ", Content Type: " + logoFile.getContentType());

                    byte[] logoBytes = logoFile.getBytes();
                    // Convert to Base64
                    String logoBase64 = Base64.getEncoder().encodeToString(logoBytes);
                    merchant.setLogoBase64(logoBase64);
                    merchant.setLogoName(logoFile.getOriginalFilename());
                    merchant.setLogoType(logoFile.getContentType());
                    logger.info("Logo processed successfully");
                } catch (IOException e) {
                    logger.severe("Error processing logo file: " + e.getMessage());
                    // Continue without logo rather than failing the whole request
                    merchant.setLogoBase64(null);
                    merchant.setLogoName(null);
                    merchant.setLogoType(null);
                }
            } else {
                logger.info("No logo file provided or empty file");
            }

            // Handle license document upload if provided
            MultipartFile licenseFile = merchantDTO.getLicenseDocument();
            if (licenseFile != null && !licenseFile.isEmpty()) {
                try {
                    logger.info("Processing license file: " + licenseFile.getOriginalFilename() +
                            ", Size: " + licenseFile.getSize() +
                            ", Content Type: " + licenseFile.getContentType());

                    byte[] licenseBytes = licenseFile.getBytes();
                    // Convert to Base64
                    String licenseBase64 = Base64.getEncoder().encodeToString(licenseBytes);
                    merchant.setLicenseDocumentBase64(licenseBase64);
                    merchant.setLicenseDocumentName(licenseFile.getOriginalFilename());
                    merchant.setLicenseDocumentType(licenseFile.getContentType());
                    logger.info("License document processed successfully");
                } catch (IOException e) {
                    logger.severe("Error processing license file: " + e.getMessage());
                    // Continue without license document rather than failing the whole request
                    merchant.setLicenseDocumentBase64(null);
                    merchant.setLicenseDocumentName(null);
                    merchant.setLicenseDocumentType(null);
                }
            } else {
                logger.info("No license file provided or empty file");
            }

            // Save the merchant
            logger.info("Saving merchant to database");
            MerchantEntity savedMerchant = merchantAddRepository.save(merchant);
            logger.info("Merchant saved successfully with ID: " + savedMerchant.getMerchantId());

            return savedMerchant;

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