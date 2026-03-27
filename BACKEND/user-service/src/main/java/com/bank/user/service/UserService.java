package com.bank.user.service;

import com.bank.user.dto.UserRequest;
import com.bank.user.dto.UserResponse;
import com.bank.user.entity.User;
import com.bank.user.entity.UserStatus;
import com.bank.user.exception.ResourceNotFoundException;
import com.bank.user.exception.DuplicateResourceException;
import com.bank.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponse createUser(UserRequest request) {
        if (userRepository.existsByUsernameAndStatusNot(request.getUsername(), UserStatus.DELETED)) {
            throw new DuplicateResourceException("Username already exists");
        }
        if (userRepository.existsByEmailAndStatusNot(request.getEmail(), UserStatus.DELETED)) {
            throw new DuplicateResourceException("Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());

        User savedUser = userRepository.save(user);
        return mapToResponse(savedUser);
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .filter(u -> u.getStatus() != UserStatus.DELETED)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return mapToResponse(user);
    }

    public UserResponse getUserByUsername(String username) {
        User user = userRepository.findByUsernameAndStatusNot(username, UserStatus.DELETED)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        return mapToResponse(user);
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findByStatusNot(UserStatus.DELETED).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public UserResponse updateUser(Long id, UserRequest request) {
        User user = userRepository.findById(id)
                .filter(u -> u.getStatus() != UserStatus.DELETED)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (!user.getUsername().equals(request.getUsername()) &&
                userRepository.existsByUsernameAndStatusNot(request.getUsername(), UserStatus.DELETED)) {
            throw new DuplicateResourceException("Username already exists");
        }

        if (!user.getEmail().equals(request.getEmail()) &&
                userRepository.existsByEmailAndStatusNot(request.getEmail(), UserStatus.DELETED)) {
            throw new DuplicateResourceException("Email already exists");
        }

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());

        User updatedUser = userRepository.save(user);
        return mapToResponse(updatedUser);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .filter(u -> u.getStatus() != UserStatus.DELETED)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        user.setStatus(UserStatus.DELETED);
        userRepository.save(user);
    }

    private UserResponse mapToResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setStatus(user.getStatus());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }
}
