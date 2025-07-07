package com.FoodBridgeBangladesh.Repository.receiver;

import com.FoodBridgeBangladesh.Model.receiver.EmergencyFoodRequest;
import com.FoodBridgeBangladesh.Model.receiver.EmergencyFoodRequest.RequestStatus;
import com.FoodBridgeBangladesh.Model.receiver.EmergencyFoodRequest.UrgencyLevel;
import com.FoodBridgeBangladesh.Model.receiver.EmergencyFoodRequest.FoodCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EmergencyFoodRequestRepository extends JpaRepository<EmergencyFoodRequest, Long> {

    // CORE METHODS - Actually used in service

    // Find by user
    List<EmergencyFoodRequest> findByUserIdOrderByRequestDateDesc(Long userId);
    Page<EmergencyFoodRequest> findByUserIdOrderByRequestDateDesc(Long userId, Pageable pageable);

    // Find by status
    List<EmergencyFoodRequest> findByStatusOrderByPriorityScoreDescRequestDateAsc(RequestStatus status);
    Page<EmergencyFoodRequest> findByStatusOrderByPriorityScoreDescRequestDateAsc(RequestStatus status, Pageable pageable);

    // Find by urgency level
    List<EmergencyFoodRequest> findByUrgencyOrderByRequestDateAsc(UrgencyLevel urgency);

    // Find by category
    List<EmergencyFoodRequest> findByCategoryOrderByPriorityScoreDescRequestDateAsc(FoodCategory category);

    // Find urgent requests
    @Query("SELECT e FROM EmergencyFoodRequest e WHERE e.urgency IN ('CRITICAL', 'HIGH') AND e.status = 'PENDING' ORDER BY e.priorityScore DESC, e.requestDate ASC")
    List<EmergencyFoodRequest> findUrgentPendingRequests();

    // Find pending requests by location
    @Query("SELECT e FROM EmergencyFoodRequest e WHERE e.status = 'PENDING' AND LOWER(e.location) LIKE LOWER(CONCAT('%', :location, '%')) ORDER BY e.priorityScore DESC, e.requestDate ASC")
    List<EmergencyFoodRequest> findPendingRequestsByLocation(@Param("location") String location);

    // Count requests by status
    long countByStatus(RequestStatus status);

    // Count urgent pending requests
    @Query("SELECT COUNT(e) FROM EmergencyFoodRequest e WHERE e.urgency IN ('CRITICAL', 'HIGH') AND e.status = 'PENDING'")
    long countUrgentPendingRequests();

    // Find recent requests by user (last 7 days)
    @Query("SELECT e FROM EmergencyFoodRequest e WHERE e.userId = :userId AND e.requestDate >= :sevenDaysAgo ORDER BY e.requestDate DESC")
    List<EmergencyFoodRequest> findRecentRequestsByUser(@Param("userId") Long userId, @Param("sevenDaysAgo") LocalDateTime sevenDaysAgo);

    // Find active requests by user
    @Query("SELECT e FROM EmergencyFoodRequest e WHERE e.userId = :userId AND e.status IN ('PENDING', 'APPROVED', 'IN_PROGRESS') ORDER BY e.requestDate DESC")
    List<EmergencyFoodRequest> findActiveRequestsByUser(@Param("userId") Long userId);

    // Find all pending requests ordered by priority
    @Query("SELECT e FROM EmergencyFoodRequest e WHERE e.status = 'PENDING' ORDER BY e.priorityScore DESC, e.requestDate ASC")
    List<EmergencyFoodRequest> findAllPendingRequestsByPriority();

    @Query("SELECT e FROM EmergencyFoodRequest e WHERE e.status = 'PENDING' ORDER BY e.priorityScore DESC, e.requestDate ASC")
    Page<EmergencyFoodRequest> findAllPendingRequestsByPriority(Pageable pageable);

    // Search requests by title or description
    @Query("SELECT e FROM EmergencyFoodRequest e WHERE " +
            "(LOWER(e.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(e.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
            "e.status = :status ORDER BY e.priorityScore DESC, e.requestDate ASC")
    List<EmergencyFoodRequest> searchRequestsByTitleOrDescription(@Param("searchTerm") String searchTerm, @Param("status") RequestStatus status);

    // Find overdue requests
    @Query("SELECT e FROM EmergencyFoodRequest e WHERE e.status = 'PENDING' AND " +
            "((e.urgency = 'CRITICAL' AND e.requestDate <= :criticalThreshold) OR " +
            "(e.urgency = 'HIGH' AND e.requestDate <= :highThreshold) OR " +
            "(e.urgency = 'MEDIUM' AND e.requestDate <= :mediumThreshold)) " +
            "ORDER BY e.requestDate ASC")
    List<EmergencyFoodRequest> findOverdueRequests(
            @Param("criticalThreshold") LocalDateTime criticalThreshold,
            @Param("highThreshold") LocalDateTime highThreshold,
            @Param("mediumThreshold") LocalDateTime mediumThreshold
    );

    // Check if user has pending requests (for rate limiting)
    boolean existsByUserIdAndStatus(Long userId, RequestStatus status);

    // ADDITIONAL USEFUL METHODS (Optional - comment out if not needed)

    /*
    // Uncomment these methods as needed in your service layer

    Page<EmergencyFoodRequest> findByUrgencyOrderByRequestDateAsc(UrgencyLevel urgency, Pageable pageable);

    @Query("SELECT e FROM EmergencyFoodRequest e WHERE e.urgency IN ('CRITICAL', 'HIGH') AND e.status = 'PENDING' ORDER BY e.priorityScore DESC, e.requestDate ASC")
    Page<EmergencyFoodRequest> findUrgentPendingRequests(Pageable pageable);

    @Query("SELECT e FROM EmergencyFoodRequest e WHERE e.requestDate BETWEEN :startDate AND :endDate ORDER BY e.requestDate DESC")
    List<EmergencyFoodRequest> findRequestsInDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    long countByUserIdAndStatus(Long userId, RequestStatus status);

    @Query("SELECT " +
           "COUNT(CASE WHEN e.status = 'PENDING' THEN 1 END) as pendingCount, " +
           "COUNT(CASE WHEN e.status = 'APPROVED' THEN 1 END) as approvedCount, " +
           "COUNT(CASE WHEN e.status = 'FULFILLED' THEN 1 END) as fulfilledCount, " +
           "COUNT(CASE WHEN e.urgency = 'CRITICAL' AND e.status = 'PENDING' THEN 1 END) as criticalPendingCount " +
           "FROM EmergencyFoodRequest e WHERE e.requestDate >= :startDate")
    Object[] getRequestStatistics(@Param("startDate") LocalDateTime startDate);

    List<EmergencyFoodRequest> findByResponderIdOrderByResponseDateDesc(Long responderId);

    @Query("SELECT e FROM EmergencyFoodRequest e WHERE e.status IN :statuses ORDER BY e.priorityScore DESC, e.requestDate ASC")
    List<EmergencyFoodRequest> findByStatusInOrderByPriorityScoreDescRequestDateAsc(@Param("statuses") List<RequestStatus> statuses);

    @Query("SELECT e FROM EmergencyFoodRequest e WHERE e.status = 'APPROVED' AND e.responseDate <= :followUpThreshold ORDER BY e.responseDate ASC")
    List<EmergencyFoodRequest> findRequestsNeedingFollowUp(@Param("followUpThreshold") LocalDateTime followUpThreshold);

    @Query("SELECT DISTINCT e.location FROM EmergencyFoodRequest e WHERE e.status = 'PENDING'")
    List<String> findDistinctPendingLocations();
    */
}