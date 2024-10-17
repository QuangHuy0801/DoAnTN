package com.example.EVIAppServer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.EVIAppServer.entity.Provinces;

@Repository
public interface ProvincesRepository extends JpaRepository<Provinces, Integer>{

}
