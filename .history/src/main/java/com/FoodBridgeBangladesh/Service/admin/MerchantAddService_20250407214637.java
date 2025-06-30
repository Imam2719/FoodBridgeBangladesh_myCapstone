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
            // Simple validation
            if (merchantDTO == null) {
                throw new IllegalArgumentException("Merchant data cannot be null");
            }

            // Create new merchant
            MerchantEntity merchant = new MerchantEntity();
            
            // Set required fields
            merchant.setBusinessName(merchantDTO.getBusinessName());
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
            
            // Set status and timestamps
            merchant.setStatus("Pending");
            merchant.setCreatedAt(LocalDateTime.now());

            // Process files without validation
            if (merchantDTO.getLogo() != null && !merchantDTO.getLogo().isEmpty()) {
                merchant.setLogoBase64(Base64.getEncoder().encodeToString(merchantDTO.getLogo().getBytes()));
                merchant.setLogoName(merchantDTO.getLogo().getOriginalFilename());
                merchant.setLogoType(merchantDTO.getLogo().getContentType());
            }

            if (merchantDTO.getLicenseDocument() != null && !merchantDTO.getLicenseDocument().isEmpty()) {
                merchant.setLicenseDocumentBase64(Base64.getEncoder().encodeToString(merchantDTO.getLicenseDocument().getBytes()));
                merchant.setLicenseDocumentName(merchantDTO.getLicenseDocument().getOriginalFilename());
                merchant.setLicenseDocumentType(merchantDTO.getLicenseDocument().getContentType());
            }

            // Save and return
            return merchantAddRepository.save(merchant);

        } catch (Exception e) {
            logger.severe("Failed to add merchant: " + e.getMessage());
            throw new RuntimeException("Failed to add merchant: " + e.getMessage());
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