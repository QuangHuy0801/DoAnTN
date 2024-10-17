package com.example.EVIAppServer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.EVIAppServer.entity.RouteStations;
import com.example.EVIAppServer.entity.Routes;
import com.example.EVIAppServer.entity.Schedules;

@Repository
public interface RouteStationsRepository  extends JpaRepository<RouteStations, Integer>{
	void deleteByRoute(Routes routes);
}
