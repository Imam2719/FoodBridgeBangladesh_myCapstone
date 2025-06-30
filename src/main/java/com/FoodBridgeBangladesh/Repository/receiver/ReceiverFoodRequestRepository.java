package com.FoodBridgeBangladesh.Repository.receiver;


import com.FoodBridgeBangladesh.Model.receiver.ReceiverFoodRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReceiverFoodRequestRepository extends JpaRepository<ReceiverFoodRequest, Long> {

    /**
     * Find all food requests for a specific receiver
     */
    List<ReceiverFoodRequest> findByReceiverId(Long receiverId);

    /**
     * Find requests by receiver ID and status
     */
    List<ReceiverFoodRequest> findByReceiverIdAndStatus(Long receiverId, String status);

    /**
     * Count pending requests for a receiver
     */
    @Query("SELECT COUNT(r) FROM ReceiverFoodRequest r WHERE r.receiverId = :receiverId AND r.status = 'PENDING'")
    long countPendingRequestsByReceiver(@Param("receiverId") Long receiverId);

    /**
     * Advanced query to find food requests with custom filtering
     */
    @Query("SELECT r FROM ReceiverFoodRequest r " +
            "WHERE r.receiverId = :receiverId " +
            "AND (:status IS NULL OR r.status = :status) " +
            "ORDER BY r.requestDate DESC")
    List<ReceiverFoodRequest> findRequestsWithFilter(
            @Param("receiverId") Long receiverId,
            @Param("status") String status
    );
}