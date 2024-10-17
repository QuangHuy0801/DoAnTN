package com.example.EVIAppServer.model;

import com.example.EVIAppServer.entity.Schedules;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingofScheduleDTO {
    private int bookingId;
    private UserDTO user;
	private String status;
    private StationsDTO pickupStation;
    private StationsDTO dropoffStation;
    private String passengerName;
    private String passengerEmail;
    private String passengerPhone;
    private Date bookingDate;
    private String paymentMethod;
    private boolean isPaid;
    private String qrCode;
    private List<BookingDetailsDTO> bookingDetails;
}