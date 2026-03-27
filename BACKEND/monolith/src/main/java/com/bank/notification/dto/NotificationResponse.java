package com.bank.notification.dto;

import com.bank.notification.entity.NotificationType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationResponse {
    private Long id;
    private Long userId;
    private NotificationType type;
    private String message;
    private boolean isRead;
    private LocalDateTime timestamp;
}
