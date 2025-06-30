package com.FoodBridgeBangladesh.Repository.admin;

import com.FoodBridgeBangladesh.Model.admin.adminManagementEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface adminManagementRepository extends JpaRepository<adminManagementEntity, Long> {

    // Find admin by email
    Optional<adminManagementEntity> findByEmail(String email);

    // Find all admins by role
    List<adminManagementEntity> findByRole(String role);

    // Find all active admins
    List<adminManagementEntity> findByStatus(String status);

    // Count total admins by role
    @Query("SELECT COUNT(a) FROM adminManagementEntity a WHERE a.role = ?1")
    Long countByRole(String role);

    // Check if email exists
    boolean existsByEmail(String email);
}