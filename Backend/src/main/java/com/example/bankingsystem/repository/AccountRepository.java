package com.example.bankingsystem.repository;

import com.example.bankingsystem.model.Account;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AccountRepository extends MongoRepository<Account, String> {
    List<Account> findByEmail(String email);
}
