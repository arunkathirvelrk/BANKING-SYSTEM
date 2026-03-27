package com.bank.transaction.service;

import com.bank.transaction.dto.NotificationRequest;
import com.bank.transaction.dto.TransactionRequest;
import com.bank.transaction.dto.TransactionRequestDto;
import com.bank.transaction.dto.TransactionResponse;
import com.bank.transaction.entity.Transaction;
import com.bank.transaction.entity.TransactionStatus;
import com.bank.transaction.feign.AccountClient;
import com.bank.transaction.feign.NotificationClient;
import com.bank.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final FraudDetectionService fraudDetectionService;
    private final AccountClient accountClient;
    private final NotificationClient notificationClient;

    public TransactionResponse transferMoney(TransactionRequest request) {
        Transaction transaction = new Transaction();
        transaction.setUserId(request.getUserId());
        transaction.setSourceAccountNumber(request.getSourceAccountNumber());
        transaction.setTargetAccountNumber(request.getTargetAccountNumber());
        transaction.setAmount(request.getAmount());
        transaction.setStatus(TransactionStatus.PENDING);

        transaction = transactionRepository.save(transaction);

        if (fraudDetectionService.isFraudulent(transaction)) {
            transaction.setStatus(TransactionStatus.FLAGGED);
            transactionRepository.save(transaction);
            
            sendFraudAlert(transaction);
            return mapToResponse(transaction);
        }

        try {
            TransactionRequestDto txnDto = new TransactionRequestDto(request.getAmount());
            accountClient.withdraw(request.getSourceAccountNumber(), txnDto);
            accountClient.deposit(request.getTargetAccountNumber(), txnDto);
            
            transaction.setStatus(TransactionStatus.COMPLETED);
            transaction.setReason("Transfer successful");
            
            sendStandardNotification(transaction);

        } catch (Exception e) {
            transaction.setStatus(TransactionStatus.FAILED);
            transaction.setReason("Transaction failed: " + e.getMessage());
        }

        transaction = transactionRepository.save(transaction);
        return mapToResponse(transaction);
    }
    
    public List<TransactionResponse> getTransactionsByUserId(Long userId) {
        return transactionRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private void sendFraudAlert(Transaction transaction) {
        try {
            NotificationRequest notif = new NotificationRequest(
                transaction.getUserId(),
                "FRAUD_ALERT",
                "Fraudulent transaction flagged: " + transaction.getReason()
            );
            notificationClient.sendNotification(notif);
        } catch(Exception ignored) {}
    }

    private void sendStandardNotification(Transaction transaction) {
        try {
            NotificationRequest notif = new NotificationRequest(
                transaction.getUserId(),
                "TRANSACTION",
                "Successfully transferred " + transaction.getAmount() + " to " + transaction.getTargetAccountNumber()
            );
            notificationClient.sendNotification(notif);
        } catch(Exception ignored) {}
    }

    private TransactionResponse mapToResponse(Transaction transaction) {
        TransactionResponse r = new TransactionResponse();
        r.setId(transaction.getId());
        r.setUserId(transaction.getUserId());
        r.setSourceAccountNumber(transaction.getSourceAccountNumber());
        r.setTargetAccountNumber(transaction.getTargetAccountNumber());
        r.setAmount(transaction.getAmount());
        r.setStatus(transaction.getStatus());
        r.setReason(transaction.getReason());
        r.setTimestamp(transaction.getTimestamp());
        return r;
    }
}
