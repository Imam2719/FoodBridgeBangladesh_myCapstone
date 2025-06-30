package com.FoodBridgeBangladesh.Repository;

import com.FoodBridgeBangladesh.Model.MessageBoard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MessageBoardRepository extends JpaRepository<MessageBoard, Long> {

    // Original methods - kept for backward compatibility
    List<MessageBoard> findByEmailOrderByCreatedAtDesc(String email);
    List<MessageBoard> findByRoleOrderByCreatedAtDesc(String role);
    List<MessageBoard> findAllByOrderByCreatedAtDesc();
    long countByRole(String role);

    // NEW: Read status filtering methods
    List<MessageBoard> findByIsReadFalseOrderByCreatedAtDesc();
    List<MessageBoard> findByIsReadTrueOrderByCreatedAtDesc();

    // NEW: Count methods for read status
    long countByIsReadFalse();
    long countByIsReadTrue();

    // NEW: Find messages with attachments
    List<MessageBoard> findByFileNameIsNotNullOrderByCreatedAtDesc();
    long countByFileNameIsNotNull();

    // NEW: Find messages by read status and role
    List<MessageBoard> findByIsReadAndRoleOrderByCreatedAtDesc(Boolean isRead, String role);

    // NEW: Find messages by admin who read them
    List<MessageBoard> findByReadByOrderByCreatedAtDesc(String readBy);

    // NEW: Find messages read within a date range
    List<MessageBoard> findByReadAtBetweenOrderByReadAtDesc(LocalDateTime startDate, LocalDateTime endDate);

    // NEW: Find messages created within a date range
    List<MessageBoard> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime startDate, LocalDateTime endDate);

    // NEW: Search methods
    List<MessageBoard> findByMessageContainingIgnoreCaseOrEmailContainingIgnoreCaseOrderByCreatedAtDesc(String messageKeyword, String emailKeyword);

    List<MessageBoard> findByEmailContainingIgnoreCaseOrderByCreatedAtDesc(String email);

    List<MessageBoard> findByMessageContainingIgnoreCaseOrderByCreatedAtDesc(String keyword);

    List<MessageBoard> findBySubjectContainingIgnoreCaseOrderByCreatedAtDesc(String subject);

    // NEW: Complex search with multiple criteria
    @Query("SELECT m FROM MessageBoard m WHERE " +
            "(:email IS NULL OR LOWER(m.email) LIKE LOWER(CONCAT('%', :email, '%'))) AND " +
            "(:keyword IS NULL OR LOWER(m.message) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(m.subject) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
            "(:role IS NULL OR m.role = :role) AND " +
            "(:isRead IS NULL OR m.isRead = :isRead) AND " +
            "(:hasAttachment IS NULL OR (:hasAttachment = true AND m.fileName IS NOT NULL) OR (:hasAttachment = false AND m.fileName IS NULL)) " +
            "ORDER BY m.createdAt DESC")
    List<MessageBoard> findMessagesByCriteria(
            @Param("email") String email,
            @Param("keyword") String keyword,
            @Param("role") String role,
            @Param("isRead") Boolean isRead,
            @Param("hasAttachment") Boolean hasAttachment
    );

    // NEW: Find unread messages by role
    @Query("SELECT m FROM MessageBoard m WHERE m.isRead = false AND m.role = :role ORDER BY m.createdAt DESC")
    List<MessageBoard> findUnreadMessagesByRole(@Param("role") String role);

    // NEW: Find messages that need attention (unread and older than X hours)
    @Query("SELECT m FROM MessageBoard m WHERE m.isRead = false AND m.createdAt < :thresholdTime ORDER BY m.createdAt ASC")
    List<MessageBoard> findUnreadMessagesOlderThan(@Param("thresholdTime") LocalDateTime thresholdTime);

    // NEW: Get statistics
    @Query("SELECT COUNT(m) FROM MessageBoard m WHERE m.isRead = false AND m.createdAt >= :since")
    long countUnreadMessagesSince(@Param("since") LocalDateTime since);

    @Query("SELECT COUNT(m) FROM MessageBoard m WHERE m.createdAt >= :since")
    long countMessagesSince(@Param("since") LocalDateTime since);

    // NEW: Find recent messages (last 24 hours)
    @Query("SELECT m FROM MessageBoard m WHERE m.createdAt >= :since ORDER BY m.createdAt DESC")
    List<MessageBoard> findRecentMessages(@Param("since") LocalDateTime since);

    // NEW: Find messages by file type
    List<MessageBoard> findByFileTypeContainingOrderByCreatedAtDesc(String fileType);

    // NEW: Find large attachments (above certain size)
    @Query("SELECT m FROM MessageBoard m WHERE m.fileSize > :sizeThreshold ORDER BY m.fileSize DESC")
    List<MessageBoard> findMessagesWithLargeAttachments(@Param("sizeThreshold") Long sizeThreshold);

    // NEW: Count messages by admin who read them
    long countByReadBy(String readBy);

    // NEW: Find messages that were never read and are older than specified days
    @Query("SELECT m FROM MessageBoard m WHERE m.isRead = false AND m.createdAt < :cutoffDate ORDER BY m.createdAt ASC")
    List<MessageBoard> findOldUnreadMessages(@Param("cutoffDate") LocalDateTime cutoffDate);

    // NEW: Admin performance - messages read by admin in date range
    @Query("SELECT m FROM MessageBoard m WHERE m.readBy = :adminEmail AND m.readAt BETWEEN :startDate AND :endDate ORDER BY m.readAt DESC")
    List<MessageBoard> findMessagesReadByAdminInRange(
            @Param("adminEmail") String adminEmail,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    // NEW: Top email senders (most messages)
    @Query("SELECT m.email, COUNT(m) as messageCount FROM MessageBoard m GROUP BY m.email ORDER BY messageCount DESC")
    List<Object[]> findTopEmailSenders();

    // NEW: Messages grouped by role with counts
    @Query("SELECT m.role, COUNT(m) as messageCount FROM MessageBoard m GROUP BY m.role ORDER BY messageCount DESC")
    List<Object[]> findMessageCountsByRole();

    // NEW: Daily message statistics
    @Query("SELECT DATE(m.createdAt) as messageDate, COUNT(m) as messageCount FROM MessageBoard m WHERE m.createdAt >= :since GROUP BY DATE(m.createdAt) ORDER BY messageDate DESC")
    List<Object[]> findDailyMessageStats(@Param("since") LocalDateTime since);

    /**
     * Find messages by merchant ID
     */
    List<MessageBoard> findByMerchantIdOrderByCreatedAtDesc(Long merchantId);

    /**
     * Find messages by role containing specific text
     */
    List<MessageBoard> findByRoleContainingOrderByCreatedAtDesc(String rolePattern);

    /**
     * Find messages by merchant ID and read status
     */
    List<MessageBoard> findByMerchantIdAndIsReadOrderByCreatedAtDesc(Long merchantId, Boolean isRead);

    /**
     * Count unread messages for specific merchant
     */
    long countByMerchantIdAndIsReadFalse(Long merchantId);

    /**
     * Find messages by multiple roles
     */
    @Query("SELECT m FROM MessageBoard m WHERE m.role IN :roles ORDER BY m.createdAt DESC")
    List<MessageBoard> findByRoleInOrderByCreatedAtDesc(@Param("roles") List<String> roles);

    // ============================================================================
    // NEW MERCHANT-SPECIFIC QUERIES
    // ============================================================================

    /**
     * Find sent messages by merchant (messages they sent)
     */
    @Query("SELECT m FROM MessageBoard m WHERE m.merchantId = :merchantId AND m.role = 'merchant_to_admin' ORDER BY m.createdAt DESC")
    List<MessageBoard> findSentMessagesByMerchant(@Param("merchantId") Long merchantId);

    /**
     * Find received messages by merchant (messages sent to them, not ignored)
     * Admin messages are shown to all merchants, donor messages are merchant-specific
     */
    @Query("SELECT m FROM MessageBoard m WHERE " +
            "(m.role = 'admin_to_merchant' OR " +
            "(m.role = 'donor_to_merchant' AND m.merchantId = :merchantId)) " +
            "AND m.isIgnoredByMerchant = false ORDER BY m.createdAt DESC")
    List<MessageBoard> findReceivedMessagesByMerchant(@Param("merchantId") Long merchantId);

    /**
     * Count unread received messages for merchant
     * Admin messages are shown to all merchants, donor messages are merchant-specific
     */
    @Query("SELECT COUNT(m) FROM MessageBoard m WHERE " +
            "(m.role = 'admin_to_merchant' OR " +
            "(m.role = 'donor_to_merchant' AND m.merchantId = :merchantId)) " +
            "AND m.isRead = false AND m.isIgnoredByMerchant = false")
    long countUnreadReceivedMessagesByMerchant(@Param("merchantId") Long merchantId);

    /**
     * Count total sent messages by merchant
     */
    @Query("SELECT COUNT(m) FROM MessageBoard m WHERE m.merchantId = :merchantId AND m.role = 'merchant_to_admin'")
    long countSentMessagesByMerchant(@Param("merchantId") Long merchantId);

    /**
     * Count total received messages by merchant (not ignored)
     * Admin messages are shown to all merchants, donor messages are merchant-specific
     */
    @Query("SELECT COUNT(m) FROM MessageBoard m WHERE " +
            "(m.role = 'admin_to_merchant' OR " +
            "(m.role = 'donor_to_merchant' AND m.merchantId = :merchantId)) " +
            "AND m.isIgnoredByMerchant = false")
    long countReceivedMessagesByMerchant(@Param("merchantId") Long merchantId);

    /**
     * Find a specific message that belongs to a merchant (for security)
     */
    @Query("SELECT m FROM MessageBoard m WHERE m.id = :messageId AND m.merchantId = :merchantId")
    MessageBoard findMessageByIdAndMerchantId(@Param("messageId") Long messageId, @Param("merchantId") Long merchantId);

    /**
     * Find a specific sent message by merchant (for deletion)
     */
    @Query("SELECT m FROM MessageBoard m WHERE m.id = :messageId AND m.merchantId = :merchantId AND m.role = 'merchant_to_admin'")
    MessageBoard findSentMessageByIdAndMerchantId(@Param("messageId") Long messageId, @Param("merchantId") Long merchantId);

    /**
     * Find a specific received message by merchant (for marking as read/ignored)
     * Admin messages are accessible to all merchants, donor messages are merchant-specific
     */
    @Query("SELECT m FROM MessageBoard m WHERE m.id = :messageId AND " +
            "(m.role = 'admin_to_merchant' OR " +
            "(m.role = 'donor_to_merchant' AND m.merchantId = :merchantId))")
    MessageBoard findReceivedMessageByIdAndMerchantId(@Param("messageId") Long messageId, @Param("merchantId") Long merchantId);
    // REMOVE these donor-specific queries and REPLACE with role-based ones:

    /**
     * Find received messages by role (admin_to_donor and merchant_to_donor)
     * NO donor ID filtering - shows all messages for these roles
     */
    @Query("SELECT m FROM MessageBoard m WHERE m.role IN ('admin_to_donor', 'merchant_to_donor') ORDER BY m.createdAt DESC")
    List<MessageBoard> findReceivedMessagesByRole();

    /**
     * Find sent messages by role (donor_to_admin)
     * NO donor ID filtering - shows all messages for this role
     */
    @Query("SELECT m FROM MessageBoard m WHERE m.role = 'donor_to_admin' ORDER BY m.createdAt DESC")
    List<MessageBoard> findSentMessagesByRole();

    /**
     * Count unread received messages by role
     */
    @Query("SELECT COUNT(m) FROM MessageBoard m WHERE m.role IN ('admin_to_donor', 'merchant_to_donor') AND m.isRead = false")
    long countUnreadReceivedMessagesByRole();

    /**
     * Count total received messages by role
     */
    @Query("SELECT COUNT(m) FROM MessageBoard m WHERE m.role IN ('admin_to_donor', 'merchant_to_donor')")
    long countReceivedMessagesByRole();

    /**
     * Count total sent messages by role
     */
    @Query("SELECT COUNT(m) FROM MessageBoard m WHERE m.role = 'donor_to_admin'")
    long countSentMessagesByRole();

    /**
     * Find a specific received message by role (for marking as read)
     */
    @Query("SELECT m FROM MessageBoard m WHERE m.id = :messageId AND m.role IN ('admin_to_donor', 'merchant_to_donor')")
    MessageBoard findReceivedMessageByIdAndRole(@Param("messageId") Long messageId);

    /**
     * Find a specific sent message by role (for deletion)
     */
    @Query("SELECT m FROM MessageBoard m WHERE m.id = :messageId AND m.role = 'donor_to_admin'")
    MessageBoard findSentMessageByIdAndRole(@Param("messageId") Long messageId);
}