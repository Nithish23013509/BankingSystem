package com.example.bankingsystem.repository;

import com.example.bankingsystem.model.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends MongoRepository<Transaction, String> {
    List<Transaction> findByFromAccountOrToAccount(String fromAccount, String toAccount);
}
