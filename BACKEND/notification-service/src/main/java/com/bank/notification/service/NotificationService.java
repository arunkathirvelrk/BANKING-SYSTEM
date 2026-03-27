package com.bank.notification.service;

import com.bank.notification.dto.NotificationRequest;
import com.bank.notification.dto.NotificationResponse;
import com.bank.notification.entity.Notification;
import com.bank.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationResponse createNotification(NotificationRequest request) {
        Notification notification = new Notification();
        notification.setUserId(request.getUserId());
        notification.setType(request.getType());
        notification.setMessage(request.getMessage());
        notification.setRead(false);

        Notification saved = notificationRepository.save(notification);
        return mapToResponse(saved);
    }

    public List<NotificationResponse> getNotificationsByUserId(Long userId) {
        return notificationRepository.findByUserIdOrderByTimestampDesc(userId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<NotificationResponse> getUnreadNotificationsByUserId(Long userId) {
        return notificationRepository.findByUserIdAndIsReadOrderByTimestampDesc(userId, false)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
        });
    }

    private NotificationResponse mapToResponse(Notification notification) {
        NotificationResponse res = new NotificationResponse();
        res.setId(notification.getId());
        res.setUserId(notification.getUserId());
        res.setType(notification.getType());
        res.setMessage(notification.getMessage());
        res.setRead(notification.isRead());
        res.setTimestamp(notification.getTimestamp());
        return res;
    }
}
