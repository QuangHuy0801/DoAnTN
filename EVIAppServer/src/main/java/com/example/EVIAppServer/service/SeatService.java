package com.example.EVIAppServer.service;

import java.util.List;

import com.example.EVIAppServer.entity.Seats;

public interface SeatService {
	public List<Seats> getSeatsByVehicleId(int vehicleId);
	public Seats findById(int id);
	public Seats save(Seats seats);
}
