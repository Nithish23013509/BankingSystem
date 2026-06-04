package com.example.bankingsystem.controller;

import com.example.bankingsystem.model.Account;
import com.example.bankingsystem.model.Transaction;
import com.example.bankingsystem.service.AccountService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
@RestController

public class AccountController {

    @Autowired
    AccountService accountService;
    
    @PostMapping("/create")
    public Account createAccount(@Valid @RequestBody Account account){

        return accountService.createAccount(account);
    }
    @GetMapping("/account")
    public List<Account> getAccounts(){

        return accountService.getAllAccounts();
    }
    @GetMapping("account/{id}")
    public Account getAccount(@PathVariable Integer id){
        return accountService.getaccountbyid(id);
    }
    @DeleteMapping("account/{id}")
    public Map<String, Boolean> deleteAccount(@PathVariable Integer id){
        return accountService.deleteAccountbyid(id);

    }
    @PutMapping("/update/{id}")
    public Account updateAccount(@PathVariable Integer id,
                                 @RequestBody Account account){

        return accountService.updateAccount(id, account);
    }
    @PutMapping("/deposit/{id}/{amount}")
    public Transaction depositMoney(@PathVariable Integer id,@PathVariable Double amount){
        return accountService.depositmoney(id,amount);
    }
    @PutMapping("/withdraw/{id}/{amount}")
    public Transaction withdraw(@PathVariable Integer id,@PathVariable Double amount){
        return accountService.withdrawmoney(id,amount);
    }
    @Transactional
    @PutMapping("/transfer/{senderid}/{receiverid}/{amount}")
    public Transaction trasfer(@PathVariable Integer senderid,@PathVariable Integer receiverid,@PathVariable double amount){
        return accountService.transfermoney(senderid,receiverid,amount);
    }
    @GetMapping("account/{id}/transactions")
    public List<Transaction> getTransactions(@PathVariable Integer id){
        return accountService.getTransactionsByAccountId(id);
    }
}
