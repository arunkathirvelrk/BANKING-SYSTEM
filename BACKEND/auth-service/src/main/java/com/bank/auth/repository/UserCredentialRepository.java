package com.bank.auth.repository;

import com.bank.auth.entity.UserCredential;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserCredentialRepository extends JpaRepository<UserCredential, Long> {
    Optional<UserCredential> findByUsername(String username);
    Optional<UserCredential> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
