package com.example.EVIAppServer.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.EVIAppServer.entity.Seats;
import com.example.EVIAppServer.repository.SeatsRepository;
import com.example.EVIAppServer.service.SeatService;

@Service
public class SeatServiceImpl implements SeatService{
    @Autowired
    private SeatsRepository seatsRepository;
    
	public List<Seats> getSeatsByVehicleId(int vehicleId) {
        return seatsRepository.findByVehicleVehicleId(vehicleId);
    }
	
	public Seats findById(int id) {
        return seatsRepository.findById(id);
    }
	public Seats save(Seats seats) {
        return seatsRepository.save(seats);
    }
	
}
