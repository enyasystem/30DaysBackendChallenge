package com.enyaelvis.day14_bank.repository;

import com.enyaelvis.day14_bank.model.Account;

import java.util.Collection;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

public class InMemoryAccountRepository {
    private final Map<Long, Account> store = new ConcurrentHashMap<>();

    public Account save(Account account) {
        store.put(account.getId(), account);
        return account;
    }

    public Optional<Account> findById(long id) {
        return Optional.ofNullable(store.get(id));
    }

    public Collection<Account> findAll() {
        return store.values();
    }

    public boolean deleteById(long id) {
        return store.remove(id) != null;
    }
}
