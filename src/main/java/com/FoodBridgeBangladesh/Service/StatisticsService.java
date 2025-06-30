package com.FoodBridgeBangladesh.Service;

import com.FoodBridgeBangladesh.Repository.UserRepository;
import com.FoodBridgeBangladesh.Repository.admin.MerchantAddRepository;
import com.FoodBridgeBangladesh.Repository.donor.DonationRepository;
import com.FoodBridgeBangladesh.Repository.merchant.MerchantSaleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class StatisticsService {

    private static final Logger logger = LoggerFactory.getLogger(StatisticsService.class);

    private final DonationRepository donationRepository;
    private final UserRepository userRepository;
    private final MerchantAddRepository merchantRepository;
    private final MerchantSaleRepository merchantSaleRepository;

    @Autowired
    public StatisticsService(
            DonationRepository donationRepository,
            UserRepository userRepository,
            MerchantAddRepository merchantRepository,
            MerchantSaleRepository merchantSaleRepository) {
        this.donationRepository = donationRepository;
        this.userRepository = userRepository;
        this.merchantRepository = merchantRepository;
        this.merchantSaleRepository = merchantSaleRepository;
    }

    /**
     * Get homepage statistics with real data
     */
    public Map<String, Object> getHomepageStatistics() {
        logger.info("Fetching homepage statistics...");

        Map<String, Object> statistics = new HashMap<>();

        try {
            // 1. Meals Shared - Total donations count
            long totalDonations = donationRepository.count();
            statistics.put("mealsShared", formatNumber(totalDonations));

            // 2. Active Donors - Total users count
            long totalUsers = userRepository.count();
            statistics.put("activeDonors", formatNumber(totalUsers));

            // 3. Food Sellers - Total merchants count
            long totalMerchants = merchantRepository.count();
            statistics.put("foodSellers", formatNumber(totalMerchants));

            // 4. Total Food Sell - Total merchant sales count
            long totalSales = merchantSaleRepository.count();
            statistics.put("totalFoodSell", formatNumber(totalSales));

            logger.info("Statistics fetched successfully: Donations={}, Users={}, Merchants={}, Sales={}",
                    totalDonations, totalUsers, totalMerchants, totalSales);

        } catch (Exception e) {
            logger.error("Error fetching statistics: {}", e.getMessage(), e);
            // Return default values in case of error
            statistics.put("mealsShared", "0");
            statistics.put("activeDonors", "0");
            statistics.put("foodSellers", "0");
            statistics.put("totalFoodSell", "0");
        }

        return statistics;
    }

    /**
     * Format numbers for display (e.g., 1000 -> "1K+", 1500 -> "1.5K+")
     */
    private String formatNumber(long number) {
        if (number < 1000) {
            return String.valueOf(number);
        } else if (number < 1000000) {
            if (number % 1000 == 0) {
                return (number / 1000) + "K+";
            } else {
                return String.format("%.1fK+", number / 1000.0);
            }
        } else {
            if (number % 1000000 == 0) {
                return (number / 1000000) + "M+";
            } else {
                return String.format("%.1fM+", number / 1000000.0);
            }
        }
    }
}