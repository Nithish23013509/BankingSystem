package com.example.bankingsystem.controller;

import com.example.bankingsystem.dto.LoginRequest;
import com.example.bankingsystem.model.User;
import com.example.bankingsystem.repository.UserRepository;
import com.example.bankingsystem.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

   @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request){

    if("admin".equals(request.getUsername()) &&
       "1234".equals(request.getPassword())) {

        String token = JwtUtil.generateToken(request.getUsername());

        return ResponseEntity.ok(Map.of(
            "token", token,
            "username", request.getUsername()
        ));
    }

    return ResponseEntity.status(401)
            .body(Map.of("message", "Invalid Credentials"));
       
        // Fallback for demo admin user if not in DB yet
        if("admin".equals(request.getUsername()) && "1234".equals(request.getPassword())){
            String token = JwtUtil.generateToken(request.getUsername());
            return ResponseEntity.ok(Map.of(
                "token", token,
                "username", request.getUsername()
            ));
        }

        return ResponseEntity.status(401).body(Map.of("message", "Invalid Credentials"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody LoginRequest request) {
        if(request.getUsername() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username and password are required"));
        }
        
        Optional<User> existingUser = userRepository.findByUsername(request.getUsername());
        if(existingUser.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username already exists"));
        }

        User newUser = new User(request.getUsername(), passwordEncoder.encode(request.getPassword()));
        userRepository.save(newUser);

        return ResponseEntity.ok(Map.of("message", "Registration successful"));
    }
}