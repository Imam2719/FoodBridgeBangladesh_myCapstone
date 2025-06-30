package com.FoodBridgeBangladesh.Repository.merchant;

import com.FoodBridgeBangladesh.Model.merchant.MerchantPaymentHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MerchantPaymentHistoryRepository extends JpaRepository<MerchantPaymentHistory, Long> {

    /**
     * Find all payment history for a specific merchant
     */
    List<MerchantPaymentHistory> findByMerchantIdOrderByPaymentDateDesc(String merchantId);

    /**
     * Find payment history for a specific merchant and month
     */
    Optional<MerchantPaymentHistory> findByMerchantIdAndPaymentMonth(String merchantId, String paymentMonth);

    /**
     * Check if merchant has paid for a specific month
     */
    boolean existsByMerchantIdAndPaymentMonthAndStatus(String merchantId, String paymentMonth, String status);

    /**
     * Find all payments for a specific month (admin use)
     */
    List<MerchantPaymentHistory> findByPaymentMonthOrderByPaymentDateDesc(String paymentMonth);

    /**
     * Find payments by status
     */
    List<MerchantPaymentHistory> findByMerchantIdAndStatusOrderByPaymentDateDesc(String merchantId, String status);

    /**
     * Get total amount paid by merchant
     */
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM MerchantPaymentHistory p WHERE p.merchantId = :merchantId AND p.status = 'COMPLETED'")
    Double getTotalAmountPaidByMerchant(@Param("merchantId") String merchantId);

    /**
     * Get payment count for merchant
     */
    long countByMerchantIdAndStatus(String merchantId, String status);

    /**
     * Find recent payments (last 6 months)
     */
    @Query(value = "SELECT * FROM merchant_payment_history WHERE merchant_id = :merchantId AND payment_date >= CURRENT_DATE - INTERVAL '180 days' ORDER BY payment_date DESC", nativeQuery = true)
    List<MerchantPaymentHistory> findRecentPaymentsByMerchant(@Param("merchantId") String merchantId);
    /**
     * Find payments by payment method
     */
    List<MerchantPaymentHistory> findByMerchantIdAndPaymentMethodOrderByPaymentDateDesc(String merchantId, String paymentMethod);

    /**
     * Get monthly payment statistics
     */
    @Query("SELECT p.paymentMonth, COUNT(p), SUM(p.amount) FROM MerchantPaymentHistory p WHERE p.merchantId = :merchantId AND p.status = 'COMPLETED' GROUP BY p.paymentMonth ORDER BY p.paymentMonth DESC")
    List<Object[]> getMonthlyPaymentStats(@Param("merchantId") String merchantId);

/**
 * ✅ ADD to MerchantPaymentHistoryRepository.java interface
 */

    /**
     * Check if any payment exists for merchant (for debugging)
     */
    boolean existsByMerchantId(String merchantId);

    /**
     * Find all payments with pagination support
     */
    @Query("SELECT p FROM MerchantPaymentHistory p ORDER BY p.paymentDate DESC")
    List<MerchantPaymentHistory> findAllOrderByPaymentDateDesc();

    /**
     * Get payment summary by merchant
     */
    @Query("SELECT p.merchantId, p.merchantName, COUNT(p), SUM(p.amount), MAX(p.paymentDate) " +
            "FROM MerchantPaymentHistory p " +
            "WHERE p.status = 'COMPLETED' " +
            "GROUP BY p.merchantId, p.merchantName " +
            "ORDER BY COUNT(p) DESC")
    List<Object[]> getPaymentSummaryByMerchant();
}