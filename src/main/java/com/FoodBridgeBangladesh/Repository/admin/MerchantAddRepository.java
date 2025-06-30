// In MerchantAddRepository.java
package com.FoodBridgeBangladesh.Repository.admin;

import com.FoodBridgeBangladesh.Model.admin.MerchantEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MerchantAddRepository extends JpaRepository<MerchantEntity, Long> {
    boolean existsByEmail(String email);
    boolean existsByBusinessLicenseNumber(String businessLicenseNumber);
    Optional<MerchantEntity> findByMerchantId(String merchantId);
    Optional<MerchantEntity> findByEmail(String email);

}