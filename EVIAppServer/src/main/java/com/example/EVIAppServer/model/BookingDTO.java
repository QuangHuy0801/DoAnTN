package com.example.EVIAppServer.model;

import java.util.Date;
import java.util.List;

import com.example.EVIAppServer.entity.BookingDetails;
import com.example.EVIAppServer.entity.Schedules;
import com.example.EVIAppServer.entity.Stations;
import com.example.EVIAppServer.entity.User;

import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingDTO {
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
	    private ScheduleDTO schedule;
	    private String qrCode;
	    private List<BookingDetailsDTO> bookingDetails;
}
