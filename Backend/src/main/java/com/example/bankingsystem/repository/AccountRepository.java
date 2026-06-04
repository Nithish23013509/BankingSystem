package com.example.bankingsystem.repository;

import com.example.bankingsystem.model.Account;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AccountRepository extends MongoRepository<Account, String> {
}
