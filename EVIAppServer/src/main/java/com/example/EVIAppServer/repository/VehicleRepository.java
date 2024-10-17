package com.example.EVIAppServer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.EVIAppServer.entity.User;
import com.example.EVIAppServer.entity.Vehicles;

public interface VehicleRepository extends JpaRepository<Vehicles, Integer>{
	List<Vehicles> findAll();
	Vehicles findById(int id);

}
