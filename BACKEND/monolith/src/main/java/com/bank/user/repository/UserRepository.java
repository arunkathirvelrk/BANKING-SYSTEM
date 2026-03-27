package com.bank.user.repository;

import com.bank.user.entity.User;
import com.bank.user.entity.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsernameAndStatusNot(String username, UserStatus status);
    Optional<User> findByEmailAndStatusNot(String email, UserStatus status);
    List<User> findByStatusNot(UserStatus status);
    boolean existsByUsernameAndStatusNot(String username, UserStatus status);
    boolean existsByEmailAndStatusNot(String email, UserStatus status);
}
