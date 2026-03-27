package com.bank.account.dto;

import com.bank.account.entity.AccountType;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AccountResponse {
    private Long id;
    private String accountNumber;
    private Long userId;
    private AccountType accountType;
    private BigDecimal balance;
    private LocalDateTime createdAt;
}
