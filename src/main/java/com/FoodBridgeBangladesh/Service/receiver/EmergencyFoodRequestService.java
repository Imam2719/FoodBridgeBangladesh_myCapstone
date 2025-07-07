package com.FoodBridgeBangladesh.Service.receiver;

import com.FoodBridgeBangladesh.Model.receiver.EmergencyFoodRequest;
import com.FoodBridgeBangladesh.Model.receiver.EmergencyFoodRequest.FoodCategory;
import com.FoodBridgeBangladesh.Model.receiver.EmergencyFoodRequest.RequestStatus;
import com.FoodBridgeBangladesh.Model.receiver.EmergencyFoodRequest.UrgencyLevel;
import com.FoodBridgeBangladesh.Repository.receiver.EmergencyFoodRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class EmergencyFoodRequestService {

    @Autowired
    private EmergencyFoodRequestRepository emergencyRepository;

    @Autowired
    private JavaMailSender mailSender;

    // Create emergency request
    public EmergencyFoodRequest createEmergencyRequest(EmergencyFoodRequest request, MultipartFile imageFile) throws IOException {
        // Handle image upload if provided
        if (imageFile != null && !imageFile.isEmpty()) {
            validateImageFile(imageFile);
            request.setImageData(imageFile.getBytes());
            request.setImageContentType(imageFile.getContentType());
            request.setImageFilename(imageFile.getOriginalFilename());
        }

        // Set default values
        request.setRequestDate(LocalDateTime.now());
        request.setStatus(RequestStatus.PENDING);
        request.setIsFulfilled(false);

        // Save the request
        EmergencyFoodRequest savedRequest = emergencyRepository.save(request);

        // Send notification emails for urgent requests
        if (savedRequest.isUrgent()) {
            sendUrgentRequestNotification(savedRequest);
        }

        return savedRequest;
    }

    // Get all emergency requests with pagination
    public Page<EmergencyFoodRequest> getAllEmergencyRequests(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return emergencyRepository.findAllPendingRequestsByPriority(pageable);
    }

    // Get emergency requests by user
    public List<EmergencyFoodRequest> getRequestsByUser(Long userId) {
        return emergencyRepository.findByUserIdOrderByRequestDateDesc(userId);
    }

    // Get emergency requests by user with pagination
    public Page<EmergencyFoodRequest> getRequestsByUser(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return emergencyRepository.findByUserIdOrderByRequestDateDesc(userId, pageable);
    }

    // Get emergency request by ID
    public Optional<EmergencyFoodRequest> getRequestById(Long id) {
        return emergencyRepository.findById(id);
    }

    // Get pending requests by priority
    public List<EmergencyFoodRequest> getPendingRequestsByPriority() {
        return emergencyRepository.findAllPendingRequestsByPriority();
    }

    // Get urgent pending requests
    public List<EmergencyFoodRequest> getUrgentPendingRequests() {
        return emergencyRepository.findUrgentPendingRequests();
    }

    // Get requests by status
    public List<EmergencyFoodRequest> getRequestsByStatus(RequestStatus status) {
        return emergencyRepository.findByStatusOrderByPriorityScoreDescRequestDateAsc(status);
    }

    // Get requests by urgency level
    public List<EmergencyFoodRequest> getRequestsByUrgency(UrgencyLevel urgency) {
        return emergencyRepository.findByUrgencyOrderByRequestDateAsc(urgency);
    }

    // Get requests by category
    public List<EmergencyFoodRequest> getRequestsByCategory(FoodCategory category) {
        return emergencyRepository.findByCategoryOrderByPriorityScoreDescRequestDateAsc(category);
    }

    // Get requests by location
    public List<EmergencyFoodRequest> getRequestsByLocation(String location) {
        return emergencyRepository.findPendingRequestsByLocation(location);
    }

    // Update request status
    public EmergencyFoodRequest updateRequestStatus(Long requestId, RequestStatus newStatus,
                                                    String responseNote, Long responderId,
                                                    String responderName, String responderContact) {
        Optional<EmergencyFoodRequest> optionalRequest = emergencyRepository.findById(requestId);

        if (optionalRequest.isPresent()) {
            EmergencyFoodRequest request = optionalRequest.get();
            RequestStatus oldStatus = request.getStatus();

            request.setStatus(newStatus);
            request.setResponseDate(LocalDateTime.now());
            request.setResponseNote(responseNote);
            request.setResponderId(responderId);
            request.setResponderName(responderName);
            request.setResponderContact(responderContact);

            // Set fulfillment status and date
            if (newStatus == RequestStatus.FULFILLED) {
                request.setIsFulfilled(true);
                request.setFulfillmentDate(LocalDateTime.now());
            }

            EmergencyFoodRequest updatedRequest = emergencyRepository.save(request);

            // Send status update notification
            sendStatusUpdateNotification(updatedRequest, oldStatus);

            return updatedRequest;
        }

        throw new RuntimeException("Emergency request not found with ID: " + requestId);
    }

    // Mark request as fulfilled
    public EmergencyFoodRequest markAsFulfilled(Long requestId, String fulfillmentNote) {
        return updateRequestStatus(requestId, RequestStatus.FULFILLED, fulfillmentNote, null, null, null);
    }

    // Cancel request
    public EmergencyFoodRequest cancelRequest(Long requestId, Long userId) {
        Optional<EmergencyFoodRequest> optionalRequest = emergencyRepository.findById(requestId);

        if (optionalRequest.isPresent()) {
            EmergencyFoodRequest request = optionalRequest.get();

            // Verify ownership
            if (!request.getUserId().equals(userId)) {
                throw new RuntimeException("User not authorized to cancel this request");
            }

            request.setStatus(RequestStatus.CANCELLED);
            request.setResponseDate(LocalDateTime.now());
            request.setResponseNote("Cancelled by user");

            return emergencyRepository.save(request);
        }

        throw new RuntimeException("Emergency request not found with ID: " + requestId);
    }

    // Get user statistics
    public Map<String, Object> getUserStatistics(Long userId) {
        Map<String, Object> stats = new HashMap<>();

        List<EmergencyFoodRequest> userRequests = getRequestsByUser(userId);

        long totalRequests = userRequests.size();
        long pendingRequests = userRequests.stream().filter(r -> r.getStatus() == RequestStatus.PENDING).count();
        long approvedRequests = userRequests.stream().filter(r -> r.getStatus() == RequestStatus.APPROVED).count();
        long fulfilledRequests = userRequests.stream().filter(r -> r.getStatus() == RequestStatus.FULFILLED).count();
        long rejectedRequests = userRequests.stream().filter(r -> r.getStatus() == RequestStatus.REJECTED).count();

        stats.put("totalRequests", totalRequests);
        stats.put("pendingRequests", pendingRequests);
        stats.put("approvedRequests", approvedRequests);
        stats.put("fulfilledRequests", fulfilledRequests);
        stats.put("rejectedRequests", rejectedRequests);
        stats.put("activeRequests", pendingRequests + approvedRequests);

        // Recent requests (last 7 days)
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<EmergencyFoodRequest> recentRequests = emergencyRepository.findRecentRequestsByUser(userId, sevenDaysAgo);
        stats.put("recentRequests", recentRequests.size());

        return stats;
    }
    public Map<String, Object> getAdminStatistics() {
        Map<String, Object> stats = new HashMap<>();

        // Basic counts
        stats.put("totalRequests", emergencyRepository.count());
        stats.put("pendingRequests", emergencyRepository.countByStatus(RequestStatus.PENDING));
        stats.put("approvedRequests",
                emergencyRepository.countByStatus(RequestStatus.APPROVED) +
                        emergencyRepository.countByStatus(RequestStatus.IN_PROGRESS) +
                        emergencyRepository.countByStatus(RequestStatus.FULFILLED)
        );
        stats.put("fulfilledRequests", emergencyRepository.countByStatus(RequestStatus.FULFILLED));
        stats.put("rejectedRequests",
                emergencyRepository.countByStatus(RequestStatus.REJECTED) +
                        emergencyRepository.countByStatus(RequestStatus.CANCELLED)
        );
        stats.put("urgentRequests", emergencyRepository.countUrgentPendingRequests());

        // Overdue requests count
        List<EmergencyFoodRequest> overdueRequests = getOverdueRequests();
        stats.put("overdueRequests", overdueRequests.size());

        return stats;
    }

    // Search requests
    public List<EmergencyFoodRequest> searchRequests(String searchTerm, RequestStatus status) {
        if (status != null) {
            return emergencyRepository.searchRequestsByTitleOrDescription(searchTerm, status);
        } else {
            return emergencyRepository.searchRequestsByTitleOrDescription(searchTerm, RequestStatus.PENDING);
        }
    }

    // Get overdue requests
    public List<EmergencyFoodRequest> getOverdueRequests() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime criticalThreshold = now.minusHours(2); // Critical requests overdue after 2 hours
        LocalDateTime highThreshold = now.minusHours(8);     // High priority overdue after 8 hours
        LocalDateTime mediumThreshold = now.minusHours(24);  // Medium priority overdue after 24 hours

        return emergencyRepository.findOverdueRequests(criticalThreshold, highThreshold, mediumThreshold);
    }

    // Get active requests by user
    public List<EmergencyFoodRequest> getActiveRequestsByUser(Long userId) {
        return emergencyRepository.findActiveRequestsByUser(userId);
    }

    // Check if user can make new request (rate limiting)
    public boolean canUserMakeNewRequest(Long userId) {
        LocalDateTime oneDayAgo = LocalDateTime.now().minusDays(1);
        List<EmergencyFoodRequest> recentRequests = emergencyRepository.findRecentRequestsByUser(userId, oneDayAgo);

        // Allow max 3 emergency requests per day
        return recentRequests.size() < 3;
    }

    // Validate image file
    private void validateImageFile(MultipartFile file) throws IOException {
        // Check file size (max 10MB)
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IOException("File size exceeds maximum limit of 10MB");
        }

        // Check file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IOException("Only image files are allowed");
        }

        // Additional security check for file extension
        String filename = file.getOriginalFilename();
        if (filename != null) {
            String extension = filename.toLowerCase().substring(filename.lastIndexOf(".") + 1);
            Set<String> allowedExtensions = Set.of("jpg", "jpeg", "png", "gif", "webp");
            if (!allowedExtensions.contains(extension)) {
                throw new IOException("File type not supported. Please upload JPG, PNG, GIF, or WebP images.");
            }
        }
    }

    // Send urgent request notification
    private void sendUrgentRequestNotification(EmergencyFoodRequest request) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo("admin@foodbridgebd.com"); // Admin email
            message.setSubject("🚨 URGENT Emergency Food Request - " + request.getUrgency().name());

            String emailBody = String.format(
                    "URGENT Emergency Food Request Alert\n\n" +
                            "Request ID: %d\n" +
                            "Title: %s\n" +
                            "Urgency: %s\n" +
                            "People Count: %d\n" +
                            "Location: %s\n" +
                            "Category: %s\n" +
                            "Description: %s\n" +
                            "Requester: %s (%s)\n" +
                            "Request Time: %s\n\n" +
                            "Please review and respond to this emergency request immediately.\n\n" +
                            "FoodBridge Bangladesh\nEmergency Response System",
                    request.getId(),
                    request.getTitle(),
                    request.getUrgency().getDisplayName(),
                    request.getPeopleCount(),
                    request.getLocation(),
                    request.getCategory().getDisplayName(),
                    request.getDescription(),
                    request.getRequesterName(),
                    request.getRequesterEmail(),
                    request.getRequestDate()
            );

            message.setText(emailBody);
            mailSender.send(message);
        } catch (Exception e) {
            // Log error but don't fail the request creation
            System.err.println("Failed to send urgent request notification: " + e.getMessage());
        }
    }

    // Send status update notification
    private void sendStatusUpdateNotification(EmergencyFoodRequest request, RequestStatus oldStatus) {
        try {
            if (request.getRequesterEmail() == null || request.getRequesterEmail().isEmpty()) {
                return;
            }

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(request.getRequesterEmail());
            message.setSubject("Emergency Food Request Update - " + request.getStatus().getDisplayName());

            String emailBody = String.format(
                    "Dear %s,\n\n" +
                            "Your emergency food request has been updated.\n\n" +
                            "Request Details:\n" +
                            "- Request ID: %d\n" +
                            "- Title: %s\n" +
                            "- Previous Status: %s\n" +
                            "- New Status: %s\n" +
                            "- Update Time: %s\n\n" +
                            "%s\n\n" +
                            "%s\n\n" +
                            "Thank you for using FoodBridge Bangladesh.\n\n" +
                            "Best regards,\n" +
                            "FoodBridge Bangladesh Team",
                    request.getRequesterName(),
                    request.getId(),
                    request.getTitle(),
                    oldStatus.getDisplayName(),
                    request.getStatus().getDisplayName(),
                    request.getResponseDate(),
                    request.getResponseNote() != null ? "Response Note: " + request.getResponseNote() : "",
                    request.getResponderContact() != null ?
                            "Responder Contact: " + request.getResponderContact() : ""
            );

            message.setText(emailBody);
            mailSender.send(message);
        } catch (Exception e) {
            // Log error but don't fail the status update
            System.err.println("Failed to send status update notification: " + e.getMessage());
        }
    }
    /**
     * Delete emergency request by ID
     */
    public void deleteEmergencyRequest(Long requestId) {
        Optional<EmergencyFoodRequest> optionalRequest = emergencyRepository.findById(requestId);

        if (optionalRequest.isPresent()) {
            emergencyRepository.deleteById(requestId);
        } else {
            throw new RuntimeException("Emergency request not found with ID: " + requestId);
        }
    }

}