package com.FoodBridgeBangladesh.Repository;

import com.FoodBridgeBangladesh.Model.OTPEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OTPRepository extends JpaRepository<OTPEntity, Long> {

    /**
     * Find OTP by email
     */
    Optional<OTPEntity> findByEmail(String email);

    /**
     * Find all expired OTPs
     */
    List<OTPEntity> findByExpiryTimeBefore(LocalDateTime dateTime);

    /**
     * Delete all expired OTPs
     */
    void deleteByExpiryTimeBefore(LocalDateTime dateTime);
}