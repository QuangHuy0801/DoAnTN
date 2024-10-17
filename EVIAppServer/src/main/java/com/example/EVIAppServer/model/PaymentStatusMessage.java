package com.example.EVIAppServer.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Setter
@Getter
public class PaymentStatusMessage {
    private String orderId;
    private String status;

}
