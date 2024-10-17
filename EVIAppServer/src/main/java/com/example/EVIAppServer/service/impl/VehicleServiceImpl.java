package com.example.EVIAppServer.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.EVIAppServer.entity.Bookings;
import com.example.EVIAppServer.entity.Vehicles;
import com.example.EVIAppServer.repository.SchedulesRepository;
import com.example.EVIAppServer.repository.VehicleRepository;
import com.example.EVIAppServer.service.VehicleService;

import jakarta.transaction.Transactional;

@Service
public class VehicleServiceImpl implements VehicleService{
	 @Autowired
	    private VehicleRepository vehicleRepository;
	 
	    public List<Vehicles>  findAll() {
	    	return vehicleRepository. findAll();
	    }
	    public Vehicles  save(Vehicles vehicles) {
	    	return vehicleRepository.save(vehicles);
	    }
	    
	    public Vehicles  findById(int id) {
	    	return vehicleRepository.findById(id);
	    }
	    public Vehicles update(Vehicles vehicle) {
	        if (vehicleRepository.existsById(vehicle.getVehicleId())) {
	            return vehicleRepository.save(vehicle);
	        } else {
	            throw new IllegalArgumentException("Vehicle not found");
	        }
	    }
	    @Transactional
	    public void deleteVehicle(int vehicleId) {
	        if (vehicleRepository.existsById(vehicleId)) {
	            vehicleRepository.deleteById(vehicleId);
	        } else {
	            throw new IllegalArgumentException("Vehicle not found with id: " + vehicleId);
	        }
	    }
}
