package com.enyaelvis.day14_bank.service;

import com.enyaelvis.day14_bank.model.Account;
import com.enyaelvis.day14_bank.repository.InMemoryAccountRepository;

import java.math.BigDecimal;
import java.util.NoSuchElementException;
import java.util.Collection;

public class AccountService {

    private final InMemoryAccountRepository repo;

    public AccountService(InMemoryAccountRepository repo) {
        this.repo = repo;
    }

    public Account createAccount(String owner, BigDecimal initialBalance) {
        if (owner == null || owner.isBlank()) throw new IllegalArgumentException("owner required");
        if (initialBalance == null) initialBalance = BigDecimal.ZERO;
        if (initialBalance.compareTo(BigDecimal.ZERO) < 0) throw new IllegalArgumentException("initialBalance must be >= 0");
        var acc = new Account(owner, initialBalance);
        return repo.save(acc);
    }

    public Account getAccount(long id) {
        return repo.findById(id).orElseThrow(() -> new NoSuchElementException("account not found"));
    }

    public Collection<Account> listAll() {
        return repo.findAll();
    }

    public void deleteAccount(long id) {
        var acc = repo.findById(id).orElseThrow(() -> new NoSuchElementException("account not found"));
        if (acc.getBalance().compareTo(BigDecimal.ZERO) != 0) {
            throw new IllegalStateException("account balance must be zero to delete");
        }
        boolean removed = repo.deleteById(id);
        if (!removed) throw new NoSuchElementException("account not found");
    }

    public synchronized void transfer(long fromId, long toId, BigDecimal amount) {
        if (fromId == toId) throw new IllegalArgumentException("from and to must differ");
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) throw new IllegalArgumentException("amount must be > 0");

        var from = repo.findById(fromId).orElseThrow(() -> new NoSuchElementException("from not found"));
        var to = repo.findById(toId).orElseThrow(() -> new NoSuchElementException("to not found"));

        synchronized (from) {
            synchronized (to) {
                if (from.getBalance().compareTo(amount) < 0) throw new IllegalStateException("insufficient funds");
                from.withdraw(amount);
                to.deposit(amount);
            }
        }
    }
}
