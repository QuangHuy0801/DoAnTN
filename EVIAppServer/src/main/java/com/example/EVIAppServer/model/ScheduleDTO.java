package com.example.EVIAppServer.model;

import java.time.LocalDateTime;
import java.util.List;

import com.example.EVIAppServer.entity.Bookings;
import com.example.EVIAppServer.entity.Routes;
import com.example.EVIAppServer.entity.Vehicles;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Data;
@Data
public class ScheduleDTO {
	    private int scheduleId;
	    private RoutesDTO route;
	    private LocalDateTime  departureTime;
	    private LocalDateTime  arrivalTime;
	    private double price;
	    private VehiclesDTO vehicle;
}
