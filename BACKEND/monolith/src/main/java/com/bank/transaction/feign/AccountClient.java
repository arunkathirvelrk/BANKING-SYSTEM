package com.bank.transaction.feign;

import com.bank.transaction.dto.AccountResponse;
import com.bank.transaction.dto.TransactionRequestDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "account-service", url = "http://localhost:8080/api/accounts")
public interface AccountClient {
    
    @GetMapping("/{accountNumber}")
    AccountResponse getAccount(@PathVariable("accountNumber") String accountNumber);
    
    @PostMapping("/{accountNumber}/withdraw")
    AccountResponse withdraw(@PathVariable("accountNumber") String accountNumber, @RequestBody TransactionRequestDto request);
    
    @PostMapping("/{accountNumber}/deposit")
    AccountResponse deposit(@PathVariable("accountNumber") String accountNumber, @RequestBody TransactionRequestDto request);
}
