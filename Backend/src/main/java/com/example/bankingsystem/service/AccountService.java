package com.example.bankingsystem.service;

import com.example.bankingsystem.model.Account;
import com.example.bankingsystem.model.Transaction;
import com.example.bankingsystem.repository.AccountRepository;
import com.example.bankingsystem.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class AccountService {
    @Autowired
    AccountRepository accountRepository;
    
    @Autowired
    TransactionRepository transactionRepository;
    
    public Account createAccount(Account account){
        return accountRepository.save(account);
    }
    
    public List <Account> getAllAccounts(){
        return accountRepository.findAll();
    }
    
    public List<Account> getAccountsByEmail(String email){
        return accountRepository.findByEmail(email);
    }
    
    public Account getaccountbyid(String id){
        Optional<Account> account=accountRepository.findById(id);
        return account.orElse(null);
    }
    
    public Map<String, Boolean> deleteAccountbyid(String id){
        accountRepository.deleteById(id);
        Map<String, Boolean> response = new HashMap<>();
        response.put("success", true);
        return response;
    }
    
    public Account updateAccount(String id,Account updatedAccount){
        Optional<Account> existingAccount=accountRepository.findById(id);
        if(existingAccount.isPresent()){
            Account account=existingAccount.get();
            account.setHolderName(updatedAccount.getHolderName());
            account.setAccountNumber(updatedAccount.getAccountNumber());
            account.setBalance(updatedAccount.getBalance());
            if(updatedAccount.getEmail() != null) account.setEmail(updatedAccount.getEmail());
            if(updatedAccount.getAccountType() != null) account.setAccountType(updatedAccount.getAccountType());
            if(updatedAccount.getStatus() != null) account.setStatus(updatedAccount.getStatus());
            account.setUpdatedAt(java.time.LocalDateTime.now());
            return accountRepository.save(account);
        }
        throw new RuntimeException("Account not found");
    }
    
    public Transaction depositmoney(String id,double amount){
        Optional<Account> existingAccount = accountRepository.findById(id);
        if(existingAccount.isPresent()){
            Account account=existingAccount.get();
            double currentBalance=account.getBalance();
            account.setBalance(currentBalance+amount);
            account.setUpdatedAt(java.time.LocalDateTime.now());
            accountRepository.save(account);
            
            Transaction transaction = new Transaction(
                "TXN-" + System.currentTimeMillis(), "DEPOSIT", amount, "Deposit", null, account.getAccountNumber()
            );
            return transactionRepository.save(transaction);
        }
        throw new RuntimeException("Account not found");
    }
    
    public Transaction withdrawmoney(String id, double amount){
        Optional<Account> existingAccount= accountRepository.findById(id);
        if(existingAccount.isPresent()){
            Account account = existingAccount.get();
            double currentBalance=account.getBalance();
            if(currentBalance>=amount){
                account.setBalance(currentBalance-amount);
                account.setUpdatedAt(java.time.LocalDateTime.now());
                accountRepository.save(account);

                Transaction transaction = new Transaction(
                    "TXN-" + System.currentTimeMillis(), "WITHDRAWAL", amount, "Withdrawal", account.getAccountNumber(), null
                );
                return transactionRepository.save(transaction);
            }
            throw new RuntimeException("Amount Not Sufficient");
        }
        throw new RuntimeException("Account Not found");
    }
    
    public Transaction transfermoney(String senderid,String receiverid,Double amount){
        Optional<Account > sender = accountRepository.findById(senderid);
        Optional<Account > receiver=accountRepository.findById(receiverid);
        if(sender.isPresent()&& receiver.isPresent()){
            Account senderaccount=sender.get();
            Account receiveraccount=receiver.get();
            if(senderaccount.getBalance()>=amount){
                senderaccount.setBalance(senderaccount.getBalance()-amount);
                receiveraccount.setBalance(receiveraccount.getBalance()+amount);
                senderaccount.setUpdatedAt(java.time.LocalDateTime.now());
                receiveraccount.setUpdatedAt(java.time.LocalDateTime.now());
                accountRepository.save(senderaccount);
                accountRepository.save(receiveraccount);
                
                Transaction transaction = new Transaction(
                    "TXN-" + System.currentTimeMillis(), "TRANSFER", amount, "Transfer", senderaccount.getAccountNumber(), receiveraccount.getAccountNumber()
                );
                return transactionRepository.save(transaction);
            }
            throw new RuntimeException("Money Not Sufficient");
        }
        throw new RuntimeException("Account Not found");
    }
    
    public List<Transaction> getTransactionsByAccountId(String accountId) {
        Optional<Account> existingAccount = accountRepository.findById(accountId);
        if(existingAccount.isPresent()){
            Account account = existingAccount.get();
            return transactionRepository.findByFromAccountOrToAccount(account.getAccountNumber(), account.getAccountNumber());
        }
        return new ArrayList<>();
    }
}
