package com.bank.user.dto;

import com.bank.user.entity.UserStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private UserStatus status;
    private LocalDateTime createdAt;
}
