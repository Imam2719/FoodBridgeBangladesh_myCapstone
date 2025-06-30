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

@RestController
@RequestMapping("/api/admin/merchants")
public class MerchantController {

    private final MerchantAddService merchantAddService;

    @Autowired
    public MerchantController(MerchantAddService merchantAddService) {
        this.merchantAddService = merchantAddService;
    }

    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addMerchant(@ModelAttribute MerchantDTO merchantDTO) {
        try {
            // Validate required fields
            List<String> missingFields = validateMerchantDTO(merchantDTO);
            
            if (!missingFields.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Missing required fields: " + String.join(", ", missingFields));
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            MerchantEntity addedMerchant = merchantAddService.addMerchant(merchantDTO);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Merchant added successfully");
            response.put("merchantId", addedMerchant.getMerchantId());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            e.printStackTrace();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            
            // Provide more specific error messages based on the exception type
            if (e instanceof RuntimeException && e.getMessage().contains("Email already in use")) {
                response.put("message", "Email already in use");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            } else if (e instanceof RuntimeException && e.getMessage().contains("Business license number already registered")) {
                response.put("message", "Business license number already registered");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            }
            
            response.put("message", "Failed to add merchant: " + e.getMessage());
            response.put("error_type", e.getClass().getName());
            response.put("error_details", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    private List<String> validateMerchantDTO(MerchantDTO merchantDTO) {
        List<String> missingFields = new ArrayList<>();
        if (merchantDTO.getBusinessName() == null || merchantDTO.getBusinessName().trim().isEmpty())
            missingFields.add("businessName");
        if (merchantDTO.getBusinessType() == null || merchantDTO.getBusinessType().trim().isEmpty())
            missingFields.add("businessType");
        if (merchantDTO.getOwnerFirstName() == null || merchantDTO.getOwnerFirstName().trim().isEmpty())
            missingFields.add("ownerFirstName");
        if (merchantDTO.getOwnerLastName() == null || merchantDTO.getOwnerLastName().trim().isEmpty())
            missingFields.add("ownerLastName");
        if (merchantDTO.getEmail() == null || merchantDTO.getEmail().trim().isEmpty())
            missingFields.add("email");
        if (merchantDTO.getPassword() == null || merchantDTO.getPassword().trim().isEmpty())
            missingFields.add("password");
        if (merchantDTO.getPhoneNumber() == null || merchantDTO.getPhoneNumber().trim().isEmpty())
            missingFields.add("phoneNumber");
        if (merchantDTO.getBusinessLicenseNumber() == null || merchantDTO.getBusinessLicenseNumber().trim().isEmpty())
            missingFields.add("businessLicenseNumber");
        if (merchantDTO.getBusinessAddress() == null || merchantDTO.getBusinessAddress().trim().isEmpty())
            missingFields.add("businessAddress");
        if (merchantDTO.getCity() == null || merchantDTO.getCity().trim().isEmpty())
            missingFields.add("city");
        if (merchantDTO.getStateProvince() == null || merchantDTO.getStateProvince().trim().isEmpty())
            missingFields.add("stateProvince");
        if (merchantDTO.getPostalCode() == null || merchantDTO.getPostalCode().trim().isEmpty())
            missingFields.add("postalCode");
        return missingFields;
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