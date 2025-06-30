package com.FoodBridgeBangladesh.Repository;

import com.FoodBridgeBangladesh.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    boolean existsByNationalId(String nationalId);

    Optional<User> findByEmail(String email);
}