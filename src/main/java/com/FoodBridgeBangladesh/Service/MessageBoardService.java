package com.FoodBridgeBangladesh.Service;

import com.FoodBridgeBangladesh.Model.MessageBoard;
import com.FoodBridgeBangladesh.Model.dto.MessageBoardDTO;
import com.FoodBridgeBangladesh.Repository.MessageBoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

@Service
@Transactional
public class MessageBoardService {

    @Autowired
    private MessageBoardRepository messageBoardRepository;

    private static final String ANONYMOUS_SUBJECT = "Message from Anonymous";
    private static final String ANONYMOUS_ROLE = "anonymous";

    /**
     * Save message from homepage contact form
     */
    public MessageBoardDTO saveAnonymousMessage(String email, String message, MultipartFile attachment) {
        try {
            MessageBoard messageBoard = new MessageBoard();
            messageBoard.setEmail(email);
            messageBoard.setMessage(message);
            messageBoard.setSubject(ANONYMOUS_SUBJECT);
            messageBoard.setRole(ANONYMOUS_ROLE);

            // Handle file attachment if present
            if (attachment != null && !attachment.isEmpty()) {
                messageBoard.setFileName(attachment.getOriginalFilename());
                messageBoard.setFileType(attachment.getContentType());
                messageBoard.setFileSize(attachment.getSize());
                messageBoard.setFileData(attachment.getBytes());

                System.out.println("File attached: " + attachment.getOriginalFilename() + " (" + attachment.getSize() + " bytes)");
            }

            MessageBoard savedMessage = messageBoardRepository.save(messageBoard);
            System.out.println("Anonymous message saved with ID: " + savedMessage.getId());

            return convertToDTO(savedMessage);

        } catch (Exception e) {
            System.err.println("Error saving anonymous message: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to save message: " + e.getMessage());
        }
    }

    /**
     * Get all messages for admin view (without file data) including read status
     */
    public List<MessageBoardDTO> getAllMessagesWithReadStatus() {
        List<MessageBoard> messages = messageBoardRepository.findAllByOrderByCreatedAtDesc();
        return messages.stream()
                .map(this::convertToDTOWithReadStatus)
                .collect(Collectors.toList());
    }

    /**
     * Get all messages (backward compatibility)
     */
    public List<MessageBoardDTO> getAllMessages() {
        return getAllMessagesWithReadStatus();
    }

    /**
     * Get unread messages only
     */
    public List<MessageBoardDTO> getUnreadMessages() {
        List<MessageBoard> messages = messageBoardRepository.findByIsReadFalseOrderByCreatedAtDesc();
        return messages.stream()
                .map(this::convertToDTOWithReadStatus)
                .collect(Collectors.toList());
    }

    /**
     * Get read messages only
     */
    public List<MessageBoardDTO> getReadMessages() {
        List<MessageBoard> messages = messageBoardRepository.findByIsReadTrueOrderByCreatedAtDesc();
        return messages.stream()
                .map(this::convertToDTOWithReadStatus)
                .collect(Collectors.toList());
    }

    /**
     * Get messages with attachments
     */
    public List<MessageBoardDTO> getMessagesWithAttachments() {
        List<MessageBoard> messages = messageBoardRepository.findByFileNameIsNotNullOrderByCreatedAtDesc();
        return messages.stream()
                .map(this::convertToDTOWithReadStatus)
                .collect(Collectors.toList());
    }

    /**
     * Get message by ID with file data
     */
    public Optional<MessageBoard> getMessageById(Long id) {
        return messageBoardRepository.findById(id);
    }

    /**
     * Mark message as read
     */
    public boolean markMessageAsRead(Long messageId, String adminEmail) {
        try {
            Optional<MessageBoard> messageOpt = messageBoardRepository.findById(messageId);
            if (messageOpt.isPresent()) {
                MessageBoard message = messageOpt.get();
                if (!message.getIsRead()) {
                    message.markAsRead(adminEmail);
                    messageBoardRepository.save(message);
                    System.out.println("Message " + messageId + " marked as read by " + adminEmail);
                    return true;
                }
                return true; // Already read
            }
            return false;
        } catch (Exception e) {
            System.err.println("Error marking message as read: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Get anonymous messages count
     */
    public long getAnonymousMessageCount() {
        return messageBoardRepository.countByRole(ANONYMOUS_ROLE);
    }

    /**
     * Get unread messages count
     */
    public long getUnreadMessageCount() {
        return messageBoardRepository.countByIsReadFalse();
    }

    /**
     * Get read messages count
     */
    public long getReadMessageCount() {
        return messageBoardRepository.countByIsReadTrue();
    }

    /**
     * Get messages with attachments count
     */
    public long getMessagesWithAttachmentsCount() {
        return messageBoardRepository.countByFileNameIsNotNull();
    }

    /**
     * Delete message by ID
     */
    public boolean deleteMessage(Long id) {
        try {
            if (messageBoardRepository.existsById(id)) {
                messageBoardRepository.deleteById(id);
                System.out.println("Message deleted with ID: " + id);
                return true;
            }
            return false;
        } catch (Exception e) {
            System.err.println("Error deleting message: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Bulk delete messages
     */
    public int bulkDeleteMessages(List<Long> messageIds) {
        try {
            int deletedCount = 0;
            for (Long id : messageIds) {
                if (messageBoardRepository.existsById(id)) {
                    messageBoardRepository.deleteById(id);
                    deletedCount++;
                }
            }
            System.out.println("Bulk delete completed: " + deletedCount + " messages deleted");
            return deletedCount;
        } catch (Exception e) {
            System.err.println("Error in bulk delete: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Bulk delete failed: " + e.getMessage());
        }
    }

    /**
     * Search messages by keyword
     */
    public List<MessageBoardDTO> searchMessages(String keyword) {
        try {
            List<MessageBoard> messages = messageBoardRepository.findByMessageContainingIgnoreCaseOrEmailContainingIgnoreCaseOrderByCreatedAtDesc(keyword, keyword);
            return messages.stream()
                    .map(this::convertToDTOWithReadStatus)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error searching messages: " + e.getMessage());
            e.printStackTrace();
            return List.of();
        }
    }

    /**
     * Get messages by email
     */
    public List<MessageBoardDTO> getMessagesByEmail(String email) {
        List<MessageBoard> messages = messageBoardRepository.findByEmailOrderByCreatedAtDesc(email);
        return messages.stream()
                .map(this::convertToDTOWithReadStatus)
                .collect(Collectors.toList());
    }

    /**
     * Get messages by role
     */
    public List<MessageBoardDTO> getMessagesByRole(String role) {
        List<MessageBoard> messages = messageBoardRepository.findByRoleOrderByCreatedAtDesc(role);
        return messages.stream()
                .map(this::convertToDTOWithReadStatus)
                .collect(Collectors.toList());
    }

    // ============================================================================
    // NEW MERCHANT-SPECIFIC METHODS
    // ============================================================================

    /**
     * Get sent messages by merchant (messages they sent)
     */
    public List<MessageBoardDTO> getMerchantSentMessages(Long merchantId) {
        try {
            List<MessageBoard> messages = messageBoardRepository.findSentMessagesByMerchant(merchantId);
            return messages.stream()
                    .map(this::convertToDTOWithReadStatus)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error fetching sent messages for merchant " + merchantId + ": " + e.getMessage());
            e.printStackTrace();
            return List.of();
        }
    }

    /**
     * Get received messages by merchant (messages sent to them, not ignored)
     */
    public List<MessageBoardDTO> getMerchantReceivedMessages(Long merchantId) {
        try {
            List<MessageBoard> messages = messageBoardRepository.findReceivedMessagesByMerchant(merchantId);
            return messages.stream()
                    .map(this::convertToDTOWithReadStatus)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error fetching received messages for merchant " + merchantId + ": " + e.getMessage());
            e.printStackTrace();
            return List.of();
        }
    }

    /**
     * Mark a received message as read by merchant
     */
    public boolean markMessageAsReadByMerchant(Long messageId, Long merchantId) {
        try {
            MessageBoard message = messageBoardRepository.findReceivedMessageByIdAndMerchantId(messageId, merchantId);
            if (message != null) {
                if (!message.getIsRead()) {
                    message.setIsRead(true);
                    message.setReadAt(LocalDateTime.now());
                    message.setReadBy("Merchant:" + merchantId);
                    messageBoardRepository.save(message);
                    System.out.println("Message " + messageId + " marked as read by merchant " + merchantId);
                }
                return true;
            }
            return false;
        } catch (Exception e) {
            System.err.println("Error marking message as read by merchant: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Ignore a message for merchant (hide it from their view)
     */
    public boolean ignoreMessageForMerchant(Long messageId, Long merchantId) {
        try {
            MessageBoard message = messageBoardRepository.findReceivedMessageByIdAndMerchantId(messageId, merchantId);
            if (message != null) {
                message.markAsIgnoredByMerchant();
                messageBoardRepository.save(message);
                System.out.println("Message " + messageId + " ignored by merchant " + merchantId);
                return true;
            }
            return false;
        } catch (Exception e) {
            System.err.println("Error ignoring message by merchant: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Delete a sent message by merchant (only their own messages)
     */
    public boolean deleteMerchantSentMessage(Long messageId, Long merchantId) {
        try {
            MessageBoard message = messageBoardRepository.findSentMessageByIdAndMerchantId(messageId, merchantId);
            if (message != null) {
                messageBoardRepository.delete(message);
                System.out.println("Sent message " + messageId + " deleted by merchant " + merchantId);
                return true;
            }
            return false;
        } catch (Exception e) {
            System.err.println("Error deleting sent message by merchant: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Get message statistics for merchant
     */
    public Map<String, Object> getMerchantMessageStats(Long merchantId) {
        try {
            Map<String, Object> stats = new HashMap<>();

            // Count sent messages
            long sentMessages = messageBoardRepository.countSentMessagesByMerchant(merchantId);

            // Count received messages (not ignored)
            long receivedMessages = messageBoardRepository.countReceivedMessagesByMerchant(merchantId);

            // Count unread received messages
            long unreadMessages = messageBoardRepository.countUnreadReceivedMessagesByMerchant(merchantId);

            // Count read received messages
            long readMessages = receivedMessages - unreadMessages;

            stats.put("totalSentMessages", sentMessages);
            stats.put("totalReceivedMessages", receivedMessages);
            stats.put("unreadMessages", unreadMessages);
            stats.put("readMessages", readMessages);

            return stats;
        } catch (Exception e) {
            System.err.println("Error fetching merchant message stats: " + e.getMessage());
            e.printStackTrace();
            return new HashMap<>();
        }
    }

    /**
     * Save message from merchant with custom subject, role, and optional attachment
     * UPDATED: Now properly stores merchant ID
     */
    public MessageBoardDTO saveMerchantMessage(String email, String message, String subject,
                                               String role, MultipartFile attachment, Long merchantId) {
        try {
            MessageBoard messageBoard = new MessageBoard();
            messageBoard.setEmail(email);
            messageBoard.setMessage(message);
            messageBoard.setSubject(subject);
            messageBoard.setRole(role);
            messageBoard.setMerchantId(merchantId); // IMPORTANT: Store merchant ID

            // Handle file attachment if present
            if (attachment != null && !attachment.isEmpty()) {
                messageBoard.setFileName(attachment.getOriginalFilename());
                messageBoard.setFileType(attachment.getContentType());
                messageBoard.setFileSize(attachment.getSize());
                messageBoard.setFileData(attachment.getBytes());

                System.out.println("File attached to merchant message: " + attachment.getOriginalFilename() +
                        " (" + attachment.getSize() + " bytes)");
            }

            MessageBoard savedMessage = messageBoardRepository.save(messageBoard);
            System.out.println("Merchant message saved successfully:");
            System.out.println("- ID: " + savedMessage.getId());
            System.out.println("- Subject: " + subject);
            System.out.println("- Role: " + role);
            System.out.println("- Email: " + email);
            System.out.println("- MerchantId: " + merchantId);

            return convertToDTO(savedMessage);

        } catch (Exception e) {
            System.err.println("Error saving merchant message: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to save merchant message: " + e.getMessage());
        }
    }

    /**
     * Save admin broadcast message to all users
     */
    public MessageBoardDTO saveAdminBroadcastMessage(String adminEmail, String message,
                                                     String subject, String role, String adminName) {
        try {
            MessageBoard messageBoard = new MessageBoard();
            messageBoard.setEmail(adminEmail);
            messageBoard.setMessage(message);
            messageBoard.setSubject(subject);
            messageBoard.setRole(role);

            // Mark as read by the admin who sent it
            messageBoard.setIsRead(true);
            messageBoard.setReadBy(adminEmail);
            messageBoard.setReadAt(LocalDateTime.now());

            MessageBoard savedMessage = messageBoardRepository.save(messageBoard);

            System.out.println("Admin broadcast message saved successfully:");
            System.out.println("- ID: " + savedMessage.getId());
            System.out.println("- Subject: " + subject);
            System.out.println("- Role: " + role);
            System.out.println("- Admin: " + adminName + " (" + adminEmail + ")");

            return convertToDTO(savedMessage);

        } catch (Exception e) {
            System.err.println("Error saving admin broadcast message: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to save admin broadcast message: " + e.getMessage());
        }
    }

    // ============================================================================
    // HELPER METHODS
    // ============================================================================

    /**
     * Convert MessageBoard entity to DTO (with file data)
     */
    private MessageBoardDTO convertToDTO(MessageBoard messageBoard) {
        MessageBoardDTO dto = new MessageBoardDTO();
        dto.setId(messageBoard.getId());
        dto.setEmail(messageBoard.getEmail());
        dto.setMessage(messageBoard.getMessage());
        dto.setSubject(messageBoard.getSubject());
        dto.setRole(messageBoard.getRole());
        dto.setFileName(messageBoard.getFileName());
        dto.setFileType(messageBoard.getFileType());
        dto.setFileSize(messageBoard.getFileSize());

        if (messageBoard.getCreatedAt() != null) {
            dto.setCreatedAt(messageBoard.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        }

        return dto;
    }

    /**
     * Convert MessageBoard entity to DTO including read status (without file data for list views)
     */
    private MessageBoardDTO convertToDTOWithReadStatus(MessageBoard messageBoard) {
        MessageBoardDTO dto = new MessageBoardDTO();
        dto.setId(messageBoard.getId());
        dto.setEmail(messageBoard.getEmail());
        dto.setMessage(messageBoard.getMessage());
        dto.setSubject(messageBoard.getSubject());
        dto.setRole(messageBoard.getRole());
        dto.setFileName(messageBoard.getFileName());
        dto.setFileType(messageBoard.getFileType());
        dto.setFileSize(messageBoard.getFileSize());

        // Add read status information
        dto.setIsRead(messageBoard.getIsRead());
        dto.setReadBy(messageBoard.getReadBy());

        if (messageBoard.getCreatedAt() != null) {
            dto.setCreatedAt(messageBoard.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        }

        if (messageBoard.getReadAt() != null) {
            dto.setReadAt(messageBoard.getReadAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        }

        return dto;
    }

    /**
     * Convert MessageBoard entity to DTO (without file data for list views) - backward compatibility
     */
    private MessageBoardDTO convertToDTOWithoutFileData(MessageBoard messageBoard) {
        return convertToDTOWithReadStatus(messageBoard);
    }
    /**
     * Get received messages by role (admin_to_donor and merchant_to_donor)
     * NO donor ID filtering
     */
    public List<MessageBoardDTO> getDonorReceivedMessages() {
        try {
            List<MessageBoard> messages = messageBoardRepository.findReceivedMessagesByRole();
            System.out.println("Found " + messages.size() + " received messages by role");
            return messages.stream()
                    .map(this::convertToDTOWithReadStatus)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error fetching received messages by role: " + e.getMessage());
            e.printStackTrace();
            return List.of();
        }
    }

    /**
     * Get sent messages by role (donor_to_admin)
     * NO donor ID filtering
     */
    public List<MessageBoardDTO> getDonorSentMessages() {
        try {
            List<MessageBoard> messages = messageBoardRepository.findSentMessagesByRole();
            System.out.println("Found " + messages.size() + " sent messages by role");
            return messages.stream()
                    .map(this::convertToDTOWithReadStatus)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error fetching sent messages by role: " + e.getMessage());
            e.printStackTrace();
            return List.of();
        }
    }

    /**
     * Mark a received message as read (role-based)
     * NO donor ID validation
     */
    public boolean markMessageAsReadByRole(Long messageId) {
        try {
            MessageBoard message = messageBoardRepository.findReceivedMessageByIdAndRole(messageId);
            if (message != null) {
                if (!message.getIsRead()) {
                    message.setIsRead(true);
                    message.setReadAt(LocalDateTime.now());
                    message.setReadBy("Donor:role-based");
                    messageBoardRepository.save(message);
                    System.out.println("Message " + messageId + " marked as read (role-based)");
                }
                return true;
            }
            return false;
        } catch (Exception e) {
            System.err.println("Error marking message as read by role: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Delete a sent message (role-based)
     * NO donor ID validation
     */
    public boolean deleteDonorSentMessageByRole(Long messageId) {
        try {
            MessageBoard message = messageBoardRepository.findSentMessageByIdAndRole(messageId);
            if (message != null) {
                messageBoardRepository.delete(message);
                System.out.println("Sent message " + messageId + " deleted (role-based)");
                return true;
            }
            return false;
        } catch (Exception e) {
            System.err.println("Error deleting sent message by role: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Get message statistics (role-based)
     * NO donor ID filtering
     */
    public Map<String, Object> getDonorMessageStatsByRole() {
        try {
            Map<String, Object> stats = new HashMap<>();

            // Count sent messages
            long sentMessages = messageBoardRepository.countSentMessagesByRole();

            // Count received messages
            long receivedMessages = messageBoardRepository.countReceivedMessagesByRole();

            // Count unread received messages
            long unreadMessages = messageBoardRepository.countUnreadReceivedMessagesByRole();

            // Count read received messages
            long readMessages = receivedMessages - unreadMessages;

            stats.put("totalSentMessages", sentMessages);
            stats.put("totalReceivedMessages", receivedMessages);
            stats.put("unreadMessages", unreadMessages);
            stats.put("readMessages", readMessages);

            System.out.println("Role-based stats: " + stats);
            return stats;
        } catch (Exception e) {
            System.err.println("Error fetching message stats by role: " + e.getMessage());
            e.printStackTrace();
            return new HashMap<>();
        }
    }

    /**
     * Save message from donor to admin (role-based)
     * Still stores donorId for reference but doesn't filter by it
     */
    public MessageBoardDTO saveDonorMessageByRole(String email, String message, String subject,
                                                  String role, MultipartFile attachment, Long donorId) {
        try {
            MessageBoard messageBoard = new MessageBoard();
            messageBoard.setEmail(email);
            messageBoard.setMessage(message);
            messageBoard.setSubject(subject);
            messageBoard.setRole(role);
            messageBoard.setDonorId(donorId); // Still store for reference

            // Handle file attachment if present
            if (attachment != null && !attachment.isEmpty()) {
                messageBoard.setFileName(attachment.getOriginalFilename());
                messageBoard.setFileType(attachment.getContentType());
                messageBoard.setFileSize(attachment.getSize());
                messageBoard.setFileData(attachment.getBytes());

                System.out.println("File attached to donor message: " + attachment.getOriginalFilename() +
                        " (" + attachment.getSize() + " bytes)");
            }

            MessageBoard savedMessage = messageBoardRepository.save(messageBoard);
            System.out.println("Donor message saved successfully (role-based):");
            System.out.println("- ID: " + savedMessage.getId());
            System.out.println("- Subject: " + subject);
            System.out.println("- Role: " + role);
            System.out.println("- Email: " + email);

            return convertToDTO(savedMessage);

        } catch (Exception e) {
            System.err.println("Error saving donor message by role: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to save donor message: " + e.getMessage());
        }
    }
}