package com.FoodBridgeBangladesh.Repository.merchant;

import com.FoodBridgeBangladesh.Model.merchant.MerchantSale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MerchantSaleRepository extends JpaRepository<MerchantSale, Long> {

    List<MerchantSale> findByMerchantId(Long merchantId);

    List<MerchantSale> findByDonorId(Long donorId);

    List<MerchantSale> findByFoodItemId(Long foodItemId);

    List<MerchantSale> findByDonationId(Long donationId);

    List<MerchantSale> findByMerchantIdAndSaleStatus(Long merchantId, String status);

    List<MerchantSale> findByDonorIdAndSaleStatus(Long donorId, String status);

    @Query("SELECT SUM(ms.quantitySold) FROM MerchantSale ms WHERE ms.foodItemId = :foodItemId AND ms.saleStatus != 'CANCELLED'")
    Integer getTotalSoldQuantityByFoodItemId(@Param("foodItemId") Long foodItemId);

    @Query("SELECT ms FROM MerchantSale ms WHERE ms.saleDate BETWEEN :startDate AND :endDate")
    List<MerchantSale> findSalesBetweenDates(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    // ✅ ADD this method to your MerchantSaleRepository.java interface

    /**
     * Calculate total revenue for merchant within date range for completed sales
     */
    @Query("SELECT COALESCE(SUM(s.totalAmount), 0.0) FROM MerchantSale s " +
            "WHERE s.merchantId = :merchantId " +
            "AND s.saleDate BETWEEN :startDate AND :endDate " +
            "AND s.saleStatus = 'COMPLETED'")
    Double getTotalRevenueByMerchantAndDateRange(
            @Param("merchantId") Long merchantId,
            @Param("startDate") java.sql.Date startDate,
            @Param("endDate") java.sql.Date endDate
    );

    /**
     * Alternative method using LocalDate (if your entity uses LocalDate)
     */
    @Query("SELECT COALESCE(SUM(s.totalAmount), 0.0) FROM MerchantSale s " +
            "WHERE s.merchantId = :merchantId " +
            "AND s.saleDate BETWEEN :startDate AND :endDate " +
            "AND s.saleStatus = 'COMPLETED'")
    Double getTotalRevenueByMerchantAndDateRangeLocal(
            @Param("merchantId") Long merchantId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    /**
     * Get monthly revenue for specific year and month
     */
    @Query(value = "SELECT COALESCE(SUM(total_amount), 0.0) FROM merchant_sale " +
            "WHERE merchant_id = :merchantId " +
            "AND YEAR(sale_date) = :year " +
            "AND MONTH(sale_date) = :month " +
            "AND sale_status = 'COMPLETED'",
            nativeQuery = true)
    Double getMonthlyRevenue(
            @Param("merchantId") Long merchantId,
            @Param("year") int year,
            @Param("month") int month
    );

    /**
     * Get revenue for last N days
     */
    @Query(value = "SELECT COALESCE(SUM(total_amount), 0.0) FROM merchant_sale " +
            "WHERE merchant_id = :merchantId " +
            "AND sale_date >= DATE_SUB(CURDATE(), INTERVAL :days DAY) " +
            "AND sale_status = 'COMPLETED'",
            nativeQuery = true)
    Double getRevenueForLastDays(
            @Param("merchantId") Long merchantId,
            @Param("days") int days
    );
    // Add to MerchantSaleRepository.java
    @Query("SELECT COALESCE(SUM(s.totalAmount), 0.0) FROM MerchantSale s " +
            "WHERE s.merchantId = :merchantId AND s.saleStatus = 'COMPLETED'")
    Double getTotalRevenueByMerchant(@Param("merchantId") Long merchantId);
}