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
import java.util.logging.Level;
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
            // Basic validation
            if (merchantDTO == null) {
                throw new IllegalArgumentException("Merchant data cannot be null");
            }

            // Validate required fields
            validateRequiredFields(merchantDTO);

            // Check for duplicate email
            if (merchantAddRepository.existsByEmail(merchantDTO.getEmail())) {
                throw new IllegalArgumentException("A merchant with this email already exists");
            }

            // Check for duplicate business license number
            if (merchantDTO.getBusinessLicenseNumber() != null &&
                    !merchantDTO.getBusinessLicenseNumber().trim().isEmpty() &&
                    merchantAddRepository.existsByBusinessLicenseNumber(merchantDTO.getBusinessLicenseNumber())) {
                throw new IllegalArgumentException("A merchant with this business license number already exists");
            }

            // Create new merchant
            MerchantEntity merchant = new MerchantEntity();
            merchant.setBusinessName(merchantDTO.getBusinessName());
            // In the addMerchant method, where you set other merchant fields
            merchant.setFeeType(merchantDTO.getFeeType());
            merchant.setFeeAmount(merchantDTO.getFeeAmount());
            merchant.setEmail(merchantDTO.getEmail());
            merchant.setPassword(merchantDTO.getPassword());
            merchant.setBusinessType(merchantDTO.getBusinessType());
            merchant.setOwnerFirstName(merchantDTO.getOwnerFirstName());
            merchant.setOwnerLastName(merchantDTO.getOwnerLastName());
            merchant.setPhoneNumber(merchantDTO.getPhoneNumber());
            merchant.setBusinessLicenseNumber(merchantDTO.getBusinessLicenseNumber());
            merchant.setBusinessAddress(merchantDTO.getBusinessAddress());
            merchant.setCity(merchantDTO.getCity());
            merchant.setStateProvince(merchantDTO.getStateProvince());
            merchant.setPostalCode(merchantDTO.getPostalCode());

            // Set optional fields
            merchant.setBusinessDescription(merchantDTO.getBusinessDescription());
            merchant.setNationalIdNumber(merchantDTO.getNationalIdNumber());
            merchant.setPassportNumber(merchantDTO.getPassportNumber());
            merchant.setBirthCertificateNumber(merchantDTO.getBirthCertificateNumber());
            merchant.setBloodGroup(merchantDTO.getBloodGroup());
            merchant.setBusinessHours(merchantDTO.getBusinessHours());

            // Set donation preferences
            merchant.setDonatesPreparedMeals(merchantDTO.isDonatesPreparedMeals());
            merchant.setDonatesFreshProduce(merchantDTO.isDonatesFreshProduce());
            merchant.setDonatesBakedGoods(merchantDTO.isDonatesBakedGoods());
            merchant.setDonatesPackagedFoods(merchantDTO.isDonatesPackagedFoods());
            merchant.setDonatesDairyProducts(merchantDTO.isDonatesDairyProducts());
            merchant.setDonationFrequency(merchantDTO.getDonationFrequency());
            merchant.setDonationSize(merchantDTO.getDonationSize());

            // Set status and timestamps
            merchant.setStatus("Pending");
            merchant.setCreatedAt(LocalDateTime.now());

            // Process logo file
            processLogoFile(merchantDTO, merchant);

            // Process license document file
            processLicenseDocument(merchantDTO, merchant);

            // Ensure user_type is "merchant" (this is redundant but guarantees it)
            merchant.setUserType("merchant");

            // Save and return
            logger.info("Saving new merchant: " + merchant.getBusinessName());
            return merchantAddRepository.save(merchant);

        } catch (IllegalArgumentException e) {
            logger.log(Level.WARNING, "Validation error: {0}", e.getMessage());
            throw e;
        } catch (IOException e) {
            logger.log(Level.SEVERE, "File processing error: {0}", e.getMessage());
            throw new RuntimeException("Failed to process uploaded files: " + e.getMessage(), e);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Failed to add merchant: {0}", e.getMessage());
            throw new RuntimeException("Failed to add merchant: " + e.getMessage(), e);
        }
    }

    private void validateRequiredFields(MerchantDTO merchantDTO) {
        StringBuilder errorMessage = new StringBuilder();

        if (isNullOrEmpty(merchantDTO.getBusinessName())) errorMessage.append("Business name is required. ");
        if (isNullOrEmpty(merchantDTO.getBusinessType())) errorMessage.append("Business type is required. ");
        if (isNullOrEmpty(merchantDTO.getOwnerFirstName())) errorMessage.append("Owner first name is required. ");
        if (isNullOrEmpty(merchantDTO.getOwnerLastName())) errorMessage.append("Owner last name is required. ");
        if (isNullOrEmpty(merchantDTO.getEmail())) errorMessage.append("Email is required. ");
        if (isNullOrEmpty(merchantDTO.getPassword())) errorMessage.append("Password is required. ");
        if (isNullOrEmpty(merchantDTO.getPhoneNumber())) errorMessage.append("Phone number is required. ");
        if (isNullOrEmpty(merchantDTO.getBusinessLicenseNumber())) errorMessage.append("Business license number is required. ");
        if (isNullOrEmpty(merchantDTO.getBusinessAddress())) errorMessage.append("Business address is required. ");
        if (isNullOrEmpty(merchantDTO.getCity())) errorMessage.append("City is required. ");
        if (isNullOrEmpty(merchantDTO.getStateProvince())) errorMessage.append("State/Province is required. ");
        if (isNullOrEmpty(merchantDTO.getPostalCode())) errorMessage.append("Postal code is required. ");

        // Check if license document is provided (it's required)
        if (merchantDTO.getLicenseDocument() == null || merchantDTO.getLicenseDocument().isEmpty()) {
            errorMessage.append("Business license document is required. ");
        }

        if (errorMessage.length() > 0) {
            throw new IllegalArgumentException(errorMessage.toString());
        }
    }

    private boolean isNullOrEmpty(String value) {
        return value == null || value.trim().isEmpty();
    }

    private void processLogoFile(MerchantDTO merchantDTO, MerchantEntity merchant) throws IOException {
        MultipartFile logo = merchantDTO.getLogo();
        if (logo != null && !logo.isEmpty()) {
            try {
                merchant.setLogoBase64(Base64.getEncoder().encodeToString(logo.getBytes()));
                merchant.setLogoName(logo.getOriginalFilename());
                merchant.setLogoType(logo.getContentType());
                logger.info("Logo processed successfully: " + logo.getOriginalFilename());
            } catch (IOException e) {
                logger.log(Level.WARNING, "Error processing logo: {0}", e.getMessage());
                throw new IOException("Failed to process logo file: " + e.getMessage(), e);
            }
        }
    }

    private void processLicenseDocument(MerchantDTO merchantDTO, MerchantEntity merchant) throws IOException {
        MultipartFile licenseDocument = merchantDTO.getLicenseDocument();
        if (licenseDocument != null && !licenseDocument.isEmpty()) {
            try {
                // Log file details for debugging
                logger.info("Processing license file: " + licenseDocument.getOriginalFilename() +
                        ", Size: " + licenseDocument.getSize() +
                        ", ContentType: " + licenseDocument.getContentType());

                merchant.setLicenseDocumentBase64(Base64.getEncoder().encodeToString(licenseDocument.getBytes()));
                merchant.setLicenseDocumentName(licenseDocument.getOriginalFilename());
                merchant.setLicenseDocumentType(licenseDocument.getContentType());
                merchant.setLicenseName(licenseDocument.getOriginalFilename()); // Set the licenseName field
            } catch (IOException e) {
                logger.log(Level.SEVERE, "Error processing license document: {0}", e.getMessage());
                throw new IOException("Failed to process license document: " + e.getMessage(), e);
            }
        } else {
            // Always set a non-null value
            merchant.setLicenseDocumentName("No Document");
            merchant.setLicenseDocumentBase64("");
            merchant.setLicenseDocumentType("application/octet-stream");
            merchant.setLicenseName("Trade License"); // Set a default value
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

            // Ensure user_type remains "merchant" when updating
            merchant.setUserType("merchant");

            return merchantAddRepository.save(merchant);
        } else {
            throw new RuntimeException("Merchant not found with ID: " + merchantId);
        }
    }

    @Transactional
    public MerchantEntity updateMerchant(String merchantId, MerchantDTO merchantDTO) throws IOException {
        Optional<MerchantEntity> merchantOpt = merchantAddRepository.findByMerchantId(merchantId);
        if (!merchantOpt.isPresent()) {
            throw new RuntimeException("Merchant not found with ID: " + merchantId);
        }

        MerchantEntity merchant = merchantOpt.get();

        // Update fields if provided in DTO
        if (merchantDTO.getBusinessName() != null) merchant.setBusinessName(merchantDTO.getBusinessName());
        if (merchantDTO.getBusinessType() != null) merchant.setBusinessType(merchantDTO.getBusinessType());
        if (merchantDTO.getBusinessDescription() != null) merchant.setBusinessDescription(merchantDTO.getBusinessDescription());
        if (merchantDTO.getOwnerFirstName() != null) merchant.setOwnerFirstName(merchantDTO.getOwnerFirstName());
        if (merchantDTO.getOwnerLastName() != null) merchant.setOwnerLastName(merchantDTO.getOwnerLastName());
        if (merchantDTO.getPhoneNumber() != null) merchant.setPhoneNumber(merchantDTO.getPhoneNumber());
        if (merchantDTO.getBusinessLicenseNumber() != null) merchant.setBusinessLicenseNumber(merchantDTO.getBusinessLicenseNumber());
        if (merchantDTO.getBusinessAddress() != null) merchant.setBusinessAddress(merchantDTO.getBusinessAddress());
        if (merchantDTO.getCity() != null) merchant.setCity(merchantDTO.getCity());
        if (merchantDTO.getStateProvince() != null) merchant.setStateProvince(merchantDTO.getStateProvince());
        if (merchantDTO.getPostalCode() != null) merchant.setPostalCode(merchantDTO.getPostalCode());
        if (merchantDTO.getBusinessHours() != null) merchant.setBusinessHours(merchantDTO.getBusinessHours());
        // In the updateMerchant method
        if (merchantDTO.getFeeType() != null) merchant.setFeeType(merchantDTO.getFeeType());
        if (merchantDTO.getFeeAmount() != null) merchant.setFeeAmount(merchantDTO.getFeeAmount());

        // Update donation preferences
        merchant.setDonatesPreparedMeals(merchantDTO.isDonatesPreparedMeals());
        merchant.setDonatesFreshProduce(merchantDTO.isDonatesFreshProduce());
        merchant.setDonatesBakedGoods(merchantDTO.isDonatesBakedGoods());
        merchant.setDonatesPackagedFoods(merchantDTO.isDonatesPackagedFoods());
        merchant.setDonatesDairyProducts(merchantDTO.isDonatesDairyProducts());
        if (merchantDTO.getDonationFrequency() != null) merchant.setDonationFrequency(merchantDTO.getDonationFrequency());
        if (merchantDTO.getDonationSize() != null) merchant.setDonationSize(merchantDTO.getDonationSize());

        // Process logo file if provided
        if (merchantDTO.getLogo() != null && !merchantDTO.getLogo().isEmpty()) {
            processLogoFile(merchantDTO, merchant);
        }

        // Process license document if provided
        if (merchantDTO.getLicenseDocument() != null && !merchantDTO.getLicenseDocument().isEmpty()) {
            processLicenseDocument(merchantDTO, merchant);
        }

        // Update timestamp
        merchant.setUpdatedAt(LocalDateTime.now());

        // Save and return
        return merchantAddRepository.save(merchant);
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