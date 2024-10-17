package com.example.EVIAppServer.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.EVIAppServer.entity.RouteStations;
import com.example.EVIAppServer.entity.Routes;
import com.example.EVIAppServer.entity.Stations;
import com.example.EVIAppServer.entity.Vehicles;
import com.example.EVIAppServer.model.ProvincesDTO;
import com.example.EVIAppServer.model.RouteStationsDTO;
import com.example.EVIAppServer.model.StationUpdateDTO;
import com.example.EVIAppServer.model.StationsDTO;
import com.example.EVIAppServer.model.RoutesDTO;
import com.example.EVIAppServer.model.VehiclesDTO;
import com.example.EVIAppServer.service.ProvincesService;
import com.example.EVIAppServer.service.RoutesService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@CrossOrigin("*")
@RestController
public class RouteController {
	@Autowired
	RoutesService routesService;
	
	@Autowired
    private ModelMapper modelMapper;
	
	@GetMapping(path = "/getAllRoutes")
	public ResponseEntity<List<RoutesDTO>> getAllRoutes(){
		List<Routes> routes = routesService.getAllRoutes();
		List<RoutesDTO> listRoutesDTOs = routes.stream()
                .map(route -> modelMapper.map(route, RoutesDTO.class))
                .collect(Collectors.toList());
        System.out.println(listRoutesDTOs);
		return new ResponseEntity<>(listRoutesDTOs, HttpStatus.OK);
	}
	

	
	 @PostMapping(path = "/addRoutes")
	    public ResponseEntity<Routes> addRoutes(
	            @RequestParam String startLocation,
	            @RequestParam String endLocation,
	            @RequestParam int distance) {

	        try {
	            Routes routes = Routes.builder()
	                    .startLocation(startLocation)
	                    .endLocation(endLocation)
	                    .distance(distance)
	                    .build();
	            
	            Routes savedRoutes = routesService.save(routes);
	            return ResponseEntity.ok(savedRoutes); 
	        } catch (Exception e) {
	            return ResponseEntity.status(500).build();
	        }
	    }
	 
	 
	 @PutMapping(path = "/updateRoutes")
	    public ResponseEntity<Routes> updateRoutes(  
	    		@RequestParam int routeId,
	    		@RequestParam String startLocation,
	            @RequestParam String endLocation,
	            @RequestParam int distance,
	            @RequestParam String stations) {
	        try {
	        	System.out.println("123"+stations);
	        	ObjectMapper objectMapper = new ObjectMapper();

	            List<RouteStations> routeStationsList = objectMapper.readValue(stations, new TypeReference<List<RouteStations>>() {});
	            System.out.println(routeStationsList.size());
	            Routes routes = Routes.builder()
	            		.routeId(routeId)
	                    .startLocation(startLocation)
	                    .endLocation(endLocation)
	                    .distance(distance)
	                    .build();
	            Routes updatedRoutes = routesService.updateWithNewStations(routes, routeStationsList);
//	        	Routes updatedRoutes = routesService.update(routes);
	            return ResponseEntity.ok(routes); // Return the updated vehicle with a 200 status
	        } catch (Exception e) {
	            // Handle exceptions here
	            return ResponseEntity.status(500).build(); // Return 500 status on error
	        }
	    }
	 
	 @DeleteMapping("/deleteRoute/{routeId}")
	    public ResponseEntity<Void> deleteRoute(@PathVariable("routeId") int routeId) {
	        try {
	            routesService.deleteRoute(routeId);
	            return ResponseEntity.noContent().build(); // Return 204 No Content
	        } catch (Exception e) {
	            // Handle exceptions here
	            return ResponseEntity.status(500).build(); // Return 500 Internal Server Error
	        }
	    }
	 
		@GetMapping(path = "/getAllStations")
		public ResponseEntity<List<StationsDTO>> getAllStations(){
			List<Stations> stations = routesService.getAllStations();
			List<StationsDTO> listStationsDTODTOs = stations.stream()
	                .map(route -> modelMapper.map(route, StationsDTO.class))
	                .collect(Collectors.toList());
	        System.out.println(listStationsDTODTOs);
			return new ResponseEntity<>(listStationsDTODTOs, HttpStatus.OK);
		}
		
}
