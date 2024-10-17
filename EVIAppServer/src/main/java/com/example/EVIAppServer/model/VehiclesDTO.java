package com.example.EVIAppServer.model;

import java.util.List;

import com.example.EVIAppServer.entity.Schedules;
import com.example.EVIAppServer.entity.Seats;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;
@Data
public class VehiclesDTO {
	    private int vehicleId;
	    private String vehicleNumber;
	    private String vehicleType;
	    private int totalSeats;
	    private List<SeatsDTO> seats;
}
