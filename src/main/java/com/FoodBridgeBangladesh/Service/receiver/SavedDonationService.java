package com.FoodBridgeBangladesh.Service.receiver;

import com.FoodBridgeBangladesh.Model.donor.Donation;
import com.FoodBridgeBangladesh.Model.dto.SavedDonationDTO;
import com.FoodBridgeBangladesh.Model.receiver.SavedDonation;
import com.FoodBridgeBangladesh.Repository.donor.DonationRepository;
import com.FoodBridgeBangladesh.Repository.receiver.SavedDonationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SavedDonationService {

    private static final Logger logger = LoggerFactory.getLogger(SavedDonationService.class);

    @Autowired
    private SavedDonationRepository savedDonationRepository;

    @Autowired
    private DonationRepository donationRepository;

    /**
     * Save a donation for a user
     */
    @Transactional
    public SavedDonation saveDonation(Long userId, Long donationId) {
        logger.info("Saving donation {} for user {}", donationId, userId);

        // Check if donation exists and is active
        Optional<Donation> donationOpt = donationRepository.findById(donationId);
        if (donationOpt.isEmpty()) {
            throw new RuntimeException("Donation not found with ID: " + donationId);
        }

        Donation donation = donationOpt.get();
        if (!"Active".equals(donation.getStatus())) {
            throw new RuntimeException("Cannot save inactive donation");
        }

        // Check if already saved
        if (savedDonationRepository.existsByUserIdAndDonationId(userId, donationId)) {
            throw new RuntimeException("Donation already saved by this user");
        }

        // Create saved donation record
        SavedDonation savedDonation = new SavedDonation(userId, donationId);

        // Populate denormalized fields for quick access
        savedDonation.setFoodName(donation.getFoodName());
        savedDonation.setFoodCategory(donation.getCategory() != null ? donation.getCategory().getLabel() : null);
        savedDonation.setLocation(donation.getLocation());
        savedDonation.setExpiryDate(donation.getExpiryDate() != null ? donation.getExpiryDate().toString() : null);
        savedDonation.setDonorName(donation.getStoreName() != null ? donation.getStoreName() :
                donation.getCorporateName() != null ? donation.getCorporateName() : "Anonymous");

        SavedDonation saved = savedDonationRepository.save(savedDonation);
        logger.info("Successfully saved donation {} for user {}", donationId, userId);

        return saved;
    }

    /**
     * Remove a saved donation
     */
    @Transactional
    public boolean unsaveDonation(Long userId, Long donationId) {
        logger.info("Removing saved donation {} for user {}", donationId, userId);

        if (!savedDonationRepository.existsByUserIdAndDonationId(userId, donationId)) {
            logger.warn("Donation {} not found in saved list for user {}", donationId, userId);
            return false;
        }

        savedDonationRepository.deleteByUserIdAndDonationId(userId, donationId);
        logger.info("Successfully removed saved donation {} for user {}", donationId, userId);

        return true;
    }

    /**
     * Get all saved donations for a user with full details
     */
    @Transactional(readOnly = true)
    public List<SavedDonationDTO> getUserSavedDonations(Long userId) {
        logger.info("Getting saved donations for user {}", userId);

        List<SavedDonation> savedDonations = savedDonationRepository.findByUserIdOrderBySavedAtDesc(userId);

        return savedDonations.stream().map(savedDonation -> {
            SavedDonationDTO dto = SavedDonationDTO.fromEntity(savedDonation);

            // Fetch current donation details
            try {
                Optional<Donation> donationOpt = donationRepository.findById(savedDonation.getDonationId());
                if (donationOpt.isPresent()) {
                    Donation donation = donationOpt.get();
                    dto.setImageData(donation.getImageData());
                    dto.setImageContentType(donation.getImageContentType());
                    dto.setQuantity(donation.getQuantity());
                    dto.setDescription(donation.getDescription());

                    // Update denormalized fields if they've changed
                    dto.setFoodName(donation.getFoodName());
                    dto.setLocation(donation.getLocation());
                }
            } catch (Exception e) {
                logger.warn("Error fetching donation details for saved donation {}: {}",
                        savedDonation.getDonationId(), e.getMessage());
            }

            return dto;
        }).collect(Collectors.toList());
    }

    /**
     * Get only the donation IDs that are saved by a user (for frontend state)
     */
    @Transactional(readOnly = true)
    public List<Long> getUserSavedDonationIds(Long userId) {
        logger.debug("Getting saved donation IDs for user {}", userId);
        return savedDonationRepository.findDonationIdsByUserId(userId);
    }

    /**
     * Check if a donation is saved by a user
     */
    @Transactional(readOnly = true)
    public boolean isDonationSaved(Long userId, Long donationId) {
        return savedDonationRepository.existsByUserIdAndDonationId(userId, donationId);
    }

    /**
     * Get count of saved donations for a user
     */
    @Transactional(readOnly = true)
    public long getUserSavedDonationsCount(Long userId) {
        return savedDonationRepository.countByUserId(userId);
    }

    /**
     * Get only active saved donations (where the original donation is still active)
     */
    @Transactional(readOnly = true)
    public List<SavedDonationDTO> getActiveSavedDonations(Long userId) {
        logger.info("Getting active saved donations for user {}", userId);

        List<SavedDonation> activeSavedDonations = savedDonationRepository.findActiveSavedDonationsByUserId(userId);

        return activeSavedDonations.stream().map(savedDonation -> {
            SavedDonationDTO dto = SavedDonationDTO.fromEntity(savedDonation);

            // Fetch current donation details
            try {
                Optional<Donation> donationOpt = donationRepository.findById(savedDonation.getDonationId());
                if (donationOpt.isPresent()) {
                    Donation donation = donationOpt.get();
                    dto.setImageData(donation.getImageData());
                    dto.setImageContentType(donation.getImageContentType());
                    dto.setQuantity(donation.getQuantity());
                    dto.setDescription(donation.getDescription());
                }
            } catch (Exception e) {
                logger.warn("Error fetching donation details for saved donation {}: {}",
                        savedDonation.getDonationId(), e.getMessage());
            }

            return dto;
        }).collect(Collectors.toList());
    }
}