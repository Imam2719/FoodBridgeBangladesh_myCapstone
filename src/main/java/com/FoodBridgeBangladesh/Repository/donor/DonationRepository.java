package com.FoodBridgeBangladesh.Repository.donor;

import com.FoodBridgeBangladesh.Model.donor.Donation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {

    List<Donation> findByDonorId(Long donorId);

    List<Donation> findByDonorIdAndStatus(Long donorId, String status);

    List<Donation> findByExpiryDateBeforeAndStatus(LocalDate date, String status);

    List<Donation> findByOriginalFoodItemId(Long foodItemId);

    @Query("SELECT d FROM Donation d")
    Page<Donation> findAllActiveDonations(Pageable pageable);

    @Query("SELECT d FROM Donation d WHERE d.status = 'Active'")
    List<Donation> findActiveDonations();

    List<Donation> findByStatusOrderByCreatedAtDesc(String status);

    List<Donation> findByDonorIdAndStatusNot(Long donorId, String status);

    Page<Donation> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);

    List<Donation> findByCategoryAndStatus(String category, String status);

    List<Donation> findByDonorIdAndStatusIgnoreCase(Long donorId, String status);

    @Query("SELECT d FROM Donation d WHERE d.donorId = :donorId AND UPPER(d.status) = UPPER(:status)")
    List<Donation> findByDonorIdAndStatusCaseInsensitive(@Param("donorId") Long donorId, @Param("status") String status);

    // New method for category-based filtering with pagination
    @Query("SELECT d FROM Donation d WHERE d.category = :category AND d.status = :status ORDER BY d.createdAt DESC")
    Page<Donation> findByCategoryAndStatusOrderByCreatedAtDesc(
            @Param("category") Donation.DonationCategory category,
            @Param("status") String status,
            Pageable pageable);

    // Method using string category name for easier mapping
    @Query("SELECT d FROM Donation d WHERE CAST(d.category AS string) = :categoryName AND d.status = :status ORDER BY d.createdAt DESC")
    Page<Donation> findByCategoryAndStatusOrderByCreatedAtDesc(
            @Param("categoryName") String categoryName,
            @Param("status") String status,
            Pageable pageable);

    // Additional method for finding donations by category name without pagination
    @Query("SELECT d FROM Donation d WHERE CAST(d.category AS string) = :categoryName AND d.status = :status ORDER BY d.createdAt DESC")
    List<Donation> findByCategoryNameAndStatusOrderByCreatedAtDesc(
            @Param("categoryName") String categoryName,
            @Param("status") String status);

    // Method to get count of donations by category
    @Query("SELECT COUNT(d) FROM Donation d WHERE CAST(d.category AS string) = :categoryName AND d.status = :status")
    long countByCategoryNameAndStatus(@Param("categoryName") String categoryName, @Param("status") String status);

    // Method to get all categories with their counts
    @Query("SELECT CAST(d.category AS string) as categoryName, COUNT(d) as count FROM Donation d WHERE d.status = :status GROUP BY d.category ORDER BY COUNT(d) DESC")
    List<Object[]> getCategoriesWithCounts(@Param("status") String status);

}