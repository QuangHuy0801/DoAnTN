package com.example.EVIAppServer.service;

import java.sql.Date;
import java.util.List;

import com.example.EVIAppServer.entity.Schedules;
import com.example.EVIAppServer.model.SearchScheduleDTO;

public interface SchedulesService {
	List<Schedules> findSchedulesWithEmptySeats(int fromProvinceId,int toProvinceId, Date departureDate);
	public List<Schedules> findAll();
	public Schedules getSchedulesById(int id);
	 public Schedules save(Schedules schedules);
	 public boolean existsById(int id);
	 public Schedules delete(int id);
}
