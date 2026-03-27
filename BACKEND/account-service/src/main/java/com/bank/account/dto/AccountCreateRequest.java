package com.bank.account.dto;

import com.bank.account.entity.AccountType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AccountCreateRequest {
    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Account Type is required")
    private AccountType accountType;
}
