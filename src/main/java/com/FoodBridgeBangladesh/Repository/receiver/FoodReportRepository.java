package com.FoodBridgeBangladesh.Repository.receiver;

import com.FoodBridgeBangladesh.Model.receiver.FoodReport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface FoodReportRepository extends JpaRepository<FoodReport, Long> {

    // Find reports by reporter (user who reported)
    List<FoodReport> findByReporterIdOrderByCreatedAtDesc(Long reporterId);

    // Find reports by food donation ID
    List<FoodReport> findByFoodDonationIdOrderByCreatedAtDesc(Long foodDonationId);

    // Find reports by donor ID
    List<FoodReport> findByDonorIdOrderByCreatedAtDesc(Long donorId);

    // Find reports by status
    List<FoodReport> findByStatusOrderByCreatedAtDesc(FoodReport.ReportStatus status);

    // Find reports by category
    List<FoodReport> findByReportCategoryOrderByCreatedAtDesc(String category);

    // Find reports by priority (high priority first)
    List<FoodReport> findByPriorityGreaterThanEqualOrderByPriorityDescCreatedAtDesc(Integer minPriority);

    // Paginated queries
    Page<FoodReport> findByReporterIdOrderByCreatedAtDesc(Long reporterId, Pageable pageable);

    Page<FoodReport> findByStatusOrderByCreatedAtDesc(FoodReport.ReportStatus status, Pageable pageable);

    // Check if user has already reported a specific food item
    @Query("SELECT fr FROM FoodReport fr WHERE fr.foodDonationId = :foodDonationId AND fr.reporterId = :reporterId")
    Optional<FoodReport> findByFoodDonationIdAndReporterId(@Param("foodDonationId") Long foodDonationId,
                                                           @Param("reporterId") Long reporterId);

    // Count reports by various criteria
    @Query("SELECT COUNT(fr) FROM FoodReport fr WHERE fr.reporterId = :reporterId")
    Long countByReporterId(@Param("reporterId") Long reporterId);

    @Query("SELECT COUNT(fr) FROM FoodReport fr WHERE fr.status = :status")
    Long countByStatus(@Param("status") FoodReport.ReportStatus status);

    @Query("SELECT COUNT(fr) FROM FoodReport fr WHERE fr.foodDonationId = :foodDonationId")
    Long countByFoodDonationId(@Param("foodDonationId") Long foodDonationId);

    @Query("SELECT COUNT(fr) FROM FoodReport fr WHERE fr.donorId = :donorId")
    Long countByDonorId(@Param("donorId") Long donorId);

    // Find reports within date range
    @Query("SELECT fr FROM FoodReport fr WHERE fr.createdAt BETWEEN :startDate AND :endDate ORDER BY fr.createdAt DESC")
    List<FoodReport> findReportsBetweenDates(@Param("startDate") LocalDateTime startDate,
                                             @Param("endDate") LocalDateTime endDate);

    // Find recent reports (last 7 days)
    @Query("SELECT fr FROM FoodReport fr WHERE fr.createdAt >= :since ORDER BY fr.createdAt DESC")
    List<FoodReport> findRecentReports(@Param("since") LocalDateTime since);

    // Search reports by food name or reason
    @Query("SELECT fr FROM FoodReport fr WHERE " +
            "LOWER(fr.foodName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(fr.reportReason) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "ORDER BY fr.createdAt DESC")
    List<FoodReport> searchReports(@Param("keyword") String keyword);

    // Get reports summary statistics - Fixed query
    @Query("SELECT " +
            "COUNT(fr) as totalReports, " +
            "SUM(CASE WHEN fr.status = 'PENDING' THEN 1 ELSE 0 END) as pendingReports, " +
            "SUM(CASE WHEN fr.status = 'RESOLVED' THEN 1 ELSE 0 END) as resolvedReports, " +
            "SUM(CASE WHEN fr.reporterId = :userId THEN 1 ELSE 0 END) as userReports " +
            "FROM FoodReport fr")
    Object[] getReportsSummary(@Param("userId") Long userId);

    // Find reports that need urgent attention (high priority + old)
    @Query("SELECT fr FROM FoodReport fr WHERE " +
            "fr.status = 'PENDING' AND " +
            "fr.priority >= 4 AND " +
            "fr.createdAt <= :urgentThreshold " +
            "ORDER BY fr.priority DESC, fr.createdAt ASC")
    List<FoodReport> findUrgentReports(@Param("urgentThreshold") LocalDateTime urgentThreshold);

    // Check for duplicate reports (same user, same food, within time window)
    @Query("SELECT COUNT(fr) FROM FoodReport fr WHERE " +
            "fr.foodDonationId = :foodDonationId AND " +
            "fr.reporterId = :reporterId AND " +
            "fr.createdAt >= :timeWindow")
    Long countRecentDuplicateReports(@Param("foodDonationId") Long foodDonationId,
                                     @Param("reporterId") Long reporterId,
                                     @Param("timeWindow") LocalDateTime timeWindow);

    // Get reports by multiple statuses
    @Query("SELECT fr FROM FoodReport fr WHERE fr.status IN :statuses ORDER BY fr.createdAt DESC")
    List<FoodReport> findByStatusIn(@Param("statuses") List<FoodReport.ReportStatus> statuses);

    // Get reports by reporter with status filter
    @Query("SELECT fr FROM FoodReport fr WHERE fr.reporterId = :reporterId AND fr.status = :status ORDER BY fr.createdAt DESC")
    List<FoodReport> findByReporterIdAndStatus(@Param("reporterId") Long reporterId, @Param("status") FoodReport.ReportStatus status);

    // Get high priority pending reports
    @Query("SELECT fr FROM FoodReport fr WHERE fr.status = 'PENDING' AND fr.priority >= :minPriority ORDER BY fr.priority DESC, fr.createdAt ASC")
    List<FoodReport> findHighPriorityPendingReports(@Param("minPriority") Integer minPriority);

    // Get reports by date range and status
    @Query("SELECT fr FROM FoodReport fr WHERE fr.createdAt BETWEEN :startDate AND :endDate AND fr.status = :status ORDER BY fr.createdAt DESC")
    List<FoodReport> findByDateRangeAndStatus(@Param("startDate") LocalDateTime startDate,
                                              @Param("endDate") LocalDateTime endDate,
                                              @Param("status") FoodReport.ReportStatus status);

    // Count reports by category
    @Query("SELECT fr.reportCategory, COUNT(fr) FROM FoodReport fr GROUP BY fr.reportCategory")
    List<Object[]> countReportsByCategory();

    // Count reports by status
    @Query("SELECT fr.status, COUNT(fr) FROM FoodReport fr GROUP BY fr.status")
    List<Object[]> countReportsByStatus();

    // Find reports with evidence files
    @Query("SELECT fr FROM FoodReport fr WHERE fr.evidenceFile1 IS NOT NULL OR fr.evidenceFile2 IS NOT NULL ORDER BY fr.createdAt DESC")
    List<FoodReport> findReportsWithEvidence();

    // Find reports without evidence files
    @Query("SELECT fr FROM FoodReport fr WHERE fr.evidenceFile1 IS NULL AND fr.evidenceFile2 IS NULL ORDER BY fr.createdAt DESC")
    List<FoodReport> findReportsWithoutEvidence();

    // Get reporter statistics
    @Query("SELECT fr.reporterId, fr.reporterName, COUNT(fr) as reportCount FROM FoodReport fr GROUP BY fr.reporterId, fr.reporterName ORDER BY reportCount DESC")
    List<Object[]> getReporterStatistics();

    // Get donor statistics (who gets reported most)
    @Query("SELECT fr.donorId, fr.donorName, COUNT(fr) as reportCount FROM FoodReport fr GROUP BY fr.donorId, fr.donorName ORDER BY reportCount DESC")
    List<Object[]> getDonorReportStatistics();

    // Find old unresolved reports (for cleanup/escalation)
    @Query("SELECT fr FROM FoodReport fr WHERE fr.status IN ('PENDING', 'UNDER_REVIEW') AND fr.createdAt <= :threshold ORDER BY fr.createdAt ASC")
    List<FoodReport> findOldUnresolvedReports(@Param("threshold") LocalDateTime threshold);
}