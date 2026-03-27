package com.bank.auth.service;

import com.bank.auth.dto.RegisterRequest;
import com.bank.auth.entity.UserCredential;
import com.bank.auth.repository.UserCredentialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserCredentialRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public String saveUser(RegisterRequest credential) {
        if (repository.existsByUsername(credential.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (repository.existsByEmail(credential.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        UserCredential user = new UserCredential();
        user.setUsername(credential.getUsername());
        user.setEmail(credential.getEmail());
        user.setPassword(passwordEncoder.encode(credential.getPassword()));
        repository.save(user);
        
        return "User added to the system";
    }

    public String generateToken(String username) {
        return jwtService.generateToken(username);
    }

    public void validateToken(String token) {
        jwtService.validateToken(token);
    }
}
