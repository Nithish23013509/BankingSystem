package com.example.bankingsystem.config;

import com.example.bankingsystem.model.User;
import com.example.bankingsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        Optional<User> adminUser = userRepository.findByEmail("admin@gmail.com");
        if (adminUser.isEmpty()) {
            User admin = new User("admin@gmail.com", passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println("✓ Default admin user created (admin@gmail.com / admin123)");
        } else {
            System.out.println("✓ Admin user already exists");
        }
    }
}
