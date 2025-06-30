package com.FoodBridgeBangladesh.Service.donor;

import com.FoodBridgeBangladesh.Model.donor.Donation;
import com.FoodBridgeBangladesh.Model.dto.DonationFormDTO;
import com.FoodBridgeBangladesh.Model.merchant.FoodItem;
import com.FoodBridgeBangladesh.Repository.donor.DonationRepository;
import com.FoodBridgeBangladesh.Repository.merchant.FoodItemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class DonationService {

    private static final Logger logger = LoggerFactory.getLogger(DonationService.class);

    private final DonationRepository donationRepository;
    private final FoodItemRepository foodItemRepository;

    @Autowired
    public DonationService(DonationRepository donationRepository, FoodItemRepository foodItemRepository) {
        this.donationRepository = donationRepository;
        this.foodItemRepository = foodItemRepository;
    }

    /**
     * Create a new donation from a merchant food item
     */
    /**
     * Create a new donation with enhanced image handling
     */
    @Transactional
    public Donation createDonation(DonationFormDTO donationForm, MultipartFile imageFile, FoodItem originalFoodItem) throws IOException {
        logger.info("Creating new donation with enhanced image handling");

        Donation donation = new Donation();

        // Set basic information
        donation.setFoodName(donationForm.getFoodName());
        donation.setDescription(donationForm.getDescription());

        // Set category
        try {
            donation.setCategory(Donation.DonationCategory.valueOf(donationForm.getCategory()));
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid donation category: {}", donationForm.getCategory());
            throw new IllegalArgumentException("Invalid donation category: " + donationForm.getCategory());
        }

        donation.setQuantity(donationForm.getQuantity());

        try {
            donation.setExpiryDate(LocalDate.parse(donationForm.getExpiryDate()));
        } catch (Exception e) {
            logger.warn("Invalid expiry date format: {}", donationForm.getExpiryDate());
            throw new IllegalArgumentException("Invalid expiry date format. Use YYYY-MM-DD");
        }

        donation.setLocation(donationForm.getLocation());
        donation.setDonorType(donationForm.getDonorType());

        if (donationForm.getPreparationDate() != null && !donationForm.getPreparationDate().isEmpty()) {
            try {
                donation.setPreparationDate(LocalDate.parse(donationForm.getPreparationDate()));
            } catch (Exception e) {
                logger.warn("Invalid preparation date format: {}", donationForm.getPreparationDate());
                throw new IllegalArgumentException("Invalid preparation date format. Use YYYY-MM-DD");
            }
        }

        if (donationForm.getDietaryInfo() != null) {
            donation.setDietaryInfo(new ArrayList<>(donationForm.getDietaryInfo()));
        }

        donation.setPackaging(donationForm.getPackaging());
        donation.setStorageInstructions(donationForm.getStorageInstructions());

        // Set category-specific fields
        if (donation.getCategory() == Donation.DonationCategory.RESTAURANT_SURPLUS) {
            donation.setCuisineType(donationForm.getCuisineType());

            if (donationForm.getServedTime() != null && !donationForm.getServedTime().isEmpty()) {
                try {
                    donation.setServedTime(LocalTime.parse(donationForm.getServedTime()));
                } catch (Exception e) {
                    logger.warn("Invalid served time format: {}", donationForm.getServedTime());
                    throw new IllegalArgumentException("Invalid served time format. Use HH:MM");
                }
            }

            donation.setTemperatureRequirements(donationForm.getTemperatureRequirements());
            donation.setCorporateName(donationForm.getCorporateName()); // Restaurant name
        } else if (donation.getCategory() == Donation.DonationCategory.HOMEMADE_FOOD) {
            donation.setIngredients(donationForm.getIngredients());
            donation.setServingSize(donationForm.getServingSize());
        } else if (donation.getCategory() == Donation.DonationCategory.CORPORATE_DONATION ||
                donation.getCategory() == Donation.DonationCategory.EVENT_LEFTOVER) {
            donation.setEventName(donationForm.getEventName());
            donation.setCorporateName(donationForm.getCorporateName());
            donation.setContactPerson(donationForm.getContactPerson());
        } else if (donation.getCategory() == Donation.DonationCategory.GROCERY_EXCESS) {
            donation.setProductType(donationForm.getProductType());
            donation.setBrandName(donationForm.getBrandName());

            if (donationForm.getBestBeforeDate() != null && !donationForm.getBestBeforeDate().isEmpty()) {
                try {
                    donation.setBestBeforeDate(LocalDate.parse(donationForm.getBestBeforeDate()));
                } catch (Exception e) {
                    logger.warn("Invalid best before date format: {}", donationForm.getBestBeforeDate());
                    throw new IllegalArgumentException("Invalid best before date format. Use YYYY-MM-DD");
                }
            }
            donation.setCorporateName(donationForm.getCorporateName()); // Store name
        }

        // Set status and donor ID
        donation.setStatus("Active");
        donation.setDonorId(donationForm.getDonorId());

        // Add donor role if provided
        if (donationForm.getDonorRole() != null) {
            donation.setDonorRole(donationForm.getDonorRole());
        }

        donation.setCreatedAt(LocalDate.now());

        // Set original food item ID if provided
        if (donationForm.getOriginalFoodItemId() != null) {
            donation.setOriginalFoodItemId(donationForm.getOriginalFoodItemId());
        } else if (originalFoodItem != null) {
            donation.setOriginalFoodItemId(originalFoodItem.getId());
        }

        // Store name from the original food item if it exists
        if (originalFoodItem != null && originalFoodItem.getStoreName() != null) {
            donation.setStoreName(originalFoodItem.getStoreName());
        }

        // Enhanced image handling with detailed logging
        logger.info("Starting image processing for donation");

        if (imageFile != null && !imageFile.isEmpty()) {
            // Process the new image file
            logger.info("Processing uploaded image file: {} ({}), size: {} bytes",
                    imageFile.getOriginalFilename(),
                    imageFile.getContentType(),
                    imageFile.getSize());

            byte[] imageBytes = imageFile.getBytes();
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            donation.setImageData(base64Image);
            donation.setImageContentType(imageFile.getContentType());

            logger.info("Using uploaded image for donation: {} bytes encoded to {} chars Base64",
                    imageBytes.length,
                    base64Image.length());
        } else if (originalFoodItem != null && originalFoodItem.getImageData() != null) {
            // Prioritize using the original food item's image data directly
            logger.info("Original food item image data present - length: {}, content type: {}",
                    originalFoodItem.getImageData().length(),
                    originalFoodItem.getImageContentType());

            donation.setImageData(originalFoodItem.getImageData());

            if (originalFoodItem.getImageContentType() != null) {
                donation.setImageContentType(originalFoodItem.getImageContentType());
            } else {
                donation.setImageContentType("image/jpeg"); // Default if content type missing
                logger.info("Using default content type (image/jpeg) as original food item's content type is missing");
            }

            logger.info("Successfully used original food item image for donation");
        } else if (donationForm.getImageBase64() != null && !donationForm.getImageBase64().isEmpty()) {
            // Fallback to form data if available
            logger.info("Using image from form data - length: {} chars", donationForm.getImageBase64().length());

            donation.setImageData(donationForm.getImageBase64());

            // Need to set content type here as well
            if (donationForm.getImageContentType() != null && !donationForm.getImageContentType().isEmpty()) {
                donation.setImageContentType(donationForm.getImageContentType());
                logger.info("Using content type from form data: {}", donationForm.getImageContentType());
            } else {
                donation.setImageContentType("image/jpeg"); // Default
                logger.info("Using default content type (image/jpeg) as form data content type is missing");
            }
        } else {
            logger.warn("No image data available for donation from any source");
        }

        // Log final image status before saving
        logger.info("Final donation image status - has data: {}, content type: {}",
                donation.getImageData() != null && !donation.getImageData().isEmpty(),
                donation.getImageContentType());

        // Save the donation with explicit transaction management
        Donation savedDonation = donationRepository.save(donation);

        // Verify saved image data
        logger.info("Donation saved with ID: {}. Image data saved: {}",
                savedDonation.getId(),
                savedDonation.getImageData() != null && !savedDonation.getImageData().isEmpty());

        return savedDonation;
    }

    /**
     * Create a new donation from form data
     */
    @Transactional
    public Donation createDonation(DonationFormDTO donationForm, MultipartFile imageFile) throws IOException {
        logger.info("Creating new donation from form data");

        Donation donation = new Donation();

        // Set basic information
        donation.setFoodName(donationForm.getFoodName());
        donation.setDescription(donationForm.getDescription());

        // Set category
        try {
            donation.setCategory(Donation.DonationCategory.valueOf(donationForm.getCategory()));
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid donation category: {}", donationForm.getCategory());
            throw new IllegalArgumentException("Invalid donation category: " + donationForm.getCategory());
        }

        donation.setQuantity(donationForm.getQuantity());

        try {
            donation.setExpiryDate(LocalDate.parse(donationForm.getExpiryDate()));
        } catch (Exception e) {
            logger.warn("Invalid expiry date format: {}", donationForm.getExpiryDate());
            throw new IllegalArgumentException("Invalid expiry date format. Use YYYY-MM-DD");
        }

        donation.setLocation(donationForm.getLocation());
        donation.setDonorType(donationForm.getDonorType());

        if (donationForm.getPreparationDate() != null && !donationForm.getPreparationDate().isEmpty()) {
            try {
                donation.setPreparationDate(LocalDate.parse(donationForm.getPreparationDate()));
            } catch (Exception e) {
                logger.warn("Invalid preparation date format: {}", donationForm.getPreparationDate());
                throw new IllegalArgumentException("Invalid preparation date format. Use YYYY-MM-DD");
            }
        }

        if (donationForm.getDietaryInfo() != null) {
            donation.setDietaryInfo(new ArrayList<>(donationForm.getDietaryInfo()));
        }

        donation.setPackaging(donationForm.getPackaging());
        donation.setStorageInstructions(donationForm.getStorageInstructions());

        // Set category-specific fields
        if (donation.getCategory() == Donation.DonationCategory.RESTAURANT_SURPLUS) {
            donation.setCuisineType(donationForm.getCuisineType());

            if (donationForm.getServedTime() != null && !donationForm.getServedTime().isEmpty()) {
                try {
                    donation.setServedTime(LocalTime.parse(donationForm.getServedTime()));
                } catch (Exception e) {
                    logger.warn("Invalid served time format: {}", donationForm.getServedTime());
                    throw new IllegalArgumentException("Invalid served time format. Use HH:MM");
                }
            }

            donation.setTemperatureRequirements(donationForm.getTemperatureRequirements());
            donation.setCorporateName(donationForm.getCorporateName()); // Restaurant name
        } else if (donation.getCategory() == Donation.DonationCategory.HOMEMADE_FOOD) {
            donation.setIngredients(donationForm.getIngredients());
            donation.setServingSize(donationForm.getServingSize());
        } else if (donation.getCategory() == Donation.DonationCategory.CORPORATE_DONATION ||
                donation.getCategory() == Donation.DonationCategory.EVENT_LEFTOVER) {
            donation.setEventName(donationForm.getEventName());
            donation.setCorporateName(donationForm.getCorporateName());
            donation.setContactPerson(donationForm.getContactPerson());
        } else if (donation.getCategory() == Donation.DonationCategory.GROCERY_EXCESS) {
            donation.setProductType(donationForm.getProductType());
            donation.setBrandName(donationForm.getBrandName());

            if (donationForm.getBestBeforeDate() != null && !donationForm.getBestBeforeDate().isEmpty()) {
                try {
                    donation.setBestBeforeDate(LocalDate.parse(donationForm.getBestBeforeDate()));
                } catch (Exception e) {
                    logger.warn("Invalid best before date format: {}", donationForm.getBestBeforeDate());
                    throw new IllegalArgumentException("Invalid best before date format. Use YYYY-MM-DD");
                }
            }
            donation.setCorporateName(donationForm.getCorporateName()); // Store name
        }

        // Set status and donor ID
        donation.setStatus("Active");
        donation.setDonorId(donationForm.getDonorId());

        // Add donor role if provided
        if (donationForm.getDonorRole() != null) {
            donation.setDonorRole(donationForm.getDonorRole());
        }

        donation.setCreatedAt(LocalDate.now());

        // Set original food item ID if provided
        if (donationForm.getOriginalFoodItemId() != null) {
            donation.setOriginalFoodItemId(donationForm.getOriginalFoodItemId());
        }

        // Process and set image
        if (imageFile != null && !imageFile.isEmpty()) {
            byte[] imageBytes = imageFile.getBytes();
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            donation.setImageData(base64Image);
            donation.setImageContentType(imageFile.getContentType());
        } else if (donationForm.getImageBase64() != null && !donationForm.getImageBase64().isEmpty()) {
            // Use the image from the form if no new image is uploaded
            donation.setImageData(donationForm.getImageBase64());
        }

        // Save the donation
        return donationRepository.save(donation);
    }

    /**
     * Get active donations for a donor
     */
    @Transactional(readOnly = true)
    public List<Donation> getActiveDonations(Long donorId) {
        logger.info("Getting active donations for donor ID: {}", donorId);

        if (donorId == null) {
            throw new IllegalArgumentException("Donor ID cannot be null");
        }

        // Get donations that are not deleted
        List<Donation> donations = donationRepository.findByDonorIdAndStatusNot(donorId, "DELETED");

        // Filter out donations with quantity <= 0
        List<Donation> filteredDonations = donations.stream()
                .filter(donation -> {
                    // Only include donations with quantity > 0
                    try {
                        String quantityStr = donation.getQuantity();
                        if (quantityStr == null || quantityStr.isEmpty()) {
                            return false;
                        }

                        // Extract numeric part from quantity string (e.g. "5 meals" -> 5)
                        String numericPart = quantityStr.replaceAll("[^0-9]", "");
                        if (numericPart.isEmpty()) {
                            return false;
                        }

                        int quantity = Integer.parseInt(numericPart);
                        return quantity > 0;
                    } catch (NumberFormatException e) {
                        // If we can't parse the quantity, exclude it
                        logger.warn("Could not parse quantity for donation ID {}: {}",
                                donation.getId(), donation.getQuantity());
                        return false;
                    }
                })
                .collect(Collectors.toList());

        // Force loading of LOB data while within the transaction
        filteredDonations.forEach(donation -> {
            // Simply access the image data to ensure it's loaded
            if (donation.getImageData() != null) {
                donation.getImageData().length();
            }
        });

        return filteredDonations;
    }
    /**
     * Get pending donations for a donor
     */
    @Transactional(readOnly = true)
    public List<Donation> getPendingDonations(Long donorId) {
        logger.info("Getting pending donations for donor ID: {}", donorId);

        if (donorId == null) {
            throw new IllegalArgumentException("Donor ID cannot be null");
        }

        List<Donation> donations = donationRepository.findByDonorIdAndStatus(donorId, "Pending");

        // Force loading of LOB data while within the transaction
        donations.forEach(donation -> {
            // Simply access the image data to ensure it's loaded
            if (donation.getImageData() != null) {
                donation.getImageData().length();
            }
        });

        return donations;
    }

    /**
     * Get completed donations for a donor
     */
    @Transactional(readOnly = true)
    public List<Donation> getCompletedDonations(Long donorId) {
        logger.info("Fetching completed donations for donor ID: {}", donorId);

        if (donorId == null) {
            throw new IllegalArgumentException("Donor ID cannot be null");
        }

        // Explicitly find donations with 'Completed' status
        List<Donation> completedDonations = donationRepository.findByDonorIdAndStatus(donorId, "Completed");

        // Optional: Eager loading of image data
        completedDonations.forEach(donation -> {
            if (donation.getImageData() != null) {
                donation.getImageData().length(); // Force lazy loading
            }
        });

        return completedDonations;
    }

    /**
     * Get donation by ID
     */
    public Donation getDonationById(Long id) {
        logger.info("Getting donation with ID: {}", id);
        return donationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donation not found with ID: " + id));
    }

    /**
     * Get donation by ID with owner verification
     */
    public Donation getDonationById(Long id, Long donorId) {
        logger.info("Getting donation with ID: {} for donor ID: {}", id, donorId);
        Donation donation = getDonationById(id);

        // Verify ownership
        if (!donation.getDonorId().equals(donorId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have permission to access this donation");
        }

        return donation;
    }

    /**
     * Find nearby donations using location string parsing and Haversine formula
     * @param latitude User's latitude
     * @param longitude User's longitude
     * @param radius Search radius in kilometers
     * @return List of nearby active donations
     */
    public List<Donation> findNearbyDonations(double latitude, double longitude, double radius) {
        logger.info("Finding nearby donations at lat: {}, long: {}, radius: {} km", latitude, longitude, radius);

        // Get all active donations
        List<Donation> activeDonations = donationRepository.findByStatusOrderByCreatedAtDesc("Active");

        // Filter donations by calculating distance
        return activeDonations.stream()
                .filter(donation -> {
                    // Try to extract coordinates from location string
                    double[] coordinates = extractCoordinates(donation.getLocation());
                    if (coordinates == null) {
                        return false; // Skip if we can't parse coordinates
                    }

                    // Calculate distance using Haversine formula
                    double distance = calculateDistance(
                            latitude, longitude,
                            coordinates[0], coordinates[1]);

                    // Return true if within radius
                    return distance <= radius;
                })
                .collect(Collectors.toList());
    }

    private double[] extractCoordinates(String locationString) {
        if (locationString == null || locationString.isEmpty()) {
            return null;
        }

        try {
            // Try to match common coordinate patterns
            Pattern pattern = Pattern.compile("\\b(-?\\d+\\.?\\d*)\\s*,?\\s*(-?\\d+\\.?\\d*)\\b");
            Matcher matcher = pattern.matcher(locationString);

            if (matcher.find()) {
                double lat = Double.parseDouble(matcher.group(1));
                double lng = Double.parseDouble(matcher.group(2));

                // Basic validation of coordinates
                if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
                    return new double[] { lat, lng };
                }
            }

            // Could extend with more patterns if needed

            return null;
        } catch (Exception e) {
            logger.warn("Failed to extract coordinates from location: {}", locationString);
            return null;
        }
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        // Radius of earth in kilometers
        final double R = 6371;

        // Convert degrees to radians
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        // Haversine formula
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    /**
     * Update donation status
     */
    @Transactional
    public Donation updateDonationStatus(Long id, String status) {
        logger.info("Updating donation status for ID: {} to {}", id, status);

        Donation donation = getDonationById(id);
        donation.setStatus(status);

        return donationRepository.save(donation);
    }

    /**
     * Update donation status with owner verification
     */
    @Transactional
    public Donation updateDonationStatus(Long id, String status, Long donorId) {
        logger.info("Updating donation status for ID: {} to {} by donor ID: {}", id, status, donorId);

        Donation donation = getDonationById(id, donorId);
        donation.setStatus(status);

        return donationRepository.save(donation);
    }

    /**
     * Update donation status to Pending when a request is accepted
     */
    @Transactional
    public Donation updateDonationToPending(Long id, Long donorId) {
        logger.info("Updating donation status to Pending for ID: {} by donor ID: {}", id, donorId);

        // Verify ownership before status update
        Donation donation = getDonationById(id, donorId);

        // Only update if the donation is currently Active
        if (!"Active".equals(donation.getStatus())) {
            throw new IllegalStateException("Only Active donations can be changed to Pending status");
        }

        // Set status to Pending
        donation.setStatus("Pending");

        return donationRepository.save(donation);
    }

    /**
     * Update donation status to Completed when donor marks it as done
     */
    @Transactional
    public Donation markDonationAsCompleted(Long id, Long donorId) {
        logger.info("Marking donation as completed for ID: {} by donor ID: {}", id, donorId);

        // Verify ownership before status update
        Donation donation = getDonationById(id, donorId);

        // Only update if the donation is currently Pending
        if (!"Pending".equals(donation.getStatus())) {
            throw new IllegalStateException("Only Pending donations can be marked as Completed. Current status: " + donation.getStatus());
        }

        // Set status to Completed
        donation.setStatus("Completed");

        return donationRepository.save(donation);
    }

    /**
     * Update donation with owner verification
     */
    @Transactional
    public Donation updateDonation(Long id, DonationFormDTO formDTO, MultipartFile imageFile, Long donorId)
            throws IOException {
        logger.info("Updating donation with ID: {} for donor ID: {}", id, donorId);

        // Get existing donation and verify ownership
        Donation donation = getDonationById(id, donorId);

        // Update basic information if provided
        if (formDTO.getFoodName() != null) {
            donation.setFoodName(formDTO.getFoodName());
        }

        if (formDTO.getDescription() != null) {
            donation.setDescription(formDTO.getDescription());
        }

        if (formDTO.getQuantity() != null) {
            donation.setQuantity(formDTO.getQuantity());
        }

        if (formDTO.getExpiryDate() != null && !formDTO.getExpiryDate().isEmpty()) {
            try {
                donation.setExpiryDate(LocalDate.parse(formDTO.getExpiryDate()));
            } catch (Exception e) {
                logger.warn("Invalid expiry date format: {}", formDTO.getExpiryDate());
                throw new IllegalArgumentException("Invalid expiry date format. Use YYYY-MM-DD");
            }
        }

        if (formDTO.getLocation() != null) {
            donation.setLocation(formDTO.getLocation());
        }

        if (formDTO.getDonorType() != null) {
            donation.setDonorType(formDTO.getDonorType());
        }

        if (formDTO.getPreparationDate() != null && !formDTO.getPreparationDate().isEmpty()) {
            try {
                donation.setPreparationDate(LocalDate.parse(formDTO.getPreparationDate()));
            } catch (Exception e) {
                logger.warn("Invalid preparation date format: {}", formDTO.getPreparationDate());
                throw new IllegalArgumentException("Invalid preparation date format. Use YYYY-MM-DD");
            }
        }

        if (formDTO.getDietaryInfo() != null) {
            donation.setDietaryInfo(formDTO.getDietaryInfo());
        }

        if (formDTO.getPackaging() != null) {
            donation.setPackaging(formDTO.getPackaging());
        }

        if (formDTO.getStorageInstructions() != null) {
            donation.setStorageInstructions(formDTO.getStorageInstructions());
        }

        // Add category update handling
        if (formDTO.getCategory() != null && !formDTO.getCategory().isEmpty()) {
            try {
                donation.setCategory(Donation.DonationCategory.valueOf(formDTO.getCategory()));
            } catch (IllegalArgumentException e) {
                logger.warn("Invalid donation category: {}", formDTO.getCategory());
                throw new IllegalArgumentException("Invalid donation category: " + formDTO.getCategory());
            }
        }

        // Update category-specific fields based on donation category
        Donation.DonationCategory category = donation.getCategory();

        if (category == Donation.DonationCategory.RESTAURANT_SURPLUS) {
            if (formDTO.getCuisineType() != null) {
                donation.setCuisineType(formDTO.getCuisineType());
            }

            if (formDTO.getServedTime() != null && !formDTO.getServedTime().isEmpty()) {
                try {
                    donation.setServedTime(LocalTime.parse(formDTO.getServedTime()));
                } catch (Exception e) {
                    logger.warn("Invalid served time format: {}", formDTO.getServedTime());
                    throw new IllegalArgumentException("Invalid served time format. Use HH:MM");
                }
            }

            if (formDTO.getTemperatureRequirements() != null) {
                donation.setTemperatureRequirements(formDTO.getTemperatureRequirements());
            }

            if (formDTO.getCorporateName() != null) {
                donation.setCorporateName(formDTO.getCorporateName());
            }
        } else if (category == Donation.DonationCategory.HOMEMADE_FOOD) {
            if (formDTO.getIngredients() != null) {
                donation.setIngredients(formDTO.getIngredients());
            }

            if (formDTO.getServingSize() != null) {
                donation.setServingSize(formDTO.getServingSize());
            }
        } else if (category == Donation.DonationCategory.CORPORATE_DONATION ||
                category == Donation.DonationCategory.EVENT_LEFTOVER) {
            if (formDTO.getEventName() != null) {
                donation.setEventName(formDTO.getEventName());
            }

            if (formDTO.getCorporateName() != null) {
                donation.setCorporateName(formDTO.getCorporateName());
            }

            if (formDTO.getContactPerson() != null) {
                donation.setContactPerson(formDTO.getContactPerson());
            }
        } else if (category == Donation.DonationCategory.GROCERY_EXCESS) {
            if (formDTO.getProductType() != null) {
                donation.setProductType(formDTO.getProductType());
            }

            if (formDTO.getBrandName() != null) {
                donation.setBrandName(formDTO.getBrandName());
            }

            if (formDTO.getBestBeforeDate() != null && !formDTO.getBestBeforeDate().isEmpty()) {
                try {
                    donation.setBestBeforeDate(LocalDate.parse(formDTO.getBestBeforeDate()));
                } catch (Exception e) {
                    logger.warn("Invalid best before date format: {}", formDTO.getBestBeforeDate());
                    throw new IllegalArgumentException("Invalid best before date format. Use YYYY-MM-DD");
                }
            }

            if (formDTO.getCorporateName() != null) {
                donation.setCorporateName(formDTO.getCorporateName());
            }
        }

        // Process and update image if provided
        if (imageFile != null && !imageFile.isEmpty()) {
            byte[] imageBytes = imageFile.getBytes();
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            donation.setImageData(base64Image);
            donation.setImageContentType(imageFile.getContentType());
        }

        // Save and return the updated donation
        return donationRepository.save(donation);
    }
    /**
     * Delete a donation
     */
    @Transactional
    public void deleteDonation(Long id) {
        logger.info("Deleting donation with ID: {}", id);

        if (!donationRepository.existsById(id)) {
            throw new RuntimeException("Donation not found with ID: " + id);
        }

        donationRepository.deleteById(id);
    }

    /**
     * Delete a donation with owner verification
     */
    @Transactional
    public void deleteDonation(Long id, Long donorId) {
        logger.info("Permanently deleting donation with ID: {} by donor ID: {}", id, donorId);

        // Verify ownership before deletion
        Donation donation = getDonationById(id, donorId);

        try {
            // Perform actual deletion from the database
            donationRepository.deleteById(id);
            logger.info("Donation permanently deleted with ID: {}", id);
        } catch (Exception e) {
            logger.error("Error permanently deleting donation: {}", e.getMessage());
            throw new RuntimeException("Cannot delete donation from database", e);
        }
    }
    /**
     * Check if a user owns a donation
     */
    public boolean isDonationOwner(Long donationId, Long donorId) {
        logger.info("Checking ownership of donation ID: {} for donor ID: {}", donationId, donorId);

        Donation donation = getDonationById(donationId);
        return donation.getDonorId().equals(donorId);
    }

    public List<Donation> findAll() {
        return donationRepository.findAll();
    }

    public List<Donation> findByStatusOrderByCreatedAtDesc(String status) {
        return donationRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    public Page<Donation> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable) {
        return donationRepository.findByStatusOrderByCreatedAtDesc(status, pageable);
    }

    @Transactional(readOnly = true)
    public Donation getDonationByIdForMerchant(Long id, Long merchantId) {
        logger.info("Getting donation with ID: {} for merchant ID: {}", id, merchantId);
        Donation donation = getDonationById(id);

        // Verify merchant ownership (similar to donor ownership check)
        if (!donation.getDonorId().equals(merchantId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "You do not have permission to access this donation");
        }

        return donation;
    }
}