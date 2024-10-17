package com.example.EVIAppServer.service;

import java.util.List;

import com.example.EVIAppServer.entity.Vehicles;

public interface VehicleService {
	public List<Vehicles> findAll();
	 public Vehicles  save(Vehicles vehicles) ;
	 public Vehicles update(Vehicles vehicle) ;
	 public void deleteVehicle(int vehicleId) ;
	 public Vehicles  findById(int id);
}
