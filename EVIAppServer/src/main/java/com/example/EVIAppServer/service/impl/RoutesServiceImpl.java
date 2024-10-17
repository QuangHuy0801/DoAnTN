package com.example.EVIAppServer.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.EVIAppServer.entity.RouteStations;
import com.example.EVIAppServer.entity.Routes;
import com.example.EVIAppServer.entity.Stations;
import com.example.EVIAppServer.entity.Vehicles;
import com.example.EVIAppServer.repository.RouteStationsRepository;
import com.example.EVIAppServer.repository.RoutesRepository;
import com.example.EVIAppServer.repository.StationsRepository;
import com.example.EVIAppServer.service.RoutesService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
@Service
public class RoutesServiceImpl implements RoutesService {
	 @Autowired
	    private RoutesRepository routesRepository;
	 @Autowired
	    private RouteStationsRepository routeStationsRepository;
	 
	 @Autowired
	    private StationsRepository stationsRepository;

//	    @Override
//	    public List<Routes> findRoutesByStartAndEndProvince(String startProvince, String endProvince) {
//	        // Gọi phương thức từ repository để lấy danh sách tuyến xe qua các trạm đó
//	        return routesRepository.findRoutesByStartAndEndProvince(startProvince, endProvince);
//	    }
	 public List<Routes> getAllRoutes (){
		 return routesRepository.findAll();
	 }
	 
	 
	 public List<Stations> getAllStations (){
		 return stationsRepository.findAll();
	 }
	 
	 public Routes findById (int id){
		 return routesRepository.findById(id)
		            .orElseThrow(() -> new EntityNotFoundException("Route not found"));
	 }
	 
	 public Routes save (Routes routes){
		 return routesRepository.save(routes);
	 }
	 
	    public Routes update(Routes routes) {
	        if (routesRepository.existsById(routes.getRouteId())) {
	            return routesRepository.save(routes);
	        } else {
	            throw new IllegalArgumentException("Vehicle not found");
	        }
	    }
	    @Transactional
	    public void deleteRoute(int routeID)  {
	        if (routesRepository.existsById(routeID)) {
	        	routesRepository.deleteById(routeID);
	        } else {
	            throw new IllegalArgumentException("Route not found with id: " + routeID);
	        }
	    }
	    
	    @Transactional
	    public Routes updateWithNewStations(Routes routes, List<RouteStations> newStations) {
	        // Tìm route hiện có hoặc tạo mới nếu không tồn tại
	        Routes existingRoute = routesRepository.findById(routes.getRouteId())
	            .orElseThrow(() -> new EntityNotFoundException("Route not found"));

	        // Cập nhật thông tin cơ bản của route
	        existingRoute.setStartLocation(routes.getStartLocation());
	        existingRoute.setEndLocation(routes.getEndLocation());
	        existingRoute.setDistance(routes.getDistance());

	        // Xóa tất cả RouteStations hiện có
	        routeStationsRepository.deleteByRoute(existingRoute);

	        // Thêm các RouteStations mới
	        List<RouteStations> updatedStations = new ArrayList<>();
	        for (int i = 0; i < newStations.size(); i++) {
	            RouteStations newStation = newStations.get(i);
	            newStation.setRoute(existingRoute);
	            newStation.setStopOrder(i + 1); // Cập nhật stopOrder
	            updatedStations.add(routeStationsRepository.save(newStation));
	        }

	        existingRoute.setRouteStations(updatedStations);
	        return routesRepository.save(existingRoute);
	    }
}
