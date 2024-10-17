package com.example.EVIAppServer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.EVIAppServer.entity.Stations;
@Repository
public interface StationsRepository extends JpaRepository<Stations, Integer>{
	Stations findById(int id);
}
