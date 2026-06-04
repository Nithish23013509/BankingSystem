package com.example.bankingsystem.controller;

import com.example.bankingsystem.dto.LoginRequest;
import com.example.bankingsystem.model.User;
import com.example.bankingsystem.repository.UserRepository;
import com.example.bankingsystem.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request){

        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());

        if(userOpt.isPresent()) {
            User user = userOpt.get();
            if(passwordEncoder.matches(request.getPassword(), user.getPassword())){
                return JwtUtil.generateToken(user.getUsername());
            }
        }
        
        // Fallback for demo admin user if not in DB yet
        if("admin".equals(request.getUsername()) && "1234".equals(request.getPassword())){
            return JwtUtil.generateToken(request.getUsername());
        }

        return "Invalid Credentials";
    }

    @PostMapping("/register")
    public String register(@RequestBody LoginRequest request) {
        if(request.getUsername() == null || request.getPassword() == null) {
            return "Username and password are required";
        }
        
        Optional<User> existingUser = userRepository.findByUsername(request.getUsername());
        if(existingUser.isPresent()) {
            return "Username already exists";
        }

        User newUser = new User(request.getUsername(), passwordEncoder.encode(request.getPassword()));
        userRepository.save(newUser);

        return "Registration successful";
    }
}