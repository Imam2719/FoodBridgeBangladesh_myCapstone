// MerchantDTO.java
package com.FoodBridgeBangladesh.Model.admin.dto;

import org.springframework.web.multipart.MultipartFile;

public class MerchantDTO {
    // Business information
    private String businessName;
    private String businessType;
    private String businessDescription;
    private MultipartFile logo;
    // Fee information
    private String feeType;
    private Double feeAmount;

    // Owner/Manager information
    private String ownerFirstName;
    private String ownerLastName;
    private String email;
    private String password;
    private String phoneNumber;

    // Identification details
    private String nationalIdNumber;
    private String passportNumber;
    private String birthCertificateNumber;
    private String bloodGroup;

    // Business licenses & certifications
    private String businessLicenseNumber;
    private MultipartFile licenseDocument;

    // Business location
    private String businessAddress;
    private String city;
    private String stateProvince;
    private String postalCode;
    private String businessHours;

    // Food donation information
    private boolean donatesPreparedMeals;
    private boolean donatesFreshProduce;
    private boolean donatesBakedGoods;
    private boolean donatesPackagedFoods;
    private boolean donatesDairyProducts;
    private String donationFrequency;
    private String donationSize;

    // User type (always set to "merchant" in service layer)
    private String user_type;

    // Getters and Setters
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

    public MultipartFile getLogo() {
        return logo;
    }

    public void setLogo(MultipartFile logo) {
        this.logo = logo;
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

    public String getNationalIdNumber() {
        return nationalIdNumber;
    }

    public void setNationalIdNumber(String nationalIdNumber) {
        this.nationalIdNumber = nationalIdNumber;
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

    public MultipartFile getLicenseDocument() {
        return licenseDocument;
    }

    public void setLicenseDocument(MultipartFile licenseDocument) {
        this.licenseDocument = licenseDocument;
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

    public String getUserType() {
        return user_type;
    }

    public void setUserType(String user_type) {
        this.user_type = user_type;
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