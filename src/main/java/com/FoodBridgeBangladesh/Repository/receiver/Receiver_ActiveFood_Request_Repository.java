package com.FoodBridgeBangladesh.Repository.receiver;

import com.FoodBridgeBangladesh.Model.receiver.Receiver_ActiveFood_Request_Model;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface Receiver_ActiveFood_Request_Repository extends JpaRepository<Receiver_ActiveFood_Request_Model, Long> {

    // Find all requests by donation ID
    List<Receiver_ActiveFood_Request_Model> findByDonationIdOrderByRequestDateDesc(Long donationId);

    // Find all requests by receiver ID
    List<Receiver_ActiveFood_Request_Model> findByReceiverIdOrderByRequestDateDesc(Long receiverId);

    // Find requests by receiver ID and status
    List<Receiver_ActiveFood_Request_Model> findByReceiverIdAndStatusOrderByRequestDateDesc(Long receiverId, String status);

    // Find requests by donation ID and status
    List<Receiver_ActiveFood_Request_Model> findByDonationIdAndStatusOrderByRequestDateDesc(Long donationId, String status);

    // Find if a user has already requested a specific donation
    boolean existsByDonationIdAndReceiverId(Long donationId, Long receiverId);

    // Count pending requests for a donation
    @Query("SELECT COUNT(r) FROM Receiver_ActiveFood_Request_Model r WHERE r.donationId = :donationId AND r.status = 'PENDING'")
    int countPendingRequestsByDonationId(@Param("donationId") Long donationId);

    // Find a specific request by donation ID and receiver ID
    Receiver_ActiveFood_Request_Model findByDonationIdAndReceiverId(Long donationId, Long receiverId);

    // New method to find accepted requests by receiver ID within a date range
    List<Receiver_ActiveFood_Request_Model> findByReceiverIdAndStatusAndResponseDateBetween(
            Long receiverId,
            String status,
            LocalDateTime startDateTime,
            LocalDateTime endDateTime
    );

    // New method to find requests by receiver ID, status, and request date
    List<Receiver_ActiveFood_Request_Model> findByReceiverIdAndStatusInAndRequestDateAfter(
            Long receiverId,
            List<String> statuses,
            LocalDateTime requestDate
    );

    List<Receiver_ActiveFood_Request_Model> findByReceiverIdAndStatusInAndResponseDateBetween(
            Long receiverId,
            List<String> statuses,
            LocalDateTime startDate,
            LocalDateTime endDate
    );
}