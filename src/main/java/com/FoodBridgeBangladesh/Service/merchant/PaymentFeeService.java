package com.FoodBridgeBangladesh.Service.merchant;

import com.FoodBridgeBangladesh.Model.admin.MerchantEntity;
import com.FoodBridgeBangladesh.Model.merchant.MerchantPaymentHistory;
import com.FoodBridgeBangladesh.Repository.admin.MerchantAddRepository;
import com.FoodBridgeBangladesh.Repository.merchant.MerchantPaymentHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.logging.Logger;

@Service
public class PaymentFeeService {

    private static final Logger logger = Logger.getLogger(PaymentFeeService.class.getName());

    @Autowired
    private MerchantAddRepository merchantAddRepository;

    @Autowired
    private MerchantPaymentHistoryRepository paymentHistoryRepository;

    // ✅ FIXED: Add MerchantSaleRepository for real revenue calculation
    @Autowired
    private com.FoodBridgeBangladesh.Repository.merchant.MerchantSaleRepository merchantSaleRepository;

    /**
     * ✅ ENHANCED: Safely convert object to string
     */
    private String safeToString(Object obj) {
        if (obj == null) {
            return null;
        }
        return String.valueOf(obj).trim();
    }

    /**
     * ✅ ENHANCED: Safely convert object to double
     */
    private Double safeToDouble(Object obj) {
        if (obj == null) {
            return null;
        }
        if (obj instanceof Number) {
            return ((Number) obj).doubleValue();
        }
        try {
            String str = String.valueOf(obj).trim();
            if (str.isEmpty() || "null".equals(str)) {
                return null;
            }
            return Double.parseDouble(str);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid number format: " + obj);
        }
    }

    /**
     * ✅ ENHANCED: Safely convert object to long
     */
    private Long safeToLong(Object obj) {
        if (obj == null) {
            return null;
        }
        if (obj instanceof Number) {
            return ((Number) obj).longValue();
        }
        try {
            String str = String.valueOf(obj).trim();
            if (str.isEmpty() || "null".equals(str)) {
                return null;
            }
            return Long.parseLong(str);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid long format: " + obj);
        }
    }

    /**
     * ✅ MAIN FIX: Calculate fee data for specific month with enhanced revenue logic
     */
    public Map<String, Object> calculateFeeDataForMonth(String merchantId, String selectedMonth) {
        logger.info("Calculating fee data for merchantId: " + merchantId + " for month: " + selectedMonth);

        // Validate inputs
        if (merchantId == null || merchantId.trim().isEmpty() || "null".equals(merchantId)) {
            throw new IllegalArgumentException("Invalid merchant ID");
        }

        if (selectedMonth == null || selectedMonth.trim().isEmpty()) {
            throw new IllegalArgumentException("Invalid month");
        }

        Long merchantIdLong;
        try {
            merchantIdLong = Long.parseLong(merchantId.trim());
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid merchant ID format: " + merchantId);
        }

        Optional<MerchantEntity> merchantOpt = merchantAddRepository.findById(merchantIdLong);
        if (!merchantOpt.isPresent()) {
            throw new RuntimeException("Merchant not found with ID: " + merchantId);
        }

        MerchantEntity merchant = merchantOpt.get();

        // Get current month for comparison
        String currentMonth = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));
        LocalDate selectedDate = LocalDate.parse(selectedMonth + "-01");
        LocalDate currentDate = LocalDate.now();

        Map<String, Object> feeData = new HashMap<>();

        // ✅ ENHANCED: Month-specific logic with better validation
        if (selectedDate.isAfter(currentDate.withDayOfMonth(1))) {
            // Future month - check if we should allow payment based on accumulated revenue
            Double totalRevenue = getTotalAccumulatedRevenue(merchantIdLong);

            if (totalRevenue == null || totalRevenue <= 0) {
                // No revenue at all - don't allow payment
                feeData.put("success", false);
                feeData.put("canPay", false);
                feeData.put("message", "No revenue found. Complete some sales first before paying platform fees.");
                feeData.put("currentBalance", 0.0);
                feeData.put("selectedMonth", selectedMonth);
                feeData.put("currentMonth", currentMonth);
                feeData.put("paymentHistory", new ArrayList<>());
                return feeData;
            }
        }

        // Check if already paid for selected month
        boolean alreadyPaid = paymentHistoryRepository.existsByMerchantIdAndPaymentMonthAndStatus(
                merchantId, selectedMonth, "COMPLETED"
        );

        double currentBalance = 0.0;
        String message = "";
        Double monthlyRevenue = null;

        if (alreadyPaid) {
            // Already paid for this month
            message = "Payment for " + getMonthName(selectedMonth) + " has been completed successfully.";
            feeData.put("canPay", false);
            feeData.put("alreadyPaid", true);
        } else {
            // ✅ MAIN FIX: Enhanced fee calculation with improved revenue handling
            monthlyRevenue = getMonthlyRevenue(merchantId, selectedMonth);

            logger.info("Retrieved revenue for fee calculation: " + monthlyRevenue + " for month: " + selectedMonth);

            if ("contractual".equals(merchant.getFeeType())) {
                // Fixed amount fee
                currentBalance = merchant.getFeeAmount() != null ? merchant.getFeeAmount() : 0.0;
                message = "Fixed fee for " + getMonthName(selectedMonth) + ": ৳" + String.format("%.2f", currentBalance);

            } else if ("percentage".equals(merchant.getFeeType())) {
                // ✅ ENHANCED: Percentage-based fee with fallback logic
                if (monthlyRevenue != null && monthlyRevenue > 0 && merchant.getFeeAmount() != null) {
                    currentBalance = (monthlyRevenue * merchant.getFeeAmount()) / 100.0;

                    // ✅ ENHANCED: Better messaging for different revenue types
                    LocalDate selectedDateParsed = LocalDate.parse(selectedMonth + "-01");
                    LocalDate currentDateParsed = LocalDate.now();

                    if (selectedDateParsed.isAfter(currentDateParsed.withDayOfMonth(1))) {
                        message = "Fee: " + merchant.getFeeAmount() + "% of ৳" + String.format("%.2f", monthlyRevenue) +
                                " (total accumulated revenue) = ৳" + String.format("%.2f", currentBalance);
                    } else if (selectedMonth.equals(currentMonth)) {
                        message = "Fee: " + merchant.getFeeAmount() + "% of ৳" + String.format("%.2f", monthlyRevenue) +
                                " (current month revenue) = ৳" + String.format("%.2f", currentBalance);
                    } else {
                        message = "Fee: " + merchant.getFeeAmount() + "% of ৳" + String.format("%.2f", monthlyRevenue) +
                                " (monthly revenue) = ৳" + String.format("%.2f", currentBalance);
                    }

                    logger.info("Percentage fee calculated: " + merchant.getFeeAmount() + "% of " + monthlyRevenue + " = " + currentBalance);
                } else {
                    currentBalance = 0.0;
                    message = "No revenue available for fee calculation. Fee: ৳0.00";
                    logger.info("No revenue data available for percentage fee calculation");
                }
            }

            feeData.put("canPay", currentBalance > 0);
            feeData.put("alreadyPaid", false);
        }

        // Get payment history
        List<MerchantPaymentHistory> paymentHistory = paymentHistoryRepository.findByMerchantIdOrderByPaymentDateDesc(merchantId);

        // Convert to response format
        List<Map<String, Object>> historyResponse = new ArrayList<>();
        for (MerchantPaymentHistory payment : paymentHistory) {
            Map<String, Object> paymentMap = convertToResponseMap(payment);
            historyResponse.add(paymentMap);
        }

        // Set fee data
        feeData.put("success", true);
        feeData.put("currentBalance", currentBalance);
        feeData.put("feeType", merchant.getFeeType());
        feeData.put("feeAmount", merchant.getFeeAmount());
        feeData.put("selectedMonth", selectedMonth);
        feeData.put("currentMonth", currentMonth);
        feeData.put("message", message);
        feeData.put("dueDate", LocalDate.now().plusMonths(1).withDayOfMonth(1).toString());
        feeData.put("platformFee", currentBalance);
        feeData.put("transactionFees", 0.0);
        feeData.put("promotionalFees", 0.0);
        feeData.put("previousBalance", 0.0);
        feeData.put("paymentHistory", historyResponse);
        feeData.put("monthlyRevenue", monthlyRevenue != null ? monthlyRevenue : 0.0);

        logger.info("Fee data calculated for " + selectedMonth + ": " + feeData);
        return feeData;
    }

    /**
     * ✅ MAIN FIX: Enhanced monthly revenue calculation with multiple strategies
     */
    private Double getMonthlyRevenue(String merchantId, String month) {
        try {
            Long merchantIdLong = Long.parseLong(merchantId);

            logger.info("Calculating monthly revenue for merchant " + merchantId + " for month: " + month);

            // Parse the selected month
            LocalDate monthStart = LocalDate.parse(month + "-01");
            LocalDate monthEnd = monthStart.withDayOfMonth(monthStart.lengthOfMonth());
            LocalDate currentDate = LocalDate.now();

            Double monthlyRevenue = 0.0;

            // ✅ MAIN FIX: Enhanced logic for different month scenarios
            if (month.equals(currentDate.format(DateTimeFormatter.ofPattern("yyyy-MM")))) {
                // CURRENT MONTH: Use month-to-date (from start of month to today)
                monthStart = currentDate.withDayOfMonth(1);
                monthEnd = currentDate;

                logger.info("Current month calculation: " + monthStart + " to " + monthEnd);
                monthlyRevenue = calculateRevenueForPeriod(merchantId, monthStart, monthEnd);

                // ✅ FALLBACK: If current month has no revenue, use total accumulated
                if (monthlyRevenue == 0.0) {
                    logger.info("No current month revenue, using accumulated revenue");
                    monthlyRevenue = getTotalAccumulatedRevenue(merchantIdLong);
                }

            } else if (monthStart.isBefore(currentDate.withDayOfMonth(1))) {
                // PAST MONTH: Use full month data
                logger.info("Past month calculation: " + monthStart + " to " + monthEnd);
                monthlyRevenue = calculateRevenueForPeriod(merchantId, monthStart, monthEnd);

                // ✅ FALLBACK: If past month has no revenue, use total accumulated
                if (monthlyRevenue == 0.0) {
                    logger.info("No past month revenue, using accumulated revenue");
                    monthlyRevenue = getTotalAccumulatedRevenue(merchantIdLong);
                }

            } else {
                // FUTURE MONTH: Use total accumulated revenue
                logger.info("Future month detected: " + month + ". Using accumulated revenue.");
                monthlyRevenue = getTotalAccumulatedRevenue(merchantIdLong);
            }

            logger.info("Final monthly revenue for " + month + ": " + monthlyRevenue);
            return monthlyRevenue;

        } catch (Exception e) {
            logger.warning("Error calculating monthly revenue for " + merchantId + " for month " + month + ": " + e.getMessage());
            e.printStackTrace();

            // ✅ LAST RESORT FALLBACK: Try to get total accumulated revenue
            try {
                Long merchantIdLong = Long.parseLong(merchantId);
                Double totalRevenue = getTotalAccumulatedRevenue(merchantIdLong);
                logger.info("Using fallback total accumulated revenue: " + totalRevenue);
                return totalRevenue;
            } catch (Exception fallbackError) {
                logger.warning("Fallback revenue calculation also failed: " + fallbackError.getMessage());
                return 0.0;
            }
        }
    }

    /**
     * ✅ NEW METHOD: Get total accumulated revenue for merchant
     * This solves the main issue of percentage fee calculation
     */
    private Double getTotalAccumulatedRevenue(Long merchantId) {
        try {
            logger.info("Calculating total accumulated revenue for merchant: " + merchantId);

            // ✅ MAIN FIX: Get all completed sales revenue for this merchant (all time)
            Double totalRevenue = merchantSaleRepository.getTotalRevenueByMerchant(merchantId);

            if (totalRevenue == null) {
                totalRevenue = 0.0;
            }

            logger.info("Total accumulated revenue: " + totalRevenue);
            return totalRevenue;

        } catch (Exception e) {
            logger.warning("Error calculating total accumulated revenue for merchant " + merchantId + ": " + e.getMessage());
            return 0.0;
        }
    }

    /**
     * ✅ ENHANCED: Better revenue calculation with improved date handling
     */
    private Double calculateRevenueForPeriod(String merchantId, LocalDate startDate, LocalDate endDate) {
        try {
            Long merchantIdLong = Long.parseLong(merchantId);

            logger.info("Calculating revenue for merchant " + merchantId + " from " + startDate + " to " + endDate);

            // ✅ ENHANCED: Use LocalDate version of the query for better compatibility
            Double totalRevenue = merchantSaleRepository.getTotalRevenueByMerchantAndDateRangeLocal(
                    merchantIdLong, startDate, endDate
            );

            if (totalRevenue == null) {
                totalRevenue = 0.0;
            }

            logger.info("Revenue calculated for period (" + startDate + " to " + endDate + "): ৳" + totalRevenue);
            return totalRevenue;

        } catch (Exception e) {
            logger.warning("Error calculating revenue for period for merchant " + merchantId + ": " + e.getMessage());
            e.printStackTrace();
            return 0.0;
        }
    }

    /**
     * ✅ ENHANCED: Convert month string to readable format
     */
    private String getMonthName(String monthString) {
        try {
            LocalDate date = LocalDate.parse(monthString + "-01");
            return date.format(DateTimeFormatter.ofPattern("MMMM yyyy"));
        } catch (Exception e) {
            return monthString;
        }
    }

    /**
     * ✅ ENHANCED: Process payment for merchant with better success messaging
     */
    @Transactional
    public Map<String, Object> processPayment(Map<String, Object> paymentData) {
        logger.info("Processing payment: " + paymentData);

        try {
            // ✅ ENHANCED: Safe conversion of all fields
            String merchantId = safeToString(paymentData.get("merchantId"));
            Double amount = safeToDouble(paymentData.get("amount"));
            String paymentMethod = safeToString(paymentData.get("paymentMethod"));
            String paymentMonth = safeToString(paymentData.get("paymentMonth"));
            String feeType = safeToString(paymentData.get("feeType"));
            Double totalRevenue = safeToDouble(paymentData.get("totalRevenue"));

            // Validate required fields
            if (merchantId == null || merchantId.isEmpty()) {
                throw new IllegalArgumentException("Merchant ID is required");
            }
            if (amount == null || amount <= 0) {
                throw new IllegalArgumentException("Valid payment amount is required");
            }
            if (paymentMethod == null || paymentMethod.isEmpty()) {
                throw new IllegalArgumentException("Payment method is required");
            }
            if (paymentMonth == null || paymentMonth.isEmpty()) {
                throw new IllegalArgumentException("Payment month is required");
            }

            // ✅ ENHANCED: Validate month logic with better messaging
            LocalDate selectedDate = LocalDate.parse(paymentMonth + "-01");
            LocalDate currentDate = LocalDate.now();

            // ✅ MODIFIED: Allow future month payments for accumulated revenue
            // No restriction on future months anymore, as we use accumulated revenue

            // ✅ ENHANCED: Safe conversion of merchantId to Long
            Long merchantIdLong;
            try {
                merchantIdLong = Long.parseLong(merchantId);
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Invalid merchant ID format: " + merchantId);
            }

            // Get merchant details
            Optional<MerchantEntity> merchantOpt = merchantAddRepository.findById(merchantIdLong);
            if (!merchantOpt.isPresent()) {
                throw new RuntimeException("Merchant not found with ID: " + merchantId);
            }

            MerchantEntity merchant = merchantOpt.get();

            // Check if already paid for this month
            if (paymentHistoryRepository.existsByMerchantIdAndPaymentMonthAndStatus(merchantId, paymentMonth, "COMPLETED")) {
                throw new IllegalArgumentException("Payment for " + getMonthName(paymentMonth) + " has already been completed");
            }

            // ✅ ENHANCED: Create payment record with safe data
            MerchantPaymentHistory paymentRecord = new MerchantPaymentHistory();
            paymentRecord.setMerchantId(merchantId);
            paymentRecord.setMerchantName(merchant.getBusinessName() != null ? merchant.getBusinessName() : "Unknown");
            paymentRecord.setMerchantEmail(merchant.getEmail() != null ? merchant.getEmail() : "Unknown");
            paymentRecord.setMerchantPhone(merchant.getPhoneNumber() != null ? merchant.getPhoneNumber() : "Unknown");
            paymentRecord.setAmount(amount);
            paymentRecord.setPaymentMethod(paymentMethod);
            paymentRecord.setPaymentMonth(paymentMonth);
            paymentRecord.setPaymentDate(LocalDateTime.now());
            paymentRecord.setStatus("COMPLETED"); // Demo: automatically mark as completed
            paymentRecord.setFeeType(feeType != null ? feeType : "unknown");
            paymentRecord.setTotalRevenue(totalRevenue);

            if ("percentage".equals(feeType) && merchant.getFeeAmount() != null) {
                paymentRecord.setFeePercentage(merchant.getFeeAmount());
            }

            // Generate mock transaction ID
            String transactionId = generateTransactionId(paymentMethod);
            paymentRecord.setTransactionId(transactionId);
            paymentRecord.setNotes("Payment processed via " + paymentMethod.toUpperCase() + " mobile banking for " + getMonthName(paymentMonth));

            // Save payment record
            MerchantPaymentHistory savedPayment = paymentHistoryRepository.save(paymentRecord);

            // ✅ ENHANCED: Better success response with detailed information
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "🎉 Payment Successful! Your " + getMonthName(paymentMonth) + " payment of ৳" +
                    String.format("%.2f", amount) + " has been processed successfully via " +
                    paymentMethod.toUpperCase() + ".");
            response.put("transactionId", transactionId);
            response.put("paymentAmount", amount);
            response.put("paymentMonth", paymentMonth);
            response.put("paymentMonthName", getMonthName(paymentMonth));
            response.put("paymentMethod", paymentMethod.toUpperCase());
            response.put("paymentDate", savedPayment.getPaymentDate());
            response.put("status", "COMPLETED");
            response.put("paymentRecord", convertToResponseMap(savedPayment));

            logger.info("Payment processed successfully for " + paymentMonth + ": " + transactionId);
            return response;

        } catch (Exception e) {
            logger.severe("Error in processPayment: " + e.getMessage());
            e.printStackTrace();
            throw e; // Re-throw to be handled by controller
        }
    }
    /**
     * ✅ ENHANCED: Get payment history for merchant with detailed logging and validation
     */
    public List<Map<String, Object>> getPaymentHistory(String merchantId) {
        logger.info("=== PAYMENT HISTORY SERVICE === Fetching for merchantId: " + merchantId);

        // ✅ ENHANCED: Validate merchantId
        if (merchantId == null || merchantId.trim().isEmpty()) {
            logger.warning("Invalid merchant ID provided: " + merchantId);
            throw new IllegalArgumentException("Invalid merchant ID");
        }

        String cleanMerchantId = merchantId.trim();

        try {
            // ✅ MAIN FIX: Get payment history from repository
            List<MerchantPaymentHistory> payments = paymentHistoryRepository.findByMerchantIdOrderByPaymentDateDesc(cleanMerchantId);

            logger.info("Found " + payments.size() + " payment records for merchant: " + cleanMerchantId);

            // ✅ ENHANCED: Convert to response format with detailed logging
            List<Map<String, Object>> response = new ArrayList<>();
            for (MerchantPaymentHistory payment : payments) {
                Map<String, Object> paymentMap = convertToResponseMap(payment);
                response.add(paymentMap);

                // ✅ DEBUG: Log each payment for verification
                logger.info("Payment Record: ID=" + payment.getId() +
                        ", Amount=" + payment.getAmount() +
                        ", Month=" + payment.getPaymentMonth() +
                        ", Method=" + payment.getPaymentMethod() +
                        ", Status=" + payment.getStatus());
            }

            logger.info("Successfully converted " + response.size() + " payment records to response format");
            return response;

        } catch (Exception e) {
            logger.severe("Error fetching payment history for merchant " + cleanMerchantId + ": " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>(); // Return empty list instead of throwing exception
        }
    }
    /**
     * Check if merchant has paid for specific month
     */
    public boolean hasPaymentForMonth(String merchantId, String paymentMonth) {
        // ✅ ENHANCED: Validate inputs
        if (merchantId == null || merchantId.trim().isEmpty()) {
            throw new IllegalArgumentException("Invalid merchant ID");
        }
        if (paymentMonth == null || paymentMonth.trim().isEmpty()) {
            throw new IllegalArgumentException("Invalid payment month");
        }

        return paymentHistoryRepository.existsByMerchantIdAndPaymentMonthAndStatus(
                merchantId.trim(), paymentMonth.trim(), "COMPLETED");
    }

    /**
     * Get payment statistics for merchant
     */
    public Map<String, Object> getPaymentStats(String merchantId) {
        // ✅ ENHANCED: Validate merchantId
        if (merchantId == null || merchantId.trim().isEmpty()) {
            throw new IllegalArgumentException("Invalid merchant ID");
        }

        Map<String, Object> stats = new HashMap<>();

        try {
            Double totalPaid = paymentHistoryRepository.getTotalAmountPaidByMerchant(merchantId.trim());
            long completedPayments = paymentHistoryRepository.countByMerchantIdAndStatus(merchantId.trim(), "COMPLETED");

            stats.put("totalAmountPaid", totalPaid != null ? totalPaid : 0.0);
            stats.put("completedPayments", completedPayments);
        } catch (Exception e) {
            logger.warning("Error calculating payment stats for merchant " + merchantId + ": " + e.getMessage());
            stats.put("totalAmountPaid", 0.0);
            stats.put("completedPayments", 0L);
        }

        return stats;
    }

    /**
     * ✅ ENHANCED: Generate mock transaction ID for different payment methods
     */
    private String generateTransactionId(String paymentMethod) {
        if (paymentMethod == null) {
            paymentMethod = "unknown";
        }

        String prefix;
        switch (paymentMethod.toLowerCase().trim()) {
            case "bkash":
                prefix = "BKS";
                break;
            case "nagad":
                prefix = "NGD";
                break;
            case "rocket":
                prefix = "RKT";
                break;
            default:
                prefix = "TXN";
        }

        // Generate random transaction ID
        return prefix + System.currentTimeMillis() + String.format("%03d", new Random().nextInt(1000));
    }
    /**
     * ✅ ENHANCED: Convert payment entity to response map with comprehensive data
     */
    private Map<String, Object> convertToResponseMap(MerchantPaymentHistory payment) {
        Map<String, Object> map = new HashMap<>();

        if (payment == null) {
            logger.warning("Null payment object provided to convertToResponseMap");
            return map;
        }

        try {
            map.put("id", payment.getId());
            map.put("merchantId", payment.getMerchantId());
            map.put("merchantName", payment.getMerchantName() != null ? payment.getMerchantName() : "Unknown");
            map.put("amount", payment.getAmount() != null ? payment.getAmount() : 0.0);
            map.put("paymentMethod", payment.getPaymentMethod() != null ? payment.getPaymentMethod() : "unknown");
            map.put("paymentMonth", payment.getPaymentMonth() != null ? payment.getPaymentMonth() : "unknown");
            map.put("paymentDate", payment.getPaymentDate());
            map.put("status", payment.getStatus() != null ? payment.getStatus() : "unknown");
            map.put("transactionId", payment.getTransactionId() != null ? payment.getTransactionId() : "");
            map.put("feeType", payment.getFeeType() != null ? payment.getFeeType() : "unknown");
            map.put("totalRevenue", payment.getTotalRevenue());
            map.put("feePercentage", payment.getFeePercentage());
            map.put("notes", payment.getNotes() != null ? payment.getNotes() : "");
            map.put("createdAt", payment.getCreatedAt());
            map.put("updatedAt", payment.getUpdatedAt());

            // ✅ ENHANCED: Add formatted display values
            map.put("formattedAmount", String.format("৳%.2f", payment.getAmount() != null ? payment.getAmount() : 0.0));
            map.put("formattedDate", payment.getPaymentDate() != null ?
                    payment.getPaymentDate().format(DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm")) : "Unknown");

            // ✅ ENHANCED: Add month name for better display
            if (payment.getPaymentMonth() != null && !payment.getPaymentMonth().isEmpty()) {
                try {
                    LocalDate date = LocalDate.parse(payment.getPaymentMonth() + "-01");
                    map.put("paymentMonthName", date.format(DateTimeFormatter.ofPattern("MMMM yyyy")));
                } catch (Exception e) {
                    map.put("paymentMonthName", payment.getPaymentMonth());
                }
            } else {
                map.put("paymentMonthName", "Unknown");
            }

            logger.fine("Successfully converted payment ID " + payment.getId() + " to response map");

        } catch (Exception e) {
            logger.warning("Error converting payment to response map: " + e.getMessage());
            // Return partial map even if some fields fail
        }

        return map;
    }

    /**
     * ✅ NEW: Get payment history with additional filters (optional enhancement)
     */
    public List<Map<String, Object>> getPaymentHistoryWithFilters(String merchantId, String status, Integer limit) {
        logger.info("Fetching filtered payment history for merchantId: " + merchantId + ", status: " + status + ", limit: " + limit);

        if (merchantId == null || merchantId.trim().isEmpty()) {
            throw new IllegalArgumentException("Invalid merchant ID");
        }

        String cleanMerchantId = merchantId.trim();

        try {
            List<MerchantPaymentHistory> payments;

            if (status != null && !status.trim().isEmpty()) {
                payments = paymentHistoryRepository.findByMerchantIdAndStatusOrderByPaymentDateDesc(cleanMerchantId, status.trim());
            } else {
                payments = paymentHistoryRepository.findByMerchantIdOrderByPaymentDateDesc(cleanMerchantId);
            }

            // Apply limit if specified
            if (limit != null && limit > 0 && payments.size() > limit) {
                payments = payments.subList(0, limit);
            }

            List<Map<String, Object>> response = new ArrayList<>();
            for (MerchantPaymentHistory payment : payments) {
                response.add(convertToResponseMap(payment));
            }

            logger.info("Successfully fetched " + response.size() + " filtered payment records");
            return response;

        } catch (Exception e) {
            logger.severe("Error fetching filtered payment history: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
   }