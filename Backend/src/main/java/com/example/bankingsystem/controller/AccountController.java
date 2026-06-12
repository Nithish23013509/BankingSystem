package com.example.bankingsystem.controller;

import com.example.bankingsystem.model.Account;
import com.example.bankingsystem.model.Transaction;
import com.example.bankingsystem.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
public class AccountController {

    @Autowired
    AccountService accountService;
    @GetMapping("/test")
public String test() {
    return "NEW CODE DEPLOYED";
}
    @PostMapping("/create")
    public Account createAccount(@Valid @RequestBody Account account){
        return accountService.createAccount(account);
    }

    @GetMapping("/accounts")
    public List<Account> getAccounts(){
        return accountService.getAllAccounts();
    }

    @GetMapping("/my-accounts")
    public List<Account> getMyAccounts(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return accountService.getAccountsByEmail(email);
    }

    @GetMapping("account/{id}")
    public Account getAccount(@PathVariable String id){
        return accountService.getaccountbyid(id);
    }

    @DeleteMapping("account/{id}")
    public Map<String, Boolean> deleteAccount(@PathVariable String id){
        return accountService.deleteAccountbyid(id);
    }

    @PutMapping("/update/{id}")
    public Account updateAccount(@PathVariable String id,
                                 @RequestBody Account account){
        return accountService.updateAccount(id, account);
    }

    @PutMapping("/deposit/{id}/{amount}")
    public Transaction depositMoney(@PathVariable String id, @PathVariable Double amount){
        return accountService.depositmoney(id, amount);
    }

    @PutMapping("/withdraw/{id}/{amount}")
    public Transaction withdraw(@PathVariable String id, @PathVariable Double amount){
        return accountService.withdrawmoney(id, amount);
    }

    @PutMapping("/transfer/{senderid}/{receiverid}/{amount}")
    public Transaction trasfer(@PathVariable String senderid, @PathVariable String receiverid, @PathVariable double amount){
        return accountService.transfermoney(senderid, receiverid, amount);
    }

    @GetMapping("account/{id}/transactions")
    public List<Transaction> getTransactions(@PathVariable String id){
        return accountService.getTransactionsByAccountId(id);
    }
}
