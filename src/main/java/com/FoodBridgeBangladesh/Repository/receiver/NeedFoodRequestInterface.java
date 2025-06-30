package com.FoodBridgeBangladesh.Repository.receiver;

import com.FoodBridgeBangladesh.Model.receiver.NeedFoodRequestModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NeedFoodRequestInterface extends JpaRepository<NeedFoodRequestModel, Long> {
    // Find all requests by user ID
    List<NeedFoodRequestModel> findByUserId(Long userId);

    // Find requests by user ID and status
    List<NeedFoodRequestModel> findByUserIdAndRequestStatus(Long userId, String status);

    // Custom query to find recent requests
    @Query("SELECT r FROM NeedFoodRequestModel r WHERE r.userId = :userId ORDER BY r.requestedAt DESC")
    List<NeedFoodRequestModel> findRecentRequestsByUserId(@Param("userId") Long userId);
    /**
     * Find requests by status
     */
    List<NeedFoodRequestModel> findByRequestStatus(String status);
}