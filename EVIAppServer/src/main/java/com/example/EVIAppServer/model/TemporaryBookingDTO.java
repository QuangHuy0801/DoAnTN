package com.example.EVIAppServer.model;

import lombok.Data;
import lombok.ToString;

import java.util.List;
import java.util.Date;

@Data
public class TemporaryBookingDTO {
    private String userId;
    private String status;
    private Integer pickupStationId;
    private Integer dropoffStationId;
    private String passengerName;
    private String passengerEmail;
    private String passengerPhone;
    private Integer scheduleId;
    private Date bookingDate;
    private List<String> selectedSeats;
}