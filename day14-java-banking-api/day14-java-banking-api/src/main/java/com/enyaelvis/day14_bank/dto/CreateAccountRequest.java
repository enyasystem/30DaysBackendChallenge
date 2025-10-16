package com.enyaelvis.day14_bank.dto;

import java.math.BigDecimal;

public class CreateAccountRequest {
    public String owner;
    public BigDecimal initialBalance;

    public CreateAccountRequest() {}

    public CreateAccountRequest(String owner, BigDecimal initialBalance) {
        this.owner = owner;
        this.initialBalance = initialBalance;
    }
}
