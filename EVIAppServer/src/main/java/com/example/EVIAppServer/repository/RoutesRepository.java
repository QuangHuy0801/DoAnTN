package com.example.EVIAppServer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.EVIAppServer.entity.Provinces;
import com.example.EVIAppServer.entity.Routes;

@Repository
public interface RoutesRepository extends JpaRepository<Routes, Integer>{
//	 List<Routes> findRoutesByStartProvinceAndEndProvince(String startProvince, String endProvince);
//	Routes findById(int id);
}
