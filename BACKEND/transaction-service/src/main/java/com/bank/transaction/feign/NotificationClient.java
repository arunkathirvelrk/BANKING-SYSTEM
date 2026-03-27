package com.bank.transaction.feign;

import com.bank.transaction.dto.NotificationRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "notification-service", url = "http://localhost:8085/api/notifications")
public interface NotificationClient {

    @PostMapping
    void sendNotification(@RequestBody NotificationRequest request);
}
