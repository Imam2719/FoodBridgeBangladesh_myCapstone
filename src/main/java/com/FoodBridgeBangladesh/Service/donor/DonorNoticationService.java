package com.FoodBridgeBangladesh.Service.donor;

import com.FoodBridgeBangladesh.Model.donor.DonorNotication;
import com.FoodBridgeBangladesh.Model.donor.DonorNotication.NotificationType;
import com.FoodBridgeBangladesh.Repository.donor.DonorNoticationInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class DonorNoticationService {

    @Autowired
    private DonorNoticationInterface notificationRepository;

    /**
     * Create a new notification for pickup request
     */
    public DonorNotication createPickupRequestNotification(Long donorId, Long requestId, Long donationId,
                                                           String requesterName, Long requesterId,
                                                           String donationName, String quantity) {
        DonorNotication notification = new DonorNotication();
        notification.setDonorId(donorId);
        notification.setType(NotificationType.PICKUP_REQUEST);
        notification.setTitle("New Pickup Request");
        notification.setMessage(String.format("%s has requested to pickup your donation: %s",
                requesterName, donationName));
        notification.setRequestId(requestId);
        notification.setDonationId(donationId);
        notification.setRequesterName(requesterName);
        notification.setRequesterId(requesterId);

        // Create additional data JSON
        Map<String, Object> additionalData = new HashMap<>();
        additionalData.put("donationName", donationName);
        additionalData.put("quantity", quantity);
        additionalData.put("requestType", "pickup");
        notification.setAdditionalData(createJsonString(additionalData));

        return notificationRepository.save(notification);
    }

    /**
     * Create a new notification for food request
     */
    public DonorNotication createFoodRequestNotification(Long donorId, Long foodRequestId,
                                                         String requesterName, Long requesterId,
                                                         String foodType, Integer peopleCount) {
        DonorNotication notification = new DonorNotication();
        notification.setDonorId(donorId);
        notification.setType(NotificationType.FOOD_REQUEST);
        notification.setTitle("New Food Request");
        notification.setMessage(String.format("%s has requested food for %d people",
                requesterName, peopleCount != null ? peopleCount : 1));
        notification.setFoodRequestId(foodRequestId);
        notification.setRequesterName(requesterName);
        notification.setRequesterId(requesterId);

        // Create additional data JSON
        Map<String, Object> additionalData = new HashMap<>();
        additionalData.put("foodType", foodType);
        additionalData.put("peopleCount", peopleCount);
        additionalData.put("requestType", "food");
        notification.setAdditionalData(createJsonString(additionalData));

        return notificationRepository.save(notification);
    }

    /**
     * Create a system notification
     */
    public DonorNotication createSystemNotification(Long donorId, String title, String message) {
        DonorNotication notification = new DonorNotication();
        notification.setDonorId(donorId);
        notification.setType(NotificationType.SYSTEM_NOTIFICATION);
        notification.setTitle(title);
        notification.setMessage(message);

        return notificationRepository.save(notification);
    }

    /**
     * Get all notifications for a donor (latest first)
     */
    public List<DonorNotication> getAllNotifications(Long donorId) {
        return notificationRepository.findByDonorIdOrderByCreatedAtDesc(donorId);
    }

    /**
     * Get notifications with pagination
     */
    public Page<DonorNotication> getNotifications(Long donorId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return notificationRepository.findByDonorIdOrderByCreatedAtDesc(donorId, pageable);
    }

    /**
     * Get unread notifications
     */
    public List<DonorNotication> getUnreadNotifications(Long donorId) {
        return notificationRepository.findByDonorIdAndIsReadFalseOrderByCreatedAtDesc(donorId);
    }

    /**
     * Get read notifications
     */
    public List<DonorNotication> getReadNotifications(Long donorId) {
        return notificationRepository.findByDonorIdAndIsReadTrueOrderByCreatedAtDesc(donorId);
    }

    /**
     * Mark notification as read
     */
    public boolean markAsRead(Long notificationId, Long donorId) {
        int updated = notificationRepository.markAsReadByIdAndDonorId(notificationId, donorId, LocalDateTime.now());
        return updated > 0;
    }

    /**
     * Mark all notifications as read
     */
    public int markAllAsRead(Long donorId) {
        return notificationRepository.markAllAsReadByDonorId(donorId, LocalDateTime.now());
    }

    /**
     * Delete notification
     */
    public boolean deleteNotification(Long notificationId, Long donorId) {
        int deleted = notificationRepository.deleteByIdAndDonorId(notificationId, donorId);
        return deleted > 0;
    }

    /**
     * Get notification by ID (with donor verification)
     */
    public Optional<DonorNotication> getNotificationById(Long notificationId, Long donorId) {
        Optional<DonorNotication> notification = notificationRepository.findById(notificationId);
        if (notification.isPresent() && notification.get().getDonorId().equals(donorId)) {
            return notification;
        }
        return Optional.empty();
    }

    /**
     * Get unread count
     */
    public Long getUnreadCount(Long donorId) {
        return notificationRepository.countByDonorIdAndIsReadFalse(donorId);
    }

    /**
     * Get total notification count
     */
    public Long getTotalCount(Long donorId) {
        return notificationRepository.countByDonorId(donorId);
    }

    /**
     * Get notification statistics
     */
    public Map<String, Long> getNotificationStats(Long donorId) {
        Object[] stats = notificationRepository.getNotificationStatsByDonorId(donorId);
        Map<String, Long> result = new HashMap<>();

        if (stats != null && stats.length > 0) {
            Object[] row = (Object[]) stats[0];
            result.put("totalNotifications", row[0] != null ? ((Number) row[0]).longValue() : 0L);
            result.put("unreadCount", row[1] != null ? ((Number) row[1]).longValue() : 0L);
            result.put("pickupRequests", row[2] != null ? ((Number) row[2]).longValue() : 0L);
            result.put("foodRequests", row[3] != null ? ((Number) row[3]).longValue() : 0L);
        } else {
            result.put("totalNotifications", 0L);
            result.put("unreadCount", 0L);
            result.put("pickupRequests", 0L);
            result.put("foodRequests", 0L);
        }

        return result;
    }

    /**
     * Get notifications by type
     */
    public List<DonorNotication> getNotificationsByType(Long donorId, NotificationType type) {
        return notificationRepository.findByDonorIdAndTypeOrderByCreatedAtDesc(donorId, type);
    }

    /**
     * Check if notification exists for specific request
     */
    public boolean notificationExistsForRequest(Long donorId, Long requestId) {
        return notificationRepository.findByDonorIdAndRequestId(donorId, requestId).isPresent();
    }

    /**
     * Check if notification exists for specific food request
     */
    public boolean notificationExistsForFoodRequest(Long donorId, Long foodRequestId) {
        return notificationRepository.findByDonorIdAndFoodRequestId(donorId, foodRequestId).isPresent();
    }

    /**
     * Clean up old notifications (older than 30 days)
     */
    public int cleanupOldNotifications() {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(30);
        return notificationRepository.deleteNotificationsOlderThan(cutoffDate);
    }

    /**
     * Helper method to create JSON string from map
     */
    private String createJsonString(Map<String, Object> data) {
        try {
            StringBuilder json = new StringBuilder("{");
            boolean first = true;
            for (Map.Entry<String, Object> entry : data.entrySet()) {
                if (!first) json.append(",");
                json.append("\"").append(entry.getKey()).append("\":");
                if (entry.getValue() instanceof String) {
                    json.append("\"").append(entry.getValue()).append("\"");
                } else {
                    json.append(entry.getValue());
                }
                first = false;
            }
            json.append("}");
            return json.toString();
        } catch (Exception e) {
            return "{}";
        }
    }
}