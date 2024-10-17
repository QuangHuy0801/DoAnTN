package com.example.EVIAppServer.model;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;

import com.example.EVIAppServer.entity.Bookings;
import com.example.EVIAppServer.entity.Vehicles;

import lombok.Data;
@Data
public class SearchScheduleDTO {
	 	private int scheduleId;
	    private RoutesDTO route;
	    private LocalDateTime departureTime;
	    private LocalDateTime arrivalTime;
	    private double price;
	    private List<BookingofScheduleDTO> bookings;
	    private VehiclesDTO vehicle;
}
