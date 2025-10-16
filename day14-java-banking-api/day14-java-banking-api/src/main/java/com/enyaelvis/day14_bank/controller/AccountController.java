package com.enyaelvis.day14_bank.controller;

import com.enyaelvis.day14_bank.dto.CreateAccountRequest;
import com.enyaelvis.day14_bank.dto.TransferRequest;
import com.enyaelvis.day14_bank.model.Account;
import com.enyaelvis.day14_bank.repository.InMemoryAccountRepository;
import com.enyaelvis.day14_bank.service.AccountService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/accounts")
public class AccountController {

    private final AccountService service;

    public AccountController() {
        // simple wiring for the learning project
        var repo = new InMemoryAccountRepository();
        this.service = new AccountService(repo);
    }

    @PostMapping
    public ResponseEntity<Account> create(@RequestBody CreateAccountRequest req) {
        var acc = service.createAccount(req.owner, req.initialBalance);
        return ResponseEntity.created(URI.create("/accounts/" + acc.getId())).body(acc);
    }

    @GetMapping
    public ResponseEntity<java.util.Collection<Account>> listAll() {
        return ResponseEntity.ok(service.listAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable long id) {
        try {
            service.deleteAccount(id);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.unprocessableEntity().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Account> get(@PathVariable long id) {
        var acc = service.getAccount(id);
        return ResponseEntity.ok(acc);
    }

    @PostMapping("/transfer")
    @ResponseStatus(HttpStatus.OK)
    public void transfer(@RequestBody TransferRequest req) {
        service.transfer(req.fromId, req.toId, req.amount);
    }
}
