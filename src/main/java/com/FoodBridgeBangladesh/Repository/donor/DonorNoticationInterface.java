package com.FoodBridgeBangladesh.Repository.donor;

import com.FoodBridgeBangladesh.Model.donor.DonorNotication;
import com.FoodBridgeBangladesh.Model.donor.DonorNotication.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DonorNoticationInterface extends JpaRepository<DonorNotication, Long> {

    // Find all notifications for a specific donor, ordered by latest first
    List<DonorNotication> findByDonorIdOrderByCreatedAtDesc(Long donorId);

    // Find notifications with pagination
    Page<DonorNotication> findByDonorIdOrderByCreatedAtDesc(Long donorId, Pageable pageable);

    // Find unread notifications for a donor
    List<DonorNotication> findByDonorIdAndIsReadFalseOrderByCreatedAtDesc(Long donorId);

    // Find read notifications for a donor
    List<DonorNotication> findByDonorIdAndIsReadTrueOrderByCreatedAtDesc(Long donorId);

    // Count unread notifications
    Long countByDonorIdAndIsReadFalse(Long donorId);

    // Count total notifications for a donor
    Long countByDonorId(Long donorId);

    // Find notifications by type
    List<DonorNotication> findByDonorIdAndTypeOrderByCreatedAtDesc(Long donorId, NotificationType type);

    // Find notification by request ID (for pickup requests)
    Optional<DonorNotication> findByDonorIdAndRequestId(Long donorId, Long requestId);

    // Find notification by food request ID
    Optional<DonorNotication> findByDonorIdAndFoodRequestId(Long donorId, Long foodRequestId);

    // Find notification by donation ID
    List<DonorNotication> findByDonorIdAndDonationId(Long donorId, Long donationId);

    // Mark all notifications as read for a donor
    @Modifying
    @Transactional
    @Query("UPDATE DonorNotication n SET n.isRead = true, n.readAt = :readAt WHERE n.donorId = :donorId AND n.isRead = false")
    int markAllAsReadByDonorId(@Param("donorId") Long donorId, @Param("readAt") LocalDateTime readAt);

    // Mark notification as read
    @Modifying
    @Transactional
    @Query("UPDATE DonorNotication n SET n.isRead = true, n.readAt = :readAt WHERE n.id = :notificationId AND n.donorId = :donorId")
    int markAsReadByIdAndDonorId(@Param("notificationId") Long notificationId, @Param("donorId") Long donorId, @Param("readAt") LocalDateTime readAt);

    // Delete notifications older than specified date
    @Modifying
    @Transactional
    @Query("DELETE FROM DonorNotication n WHERE n.createdAt < :cutoffDate")
    int deleteNotificationsOlderThan(@Param("cutoffDate") LocalDateTime cutoffDate);

    // Delete notification by ID and donor ID (security check)
    @Modifying
    @Transactional
    int deleteByIdAndDonorId(Long id, Long donorId);

    // Find notifications by multiple types
    @Query("SELECT n FROM DonorNotication n WHERE n.donorId = :donorId AND n.type IN :types ORDER BY n.createdAt DESC")
    List<DonorNotication> findByDonorIdAndTypeInOrderByCreatedAtDesc(@Param("donorId") Long donorId, @Param("types") List<NotificationType> types);

    // Get notification statistics
    @Query("SELECT " +
            "COUNT(*) as totalNotifications, " +
            "SUM(CASE WHEN n.isRead = false THEN 1 ELSE 0 END) as unreadCount, " +
            "SUM(CASE WHEN n.type = 'PICKUP_REQUEST' THEN 1 ELSE 0 END) as pickupRequests, " +
            "SUM(CASE WHEN n.type = 'FOOD_REQUEST' THEN 1 ELSE 0 END) as foodRequests " +
            "FROM DonorNotication n WHERE n.donorId = :donorId")
    Object[] getNotificationStatsByDonorId(@Param("donorId") Long donorId);
}