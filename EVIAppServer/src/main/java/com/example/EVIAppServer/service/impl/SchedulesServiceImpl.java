package com.example.EVIAppServer.service.impl;

import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.EVIAppServer.entity.Schedules;
import com.example.EVIAppServer.model.SearchScheduleDTO;
import com.example.EVIAppServer.repository.RoutesRepository;
import com.example.EVIAppServer.repository.SchedulesRepository;
import com.example.EVIAppServer.service.SchedulesService;
@Service
public class SchedulesServiceImpl implements SchedulesService{
	
	 @Autowired
	    private SchedulesRepository schedulesRepository;
	 public List<Schedules> findSchedulesWithEmptySeats(int fromProvinceId,int toProvinceId, Date departureDate){
		return schedulesRepository.findSchedulesWithEmptySeats(fromProvinceId, toProvinceId, departureDate);
	}
	 
	 public List<Schedules> findAll(){
		return schedulesRepository.findAll();
	}
	 public Schedules getSchedulesById(int id){
		return schedulesRepository.findById(id);
	}
	 
	 public Schedules save(Schedules schedules){
		return schedulesRepository.save(schedules);
	}
	 public Schedules delete(int id){
		return schedulesRepository.deleteById(id);
	}
	 
	 public boolean existsById(int id){
		return schedulesRepository.existsById(id);
	}
	 
}
