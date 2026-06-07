package com.example.bankingsystem.controller;

import com.example.bankingsystem.model.User;
import com.example.bankingsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/users")
    public List<Map<String, String>> getAllUsers() {
        List<User> users = userRepository.findAll();
        
        // Map users to remove passwords before sending to the client
        return users.stream().map(user -> Map.of(
            "id", user.getId(),
            "email", user.getEmail(),
            "role", user.getRole()
        )).collect(Collectors.toList());
    }
}
