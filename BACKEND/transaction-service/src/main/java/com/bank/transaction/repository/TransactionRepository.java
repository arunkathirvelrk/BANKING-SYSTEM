package com.bank.transaction.repository;

import com.bank.transaction.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findBySourceAccountNumber(String sourceAccountNumber);
    List<Transaction> findByTargetAccountNumber(String targetAccountNumber);
    List<Transaction> findByUserId(Long userId);
    
    long countBySourceAccountNumberAndTimestampAfter(String sourceAccountNumber, LocalDateTime timestamp);
}
