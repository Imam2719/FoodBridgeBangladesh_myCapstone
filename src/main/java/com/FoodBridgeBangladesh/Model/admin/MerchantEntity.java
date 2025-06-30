package com.FoodBridgeBangladesh.Model.admin;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.UUID;

@Entity
@Table(name = "merchants")
public class MerchantEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String merchantId;

    @Column(nullable = false)
    private String businessName;

    @Column(nullable = false)
    private String businessType;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String businessDescription;

    // Fee information
    @Column(nullable = false)
    private String feeType; // 'contractual' or 'percentage'

    @Column(nullable = false)
    private Double feeAmount; // Either fixed amount or percentage rate

    @Column(nullable = false)
    private String ownerFirstName;

    @Column(nullable = false)
    private String ownerLastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String phoneNumber;

    // Identification details
    private String nationalIdNumber;
    private String passportNumber;
    private String birthCertificateNumber;
    private String bloodGroup;

    // Business license details
    @Column(nullable = false)
    private String businessLicenseNumber;

    // Large file storage for base64 documents
    @Lob
    @Column(columnDefinition = "TEXT")
    private String licenseDocumentBase64;

    @Column(length = 500)
    private String licenseDocumentName;

    private String licenseDocumentType;

    // Logo storage
    @Lob
    @Column(columnDefinition = "TEXT")
    private String logoBase64;

    @Column(length = 500)
    private String logoName;

    private String logoType;

    // Alternative file path storage (optional)
    private String licenseDocumentPath;
    private String logoPath;

    // Location details
    @Column(nullable = false)
    private String businessAddress;

    @Column(nullable = false)
    private String city;

    @Column(name = "state", nullable = false)
    private String stateProvince;

    @Column(nullable = false)
    private String postalCode;

    private String businessHours;

    // Food donation details
    @Column(name = "prepared_meals", nullable = false)
    private boolean donatesPreparedMeals;

    @Column(name = "fresh_produce", nullable = false)
    private boolean donatesFreshProduce;

    @Column(name = "baked_goods", nullable = false)
    private boolean donatesBakedGoods;

    @Column(name = "canned_packaged_foods", nullable = false)
    private boolean donatesPackagedFoods;

    @Column(name = "dairy_products", nullable = false)
    private boolean donatesDairyProducts;

    // Various flags and verification fields
    @Column(name = "allow_direct_messages", nullable = false)
    private boolean allowDirectMessages;

    @Column(name = "email_verified", nullable = false)
    private boolean emailVerified;

    @Column(name = "identity_verified", nullable = false)
    private boolean identityVerified;

    @Column(name = "license_verified", nullable = false)
    private boolean licenseVerified;

    @Column(name = "display_in_public_search", nullable = false)
    private boolean displayInPublicSearch;

    @Column(name = "phone_verified", nullable = false)
    private boolean phoneVerified;

    @Column(name = "receive_notifications", nullable = false)
    private boolean receiveNotifications;

    @Column(name = "canned_foods", nullable = false)
    private boolean cannedFoods;

    private String donationFrequency;
    private String donationSize;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @Column(nullable = false)
    private LocalDateTime joined;

    // Add user_type column
    @Column(nullable = false)
    private String user_type;

    @Column(nullable = false)
    private String licenseName;

    // Constructor with comprehensive initialization
    public MerchantEntity() {
        this.merchantId = generateMerchantId();
        this.createdAt = LocalDateTime.now();
        this.status = "Pending";
        this.joined = LocalDateTime.now();

        // Set default value for user_type
        this.user_type = "merchant";

        // Default boolean values
        this.donatesPreparedMeals = false;
        this.donatesFreshProduce = false;
        this.donatesBakedGoods = false;
        this.donatesPackagedFoods = false;
        this.donatesDairyProducts = false;
        this.allowDirectMessages = false;
        this.displayInPublicSearch = true;
        this.emailVerified = false;
        this.identityVerified = false;
        this.licenseVerified = false;
        this.phoneVerified = false;
        this.receiveNotifications = true;
        this.cannedFoods = false;
        this.feeType = "contractual";
        this.feeAmount = 0.0;

        // Ensure non-null default values for file-related fields
        this.licenseDocumentBase64 = "";
        this.logoBase64 = "";
        this.licenseDocumentName = "Trade License";
    }

    // Utility method to generate unique merchant ID
    private String generateMerchantId() {
        return "MER" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }

    // Comprehensive setter for license document with size validation
    public void setLicenseDocumentBase64(String base64) {
        if (base64 != null) {
            // Truncate if exceeds 1MB (adjust as needed)
            this.licenseDocumentBase64 = base64.length() > 1_000_000
                    ? base64.substring(0, 1_000_000)
                    : base64;
        } else {
            this.licenseDocumentBase64 = "";
        }
    }

    // Comprehensive setter for logo with size validation
    public void setLogoBase64(String base64) {
        if (base64 != null) {
            // Truncate if exceeds 1MB (adjust as needed)
            this.logoBase64 = base64.length() > 1_000_000
                    ? base64.substring(0, 1_000_000)
                    : base64;
        } else {
            this.logoBase64 = "";
        }
    }

    // Getter and setter for user_type
    public String getUserType() {
        return user_type;
    }

    public void setUserType(String user_type) {
        this.user_type = user_type;
    }

    public String getNationalIdNumber() {
        return nationalIdNumber;
    }

    public void setNationalIdNumber(String nationalIdNumber) {
        this.nationalIdNumber = nationalIdNumber;
    }

    public String getMerchantId() {
        return merchantId;
    }

    public void setMerchantId(String merchantId) {
        this.merchantId = merchantId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public String getBusinessType() {
        return businessType;
    }

    public void setBusinessType(String businessType) {
        this.businessType = businessType;
    }

    public String getBusinessDescription() {
        return businessDescription;
    }

    public void setBusinessDescription(String businessDescription) {
        this.businessDescription = businessDescription;
    }

    public String getOwnerFirstName() {
        return ownerFirstName;
    }

    public void setOwnerFirstName(String ownerFirstName) {
        this.ownerFirstName = ownerFirstName;
    }

    public String getOwnerLastName() {
        return ownerLastName;
    }

    public void setOwnerLastName(String ownerLastName) {
        this.ownerLastName = ownerLastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPassportNumber() {
        return passportNumber;
    }

    public void setPassportNumber(String passportNumber) {
        this.passportNumber = passportNumber;
    }

    public String getBirthCertificateNumber() {
        return birthCertificateNumber;
    }

    public void setBirthCertificateNumber(String birthCertificateNumber) {
        this.birthCertificateNumber = birthCertificateNumber;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public String getBusinessLicenseNumber() {
        return businessLicenseNumber;
    }

    public void setBusinessLicenseNumber(String businessLicenseNumber) {
        this.businessLicenseNumber = businessLicenseNumber;
    }

    public String getLicenseDocumentBase64() {
        return licenseDocumentBase64;
    }

    public String getLicenseDocumentName() {
        return licenseDocumentName;
    }

    public void setLicenseDocumentName(String licenseDocumentName) {
        this.licenseDocumentName = licenseDocumentName;
    }

    public String getLicenseDocumentType() {
        return licenseDocumentType;
    }

    public void setLicenseDocumentType(String licenseDocumentType) {
        this.licenseDocumentType = licenseDocumentType;
    }

    public String getLogoBase64() {
        return logoBase64;
    }

    public String getLogoName() {
        return logoName;
    }

    public void setLogoName(String logoName) {
        this.logoName = logoName;
    }

    public String getLogoType() {
        return logoType;
    }

    public void setLogoType(String logoType) {
        this.logoType = logoType;
    }

    public String getLicenseDocumentPath() {
        return licenseDocumentPath;
    }

    public void setLicenseDocumentPath(String licenseDocumentPath) {
        this.licenseDocumentPath = licenseDocumentPath;
    }

    public String getLogoPath() {
        return logoPath;
    }

    public void setLogoPath(String logoPath) {
        this.logoPath = logoPath;
    }

    public String getBusinessAddress() {
        return businessAddress;
    }

    public void setBusinessAddress(String businessAddress) {
        this.businessAddress = businessAddress;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getStateProvince() {
        return stateProvince;
    }

    public void setStateProvince(String stateProvince) {
        this.stateProvince = stateProvince;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getBusinessHours() {
        return businessHours;
    }

    public void setBusinessHours(String businessHours) {
        this.businessHours = businessHours;
    }

    public boolean isDonatesPreparedMeals() {
        return donatesPreparedMeals;
    }

    public void setDonatesPreparedMeals(boolean donatesPreparedMeals) {
        this.donatesPreparedMeals = donatesPreparedMeals;
    }

    public boolean isDonatesFreshProduce() {
        return donatesFreshProduce;
    }

    public void setDonatesFreshProduce(boolean donatesFreshProduce) {
        this.donatesFreshProduce = donatesFreshProduce;
    }

    public boolean isDonatesBakedGoods() {
        return donatesBakedGoods;
    }

    public void setDonatesBakedGoods(boolean donatesBakedGoods) {
        this.donatesBakedGoods = donatesBakedGoods;
    }

    public boolean isDonatesPackagedFoods() {
        return donatesPackagedFoods;
    }

    public void setDonatesPackagedFoods(boolean donatesPackagedFoods) {
        this.donatesPackagedFoods = donatesPackagedFoods;
    }

    public boolean isDonatesDairyProducts() {
        return donatesDairyProducts;
    }

    public void setDonatesDairyProducts(boolean donatesDairyProducts) {
        this.donatesDairyProducts = donatesDairyProducts;
    }

    public boolean isAllowDirectMessages() {
        return allowDirectMessages;
    }

    public void setAllowDirectMessages(boolean allowDirectMessages) {
        this.allowDirectMessages = allowDirectMessages;
    }

    public boolean isEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public boolean isIdentityVerified() {
        return identityVerified;
    }

    public void setIdentityVerified(boolean identityVerified) {
        this.identityVerified = identityVerified;
    }

    public boolean isLicenseVerified() {
        return licenseVerified;
    }

    public void setLicenseVerified(boolean licenseVerified) {
        this.licenseVerified = licenseVerified;
    }

    public boolean isDisplayInPublicSearch() {
        return displayInPublicSearch;
    }

    public void setDisplayInPublicSearch(boolean displayInPublicSearch) {
        this.displayInPublicSearch = displayInPublicSearch;
    }

    public boolean isPhoneVerified() {
        return phoneVerified;
    }

    public void setPhoneVerified(boolean phoneVerified) {
        this.phoneVerified = phoneVerified;
    }

    public boolean isReceiveNotifications() {
        return receiveNotifications;
    }

    public void setReceiveNotifications(boolean receiveNotifications) {
        this.receiveNotifications = receiveNotifications;
    }

    public boolean isCannedFoods() {
        return cannedFoods;
    }

    public void setCannedFoods(boolean cannedFoods) {
        this.cannedFoods = cannedFoods;
    }

    public String getDonationFrequency() {
        return donationFrequency;
    }

    public void setDonationFrequency(String donationFrequency) {
        this.donationFrequency = donationFrequency;
    }

    public String getDonationSize() {
        return donationSize;
    }

    public void setDonationSize(String donationSize) {
        this.donationSize = donationSize;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getJoined() {
        return joined;
    }

    public void setJoined(LocalDateTime joined) {
        this.joined = joined;
    }

    public String getLicenseName() {
        return licenseName;
    }

    public void setLicenseName(String licenseName) {
        this.licenseName = licenseName;
    }

    public String getFeeType() {
        return feeType;
    }

    public void setFeeType(String feeType) {
        this.feeType = feeType;
    }

    public Double getFeeAmount() {
        return feeAmount;
    }

    public void setFeeAmount(Double feeAmount) {
        this.feeAmount = feeAmount;
    }


}