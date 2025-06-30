package com.FoodBridgeBangladesh.Controller.admin;

import com.FoodBridgeBangladesh.Model.admin.MerchantEntity;
import com.FoodBridgeBangladesh.Model.admin.dto.MerchantDTO;
import com.FoodBridgeBangladesh.Service.admin.MerchantAddService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/admin/merchants")
public class MerchantController {

    private final MerchantAddService merchantAddService;
    private static final Logger logger = Logger.getLogger(MerchantController.class.getName());

    @Autowired
    public MerchantController(MerchantAddService merchantAddService) {
        this.merchantAddService = merchantAddService;
    }

    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addMerchant(@ModelAttribute MerchantDTO merchantDTO) {
        try {
            // Log the received data
            logger.info("Received merchant data: " + merchantDTO.getBusinessName());
            
            // Validate required fields
            validateMerchantDTO(merchantDTO);

            MerchantEntity addedMerchant = merchantAddService.addMerchant(merchantDTO);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Merchant added successfully");
            response.put("merchantId", addedMerchant.getMerchantId());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    private void validateMerchantDTO(MerchantDTO merchantDTO) {
        List<String> missingFields = new ArrayList<>();

        if (isNullOrEmpty(merchantDTO.getBusinessName())) missingFields.add("Business Name");
        if (isNullOrEmpty(merchantDTO.getEmail())) missingFields.add("Email");
        if (isNullOrEmpty(merchantDTO.getPassword())) missingFields.add("Password");
        if (isNullOrEmpty(merchantDTO.getBusinessLicenseNumber())) missingFields.add("Business License Number");
        if (isNullOrEmpty(merchantDTO.getPhoneNumber())) missingFields.add("Phone Number");

        if (!missingFields.isEmpty()) {
            throw new IllegalArgumentException("Required fields missing: " + String.join(", ", missingFields));
        }
    }

    private boolean isNullOrEmpty(String value) {
        return value == null || value.trim().isEmpty();
    }

    @GetMapping("/all")
    public ResponseEntity<List<MerchantEntity>> getAllMerchants() {
        List<MerchantEntity> merchants = merchantAddService.getAllMerchants();
        return ResponseEntity.ok(merchants);
    }

    @GetMapping("/{merchantId}")
    public ResponseEntity<?> getMerchantById(@PathVariable String merchantId) {
        Optional<MerchantEntity> merchant = merchantAddService.getMerchantById(merchantId);

        if (merchant.isPresent()) {
            return ResponseEntity.ok(merchant.get());
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Merchant not found");

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @PutMapping("/{merchantId}/status")
    public ResponseEntity<?> updateMerchantStatus(
            @PathVariable String merchantId,
            @RequestParam String status) {
        try {
            MerchantEntity updatedMerchant = merchantAddService.updateMerchantStatus(merchantId, status);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Merchant status updated successfully");
            response.put("merchantId", updatedMerchant.getMerchantId());
            response.put("status", updatedMerchant.getStatus());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to update merchant status");
            response.put("error", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @DeleteMapping("/{merchantId}")
    public ResponseEntity<?> deleteMerchant(@PathVariable String merchantId) {
        try {
            merchantAddService.deleteMerchant(merchantId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Merchant deleted successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to delete merchant");
            response.put("error", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Endpoint to get merchant logo
    @GetMapping("/{merchantId}/logo")
    public ResponseEntity<byte[]> getMerchantLogo(@PathVariable String merchantId) {
        Optional<MerchantEntity> merchantOpt = merchantAddService.getMerchantById(merchantId);

        if (merchantOpt.isPresent() && merchantOpt.get().getLogoBase64() != null) {
            MerchantEntity merchant = merchantOpt.get();
            byte[] logoData = Base64.getDecoder().decode(merchant.getLogoBase64());
            return ResponseEntity
                    .ok()
                    .contentType(MediaType.parseMediaType(merchant.getLogoType()))
                    .body(logoData);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint to get merchant license document
    @GetMapping("/{merchantId}/license")
    public ResponseEntity<byte[]> getMerchantLicense(@PathVariable String merchantId) {
        Optional<MerchantEntity> merchantOpt = merchantAddService.getMerchantById(merchantId);

        if (merchantOpt.isPresent() && merchantOpt.get().getLicenseDocumentBase64() != null) {
            MerchantEntity merchant = merchantOpt.get();
            byte[] licenseData = Base64.getDecoder().decode(merchant.getLicenseDocumentBase64());
            return ResponseEntity
                    .ok()
                    .contentType(MediaType.parseMediaType(merchant.getLicenseDocumentType()))
                    .body(licenseData);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}