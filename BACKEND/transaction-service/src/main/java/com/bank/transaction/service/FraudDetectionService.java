package com.bank.transaction.service;

import com.bank.transaction.entity.Transaction;
import com.bank.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class FraudDetectionService {

    private final TransactionRepository transactionRepository;
    
    private static final BigDecimal AMOUNT_LIMIT = new BigDecimal("50000");
    private static final int MAX_TXNS_IN_10_MIN = 5;

    public boolean isFraudulent(Transaction transaction) {
        if (transaction.getAmount().compareTo(AMOUNT_LIMIT) > 0) {
            transaction.setReason("Amount exceeds 50,000 limit");
            return true;
        }

        LocalDateTime tenMinutesAgo = LocalDateTime.now().minusMinutes(10);
        long recentTxns = transactionRepository.countBySourceAccountNumberAndTimestampAfter(
                transaction.getSourceAccountNumber(), tenMinutesAgo);
                
        if (recentTxns >= MAX_TXNS_IN_10_MIN) {
            transaction.setReason("Exceeds frequency limit (5 txns in 10 minutes)");
            return true;
        }

        return false;
    }
}
