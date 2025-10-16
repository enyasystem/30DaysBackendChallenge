package com.enyaelvis.day14_bank.model;

import java.math.BigDecimal;
import java.util.concurrent.atomic.AtomicLong;

public class Account {

    private static final AtomicLong ID_GEN = new AtomicLong(1);

    private final long id;
    private final String owner;
    private BigDecimal balance;

    public Account(String owner, BigDecimal initialBalance) {
        this.id = ID_GEN.getAndIncrement();
        this.owner = owner;
        this.balance = initialBalance == null ? BigDecimal.ZERO : initialBalance;
    }

    public long getId() { return id; }
    public String getOwner() { return owner; }
    public synchronized BigDecimal getBalance() { return balance; }

    public synchronized void deposit(BigDecimal amount) {
        balance = balance.add(amount);
    }

    public synchronized void withdraw(BigDecimal amount) {
        balance = balance.subtract(amount);
    }
}
