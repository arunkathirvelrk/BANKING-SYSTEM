package com.bank.transaction.dto;

import com.bank.transaction.entity.TransactionStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TransactionResponse {
    private Long id;
    private Long userId;
    private String sourceAccountNumber;
    private String targetAccountNumber;
    private BigDecimal amount;
    private TransactionStatus status;
    private String reason;
    private LocalDateTime timestamp;
}
