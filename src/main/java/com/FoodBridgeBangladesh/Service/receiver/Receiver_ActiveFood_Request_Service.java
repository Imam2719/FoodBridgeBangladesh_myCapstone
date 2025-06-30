package com.FoodBridgeBangladesh.Service.receiver;

import com.FoodBridgeBangladesh.Model.User;
import com.FoodBridgeBangladesh.Model.donor.Donation;
import com.FoodBridgeBangladesh.Model.dto.DonationFormDTO;
import com.FoodBridgeBangladesh.Model.dto.Receiver_ActiveFood_Request_DTO;
import com.FoodBridgeBangladesh.Model.dto.Receiver_ActiveFood_Request_StatusDTO;
import com.FoodBridgeBangladesh.Model.receiver.Receiver_ActiveFood_Request_Model;
import com.FoodBridgeBangladesh.Repository.UserRepository;
import com.FoodBridgeBangladesh.Repository.receiver.Receiver_ActiveFood_Request_Repository;
import com.FoodBridgeBangladesh.Service.donor.DonationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class Receiver_ActiveFood_Request_Service {

    private static final Logger logger = LoggerFactory.getLogger(Receiver_ActiveFood_Request_Service.class);

    @Autowired
    private Receiver_ActiveFood_Request_Repository requestRepository;

    @Autowired
    private DonationService donationService;

    @Autowired
    private UserRepository userRepository;



    /**
     * Create a new food request
     */
    @Transactional
    public Receiver_ActiveFood_Request_Model createRequest(Long donationId, Long receiverId, Integer quantity, String note, String pickupMethod) {
        logger.info("Creating new food request for donation ID: {} by receiver ID: {}", donationId, receiverId);

        // Check if donation exists and is active
        Donation donation = donationService.getDonationById(donationId);
        if (!"Active".equals(donation.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "This donation is no longer active and cannot be requested");
        }

        // Check if the user has already requested this donation
        if (requestRepository.existsByDonationIdAndReceiverId(donationId, receiverId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "You have already requested this donation");
        }

        // Create new request
        Receiver_ActiveFood_Request_Model request = new Receiver_ActiveFood_Request_Model();
        request.setDonationId(donationId);
        request.setReceiverId(receiverId);
        request.setQuantity(quantity);
        request.setNote(note);
        request.setPickupMethod(pickupMethod); // Save the pickup method
        request.setRequestDate(LocalDateTime.now());
        request.setStatus("PENDING");

        return requestRepository.save(request);
    }

    /**
     * Get all requests for a specific donation
     */
    @Transactional(readOnly = true)
    public List<Receiver_ActiveFood_Request_DTO> getRequestsByDonationId(Long donationId, Long donorId) {
        logger.info("Getting all requests for donation ID: {}", donationId);

        // Verify that the donor owns the donation
        Donation donation = donationService.getDonationById(donationId, donorId);

        List<Receiver_ActiveFood_Request_Model> requests = requestRepository.findByDonationIdOrderByRequestDateDesc(donationId);

        return requests.stream().map(request -> convertToDTO(request, donation)).collect(Collectors.toList());
    }

    /**
     * Get requests by donation ID and status
     */
    @Transactional(readOnly = true)
    public List<Receiver_ActiveFood_Request_DTO> getRequestsByDonationIdAndStatus(Long donationId, String status, Long donorId) {
        logger.info("Getting {} requests for donation ID: {}", status, donationId);

        // Verify that the donor owns the donation
        Donation donation = donationService.getDonationById(donationId, donorId);

        List<Receiver_ActiveFood_Request_Model> requests = requestRepository.findByDonationIdAndStatusOrderByRequestDateDesc(donationId, status);

        return requests.stream().map(request -> convertToDTO(request, donation)).collect(Collectors.toList());
    }

    /**
     * Get all requests made by a receiver
     */
    @Transactional(readOnly = true)
    public List<Receiver_ActiveFood_Request_DTO> getRequestsByReceiverId(Long receiverId) {
        logger.info("Getting all requests for receiver ID: {}", receiverId);

        List<Receiver_ActiveFood_Request_Model> requests = requestRepository.findByReceiverIdOrderByRequestDateDesc(receiverId);
        List<Receiver_ActiveFood_Request_DTO> dtoList = new ArrayList<>();

        for (Receiver_ActiveFood_Request_Model request : requests) {
            try {
                Donation donation = donationService.getDonationById(request.getDonationId());
                dtoList.add(convertToDTO(request, donation));
            } catch (Exception e) {
                // If donation no longer exists, create DTO with partial information
                Receiver_ActiveFood_Request_DTO dto = new Receiver_ActiveFood_Request_DTO();
                dto.setId(request.getId());
                dto.setDonationId(request.getDonationId());
                dto.setRequestDate(request.getRequestDate());
                dto.setQuantity(request.getQuantity());
                dto.setNote(request.getNote());
                dto.setPickupMethod(request.getPickupMethod()); // Include pickup method
                dto.setStatus(request.getStatus());
                dto.setResponseDate(request.getResponseDate());
                dto.setResponseNote(request.getResponseNote());
                dto.setFoodName("(Deleted Donation)");
                dtoList.add(dto);
            }
        }

        return dtoList;
    }

    /**
     * Update request status (for donors to accept/reject)
     */
    @Transactional
    public Receiver_ActiveFood_Request_DTO updateRequestStatus(
            Long requestId, Receiver_ActiveFood_Request_StatusDTO statusDTO, Long donorId) {

        logger.info("Updating request ID: {} status to: {}", requestId, statusDTO.getStatus());

        Receiver_ActiveFood_Request_Model request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Request not found with ID: " + requestId));

        // Verify that the donor owns the donation
        Donation donation = donationService.getDonationById(request.getDonationId(), donorId);

        // Update status
        request.setStatus(statusDTO.getStatus());
        request.setResponseDate(LocalDateTime.now());
        request.setResponseNote(statusDTO.getResponseNote());

        // If the request is accepted, update the donation quantity
        if ("ACCEPTED".equals(statusDTO.getStatus())) {
            // Parse the current quantity as integer (assuming it's stored as string like "10 meals")
            String currentQuantityStr = donation.getQuantity();
            int currentQuantity = 0;

            try {
                // Extract numeric part from string like "10 meals"
                String numericPart = currentQuantityStr.replaceAll("[^0-9]", "");
                currentQuantity = Integer.parseInt(numericPart);
            } catch (Exception e) {
                logger.warn("Could not parse quantity: {}", currentQuantityStr);
            }

            // Calculate remaining quantity after this acceptance
            int remainingQuantity = Math.max(0, currentQuantity - request.getQuantity());

            // Update the donation quantity
            donation.setQuantity(remainingQuantity + " meals");

            // Handle IOException by wrapping in try-catch
            try {
                donationService.updateDonation(donation.getId(), convertToFormDTO(donation), null, donorId);
            } catch (IOException e) {
                logger.error("Error updating donation quantity: {}", e.getMessage());
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                        "Failed to update donation quantity: " + e.getMessage());
            }
        }

        Receiver_ActiveFood_Request_Model updatedRequest = requestRepository.save(request);
        Receiver_ActiveFood_Request_DTO dto = convertToDTO(updatedRequest, donation);

        // Add remaining quantity to DTO
        try {
            String currentQuantityStr = donation.getQuantity();
            String numericPart = currentQuantityStr.replaceAll("[^0-9]", "");
            int remainingQuantity = Integer.parseInt(numericPart);
            dto.setRemainingQuantity(remainingQuantity);
        } catch (Exception e) {
            logger.warn("Could not parse remaining quantity: {}", donation.getQuantity());
        }

        return dto;
    }

    // Helper method to convert Donation to DonationFormDTO
    private DonationFormDTO convertToFormDTO(Donation donation) {
        DonationFormDTO dto = new DonationFormDTO();
        // Set necessary fields
        dto.setQuantity(donation.getQuantity());
        // Set other fields as needed
        return dto;
    }

    /**
     * Get request queue position for a user
     */
    public int getRequestQueuePosition(Long donationId, Long receiverId) {
        // Get all pending requests for this donation sorted by request date
        List<Receiver_ActiveFood_Request_Model> pendingRequests =
                requestRepository.findByDonationIdAndStatusOrderByRequestDateDesc(donationId, "PENDING");

        // Find the position of the user's request in the queue
        for (int i = 0; i < pendingRequests.size(); i++) {
            if (pendingRequests.get(i).getReceiverId().equals(receiverId)) {
                // Return 1-based position (first in queue = position 1)
                return i + 1;
            }
        }

        // If not found, return -1
        return -1;
    }

    /**
     * Cancel a request (for receivers to cancel their requests)
     */
    @Transactional
    public void cancelRequest(Long requestId, Long receiverId) {
        logger.info("Cancelling request ID: {} by receiver ID: {}", requestId, receiverId);

        Receiver_ActiveFood_Request_Model request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Request not found with ID: " + requestId));

        // Verify that the receiver owns the request
        if (!request.getReceiverId().equals(receiverId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "You do not have permission to cancel this request");
        }

        // Only allow cancellation of pending requests
        if (!"PENDING".equals(request.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Only pending requests can be cancelled");
        }

        // Set status to CANCELLED
        request.setStatus("CANCELLED");
        request.setResponseDate(LocalDateTime.now());
        requestRepository.save(request);
    }

    /**
     * Mark a request as completed (for receivers/donors when food pickup is complete)
     */
    @Transactional
    public void completeRequest(Long requestId, Long userId, boolean isDonor) {
        logger.info("Marking request ID: {} as completed by user ID: {}", requestId, userId);

        Receiver_ActiveFood_Request_Model request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Request not found with ID: " + requestId));

        // Verify permission based on user role
        if (isDonor) {
            // Check if the user is the donor of this donation
            Donation donation = donationService.getDonationById(request.getDonationId());
            if (!donation.getDonorId().equals(userId)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "You do not have permission to complete this request");
            }
        } else {
            // Check if the user is the receiver who made the request
            if (!request.getReceiverId().equals(userId)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "You do not have permission to complete this request");
            }
        }

        // Only allow completion of accepted requests
        if (!"ACCEPTED".equals(request.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Only accepted requests can be marked as completed");
        }

        // Set status to COMPLETED
        request.setStatus("COMPLETED");
        request.setResponseDate(LocalDateTime.now());
        requestRepository.save(request);

        // Check if all requests for this donation are completed
        // If yes, update donation status to COMPLETED
        // This should be handled in a more robust way in a real application
    }
    /**
     * Get recently accepted requests for a receiver with comprehensive details
     */
    @Transactional(readOnly = true)
    public List<Receiver_ActiveFood_Request_DTO> getRecentAcceptedRequests(Long receiverId, LocalDateTime since) {
        logger.info("Getting recent accepted requests for receiver ID: {}", receiverId);

        List<Receiver_ActiveFood_Request_Model> requests =
                requestRepository.findByReceiverIdAndStatusAndResponseDateBetween(
                        receiverId, "ACCEPTED", since, LocalDateTime.now());

        List<Receiver_ActiveFood_Request_DTO> dtoList = new ArrayList<>();

        for (Receiver_ActiveFood_Request_Model request : requests) {
            try {
                Donation donation = donationService.getDonationById(request.getDonationId());
                Receiver_ActiveFood_Request_DTO dto = convertToDTO(request, donation);

                // Enhance DTO with additional details
                Optional<User> receiverOpt = userRepository.findById(request.getReceiverId());
                Optional<User> donorOpt = userRepository.findById(donation.getDonorId());

                if (receiverOpt.isPresent()) {
                    User receiver = receiverOpt.get();
                    dto.setReceiverName(receiver.getFirstName() + " " + receiver.getLastName());
                    dto.setReceiverPhone(receiver.getPhone());
                    dto.setReceiverAddress(receiver.getAddress());
                }

                if (donorOpt.isPresent()) {
                    User donor = donorOpt.get();
                    dto.setDonorName(donor.getFirstName() + " " + donor.getLastName());
                    dto.setDonorContact(donor.getPhone());
                }

                // Add pickup location from donation
                dto.setPickupLocation(donation.getLocation());

                dtoList.add(dto);
            } catch (Exception e) {
                // Create basic DTO if donation no longer exists
                Receiver_ActiveFood_Request_DTO dto = new Receiver_ActiveFood_Request_DTO();
                dto.setId(request.getId());
                dto.setDonationId(request.getDonationId());
                dto.setStatus("ACCEPTED");
                dto.setResponseDate(request.getResponseDate());
                dto.setResponseNote(request.getResponseNote());
                dto.setFoodName("(Deleted Donation)");
                dtoList.add(dto);
            }
        }

        return dtoList;
    }
    /**
     * Convert request model to DTO with enhanced details
     */
    private Receiver_ActiveFood_Request_DTO convertToDTO(Receiver_ActiveFood_Request_Model request, Donation donation) {
        Receiver_ActiveFood_Request_DTO dto = new Receiver_ActiveFood_Request_DTO();
        dto.setId(request.getId());
        dto.setDonationId(request.getDonationId());
        dto.setReceiverId(request.getReceiverId());
        dto.setRequestDate(request.getRequestDate());
        dto.setQuantity(request.getQuantity());
        dto.setNote(request.getNote());
        dto.setPickupMethod(request.getPickupMethod());
        dto.setStatus(request.getStatus());
        dto.setResponseDate(request.getResponseDate());
        dto.setResponseNote(request.getResponseNote());

        // Add donation details
        if (donation != null) {
            dto.setFoodName(donation.getFoodName());
            dto.setFoodCategory(donation.getCategory() != null ? donation.getCategory().getLabel() : null);
            dto.setFoodImageData(donation.getImageData());
            dto.setFoodImageContentType(donation.getImageContentType());
            dto.setPickupLocation(donation.getLocation());
        }

        // Add receiver information
        try {
            Optional<User> receiverOpt = userRepository.findById(request.getReceiverId());
            if (receiverOpt.isPresent()) {
                User receiver = receiverOpt.get();
                dto.setReceiverName(receiver.getFirstName() + " " + receiver.getLastName());
                dto.setReceiverPhone(receiver.getPhone());
                dto.setReceiverAddress(receiver.getAddress());
            }
        } catch (Exception e) {
            logger.warn("Could not load receiver information for ID: {}", request.getReceiverId());
        }

        // Add donor information
        try {
            if (donation != null) {
                Optional<User> donorOpt = userRepository.findById(donation.getDonorId());
                if (donorOpt.isPresent()) {
                    User donor = donorOpt.get();
                    dto.setDonorName(donor.getFirstName() + " " + donor.getLastName());
                    dto.setDonorContact(donor.getPhone());
                }
            }
        } catch (Exception e) {
            logger.warn("Could not load donor information for donation ID: {}", donation != null ? donation.getId() : "null");
        }

        return dto;
    }
    // Add this method in the Receiver_ActiveFood_Request_Service class
    private void enrichDTOWithUserDetails(
            Receiver_ActiveFood_Request_DTO dto,
            Receiver_ActiveFood_Request_Model request,
            Donation donation) {

        try {
            // Add receiver details
            Optional<User> receiverOpt = userRepository.findById(request.getReceiverId());
            if (receiverOpt.isPresent()) {
                User receiver = receiverOpt.get();
                dto.setReceiverName(receiver.getFirstName() + " " + receiver.getLastName());
                dto.setReceiverPhone(receiver.getPhone());
                dto.setReceiverAddress(receiver.getAddress());
            }

            // Add donor details
            if (donation != null) {
                Optional<User> donorOpt = userRepository.findById(donation.getDonorId());
                if (donorOpt.isPresent()) {
                    User donor = donorOpt.get();
                    dto.setDonorName(donor.getFirstName() + " " + donor.getLastName());
                    dto.setDonorContact(donor.getPhone());
                }

                // Add pickup location from donation
                dto.setPickupLocation(donation.getLocation());
            }
        } catch (Exception e) {
            logger.warn("Error enriching DTO with user details: {}", e.getMessage());
        }
    }
    @Transactional(readOnly = true)
    public List<Receiver_ActiveFood_Request_DTO> getRecentRequests(Long receiverId, LocalDateTime since) {
        List<Receiver_ActiveFood_Request_Model> requests =
                requestRepository.findByReceiverIdAndStatusInAndResponseDateBetween(
                        receiverId,
                        Arrays.asList("ACCEPTED", "REJECTED"),
                        since,
                        LocalDateTime.now()
                );

        return requests.stream()
                .map(request -> {
                    try {
                        Donation donation = donationService.getDonationById(request.getDonationId());
                        Receiver_ActiveFood_Request_DTO dto = convertToDTO(request, donation);

                        // Enhance DTO with additional user details
                        enrichDTOWithUserDetails(dto, request, donation);

                        return dto;
                    } catch (Exception e) {
                        // Handle case where donation might be deleted
                        Receiver_ActiveFood_Request_DTO dto = new Receiver_ActiveFood_Request_DTO();
                        dto.setId(request.getId());
                        dto.setStatus(request.getStatus());
                        dto.setResponseDate(request.getResponseDate());
                        dto.setFoodName("(Deleted Donation)");
                        return dto;
                    }
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Receiver_ActiveFood_Request_DTO> getMerchantDonationRequests(Long donationId, Long merchantId) {
        try {
            logger.info("getMerchantDonationRequests - donationId: {}, merchantId: {}", donationId, merchantId);

            Donation donation;
            try {

                donation = donationService.getDonationById(donationId);
            } catch (Exception e) {
                logger.error("Error fetching donation: {}", e.getMessage());
                return new ArrayList<>();
            }

            boolean isAuthorized = donation.getDonorId().equals(merchantId) ||
                    "MERCHANT".equalsIgnoreCase(donation.getDonorRole());

            if (!isAuthorized) {
                logger.warn("Permission denied - donation donorId: {}, merchantId: {}, role: '{}'",
                        donation.getDonorId(), merchantId, donation.getDonorRole());
                return new ArrayList<>();
            }

            List<Receiver_ActiveFood_Request_Model> requests =
                    requestRepository.findByDonationIdOrderByRequestDateDesc(donationId);

            logger.info("Found {} requests for donation ID: {}", requests.size(), donationId);

            return requests.stream()
                    .map(request -> convertToDTO(request, donation))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error in getMerchantDonationRequests: ", e);
            return new ArrayList<>(); // Return empty list on error
        }
    }
}