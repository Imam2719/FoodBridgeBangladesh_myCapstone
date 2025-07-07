package com.FoodBridgeBangladesh.Repository;

import com.FoodBridgeBangladesh.Model.User;
import com.FoodBridgeBangladesh.Model.dto.UserDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    boolean existsByNationalId(String nationalId);

    Optional<User> findByEmail(String email);

    List<User> findByUserType(String userType);

    List<User> findByIdInAndUserType(List<Long> ids, String userType);

    List<User> findByUserTypeAndIsVerifiedTrue(String userType);

    long countByUserType(String userType);

    long countByUserTypeAndIsVerifiedTrue(String userType);

    @Query("SELECT new com.FoodBridgeBangladesh.Model.dto.UserDTO(" +
            "u.id, u.firstName, u.lastName, u.email, u.phone, u.userType, " +
            "u.bloodGroup, u.address, u.addressDescription, u.isVerified, u.createdAt) " +
            "FROM User u WHERE u.userType = 'donor'")
    List<UserDTO> findDonorsForEmergency();

    @Query("SELECT new com.FoodBridgeBangladesh.Model.dto.UserDTO(" +
            "u.id, u.firstName, u.lastName, u.email, u.phone, u.userType, " +
            "u.bloodGroup, u.address, u.addressDescription, u.isVerified, u.createdAt) " +
            "FROM User u WHERE u.id IN :donorIds AND u.userType = 'donor'")
    List<UserDTO> findDonorsByIdsForEmergency(@Param("donorIds") List<Long> donorIds);

    @Query("SELECT COUNT(u) FROM User u WHERE u.userType = 'donor'")
    long countDonorsOnly();
}