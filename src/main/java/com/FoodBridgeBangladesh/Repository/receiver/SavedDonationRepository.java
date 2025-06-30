package com.FoodBridgeBangladesh.Repository.receiver;

import com.FoodBridgeBangladesh.Model.receiver.SavedDonation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedDonationRepository extends JpaRepository<SavedDonation, Long> {

    /**
     * Find all saved donations for a user, ordered by most recently saved
     */
    List<SavedDonation> findByUserIdOrderBySavedAtDesc(Long userId);

    /**
     * Check if a donation is already saved by a user
     */
    boolean existsByUserIdAndDonationId(Long userId, Long donationId);

    /**
     * Find a specific saved donation
     */
    Optional<SavedDonation> findByUserIdAndDonationId(Long userId, Long donationId);

    /**
     * Delete a saved donation
     */
    void deleteByUserIdAndDonationId(Long userId, Long donationId);

    /**
     * Get only the donation IDs that are saved by a user (for frontend state)
     */
    @Query("SELECT sd.donationId FROM SavedDonation sd WHERE sd.userId = :userId")
    List<Long> findDonationIdsByUserId(@Param("userId") Long userId);

    /**
     * Count total saved donations for a user
     */
    long countByUserId(Long userId);

    /**
     * Find saved donations with additional donation details
     */
    @Query("SELECT sd FROM SavedDonation sd JOIN Donation d ON sd.donationId = d.id " +
            "WHERE sd.userId = :userId AND d.status = 'Active' ORDER BY sd.savedAt DESC")
    List<SavedDonation> findActiveSavedDonationsByUserId(@Param("userId") Long userId);
}