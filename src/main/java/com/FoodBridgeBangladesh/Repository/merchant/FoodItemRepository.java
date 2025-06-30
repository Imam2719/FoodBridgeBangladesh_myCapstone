package com.FoodBridgeBangladesh.Repository.merchant;

import com.FoodBridgeBangladesh.Model.dto.FoodItemDTO;
import com.FoodBridgeBangladesh.Model.merchant.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {

    long countByFoodCategoryAndIsPausedFalse(FoodItem.FoodCategory category);

    List<FoodItem> findByMerchantId(Long merchantId);

    List<FoodItem> findByIsPausedFalse();

    List<FoodItem> findByMerchantIdAndIsPausedFalse(Long merchantId);

    @Query("SELECT f FROM FoodItem f WHERE " +
            "f.isPaused = false AND " +
            "(LOWER(f.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(f.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<FoodItem> searchActiveItems(@Param("searchTerm") String searchTerm);

    List<FoodItem> findByFoodCategory(FoodItem.FoodCategory category);

    List<FoodItem> findByExpiryDateBefore(LocalDate date);

    /**
     * Find food items by category that are not paused (active)
     */
    @Query("SELECT new com.FoodBridgeBangladesh.Model.dto.FoodItemDTO(f.id, f.name, f.description, f.foodCategory, f.foodType, f.price, f.quantity, f.expiryDate, f.location, f.storeName, f.makingTime, f.deliveryTime, f.isPaused, f.createdAt) FROM FoodItem f WHERE f.foodCategory = :category AND f.isPaused = false")
    List<FoodItemDTO> findByCategoryAndActiveProjected(@Param("category") FoodItem.FoodCategory category);

  }