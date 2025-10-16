package com.enyaelvis.day14_bank.dto;

import java.math.BigDecimal;

public class TransferRequest {
    public long fromId;
    public long toId;
    public BigDecimal amount;

    public TransferRequest() {}

    public TransferRequest(long fromId, long toId, BigDecimal amount) {
        this.fromId = fromId;
        this.toId = toId;
        this.amount = amount;
    }
}
