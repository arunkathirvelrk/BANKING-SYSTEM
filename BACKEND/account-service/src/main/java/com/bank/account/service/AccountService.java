package com.bank.account.service;

import com.bank.account.dto.AccountCreateRequest;
import com.bank.account.dto.AccountResponse;
import com.bank.account.dto.TransactionRequest;
import com.bank.account.entity.Account;
import com.bank.account.exception.InsufficientBalanceException;
import com.bank.account.exception.ResourceNotFoundException;
import com.bank.account.repository.AccountRepository;
import com.bank.account.util.AccountNumberGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;

    public AccountResponse createAccount(AccountCreateRequest request) {
        Account account = new Account();
        account.setUserId(request.getUserId());
        account.setAccountType(request.getAccountType());
        account.setBalance(BigDecimal.ZERO);
        
        // Generate a unique account number
        String accNumber;
        do {
            accNumber = AccountNumberGenerator.generate();
        } while(accountRepository.findByAccountNumber(accNumber).isPresent());
        
        account.setAccountNumber(accNumber);
        
        Account savedAccount = accountRepository.save(account);
        return mapToResponse(savedAccount);
    }

    public AccountResponse getAccountByNumber(String accountNumber) {
        Account account = getAccountEntity(accountNumber);
        return mapToResponse(account);
    }

    public List<AccountResponse> getAccountsByUserId(Long userId) {
        return accountRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AccountResponse deposit(String accountNumber, TransactionRequest request) {
        Account account = getAccountEntity(accountNumber);
        account.setBalance(account.getBalance().add(request.getAmount()));
        Account updatedAccount = accountRepository.save(account);
        return mapToResponse(updatedAccount);
    }

    @Transactional
    public AccountResponse withdraw(String accountNumber, TransactionRequest request) {
        Account account = getAccountEntity(accountNumber);
        if (account.getBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientBalanceException("Insufficient balance for withdrawal");
        }
        account.setBalance(account.getBalance().subtract(request.getAmount()));
        Account updatedAccount = accountRepository.save(account);
        return mapToResponse(updatedAccount);
    }

    private Account getAccountEntity(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found: " + accountNumber));
    }

    private AccountResponse mapToResponse(Account account) {
        AccountResponse response = new AccountResponse();
        response.setId(account.getId());
        response.setAccountNumber(account.getAccountNumber());
        response.setUserId(account.getUserId());
        response.setAccountType(account.getAccountType());
        response.setBalance(account.getBalance());
        response.setCreatedAt(account.getCreatedAt());
        return response;
    }
}
