package com.example.EVIAppServer.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.EVIAppServer.entity.Bookings;
import com.example.EVIAppServer.entity.Seats;
import com.example.EVIAppServer.entity.Vehicles;
import com.example.EVIAppServer.model.BookingDTO;
import com.example.EVIAppServer.model.SeatsDTO;
import com.example.EVIAppServer.model.VehiclesDTO;
import com.example.EVIAppServer.service.BookingService;
import com.example.EVIAppServer.service.SeatService;
import com.example.EVIAppServer.service.VehicleService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;


@CrossOrigin("*")
@RestController
public class VehicalController {
    @Autowired
    private VehicleService vehicleService;
    @Autowired
    private SeatService seatService;
	@Autowired
    private ModelMapper modelMapper;
	 @GetMapping(path = "/getAllVehical")
	    public ResponseEntity<List<VehiclesDTO>> getAllVehical() {
	        List<Vehicles> vehicles = vehicleService.findAll();
	        if (vehicles == null || vehicles.isEmpty()) {
	            return ResponseEntity.notFound().build();  // Return 404 if no bookings are found
	        }
	        List<VehiclesDTO> vehiclesDTOs = vehicles.stream()
	                .map(booking -> modelMapper.map(booking, VehiclesDTO.class))
	                .collect(Collectors.toList());
	        System.out.println(vehiclesDTOs);
	        return ResponseEntity.ok(vehiclesDTOs);
	    }
	 
	 @PostMapping(path = "/addVehicle")
	    public ResponseEntity<Vehicles> addVehicle(
	            @RequestParam String vehicleNumber,
	            @RequestParam String vehicleType,
	            @RequestParam int totalSeats) {

	        try {
	            Vehicles vehicle = Vehicles.builder()
	                    .vehicleNumber(vehicleNumber)
	                    .vehicleType(vehicleType)
	                    .totalSeats(totalSeats)
	                    .build();
	            
	            Vehicles savedVehicle = vehicleService.save(vehicle);
	            addSeatsForVehicle(savedVehicle);
	            return ResponseEntity.ok(savedVehicle); // Return the saved vehicle with a 200 status
	        } catch (Exception e) {
	            // Handle exceptions here
	            return ResponseEntity.status(500).build(); // Return 500 status on error
	        }
	    }
	 
	 private void addSeatsForVehicle(Vehicles vehicles) {
		    // Define seat ranges
		    String[] rows = {"a", "b"};
		    int startSeatNumber = 1;
		    int endSeatNumber = 10;

		    for (String row : rows) {
		        for (int i = startSeatNumber; i <= endSeatNumber; i++) {
		            String seatNumber = row + String.format("%02d", i);
		            
		            Seats seat = Seats.builder()
		                    .vehicle(vehicles)
		                    .seatNumber(seatNumber)
		                    .isAvailable(true)
		                    .build();
		            seatService.save(seat);
		        }
		    }
		}

	 @PutMapping(path = "/updateVehicle")
	    public ResponseEntity<Vehicles> updateVehicle(  
	    		@RequestParam int vehicleId,
	    		@RequestParam String vehicleNumber,
	            @RequestParam String vehicleType,
	            @RequestParam int totalSeats) {
	        try {
	            Vehicles vehicle = Vehicles.builder()
	            		.vehicleId(vehicleId)
	                    .vehicleNumber(vehicleNumber)
	                    .vehicleType(vehicleType)
	                    .totalSeats(totalSeats)
	                    .build();
	           System.out.println(vehicle);
	            Vehicles updatedVehicle = vehicleService.update(vehicle);
	            return ResponseEntity.ok(updatedVehicle); // Return the updated vehicle with a 200 status
	        } catch (Exception e) {
	            // Handle exceptions here
	            return ResponseEntity.status(500).build(); // Return 500 status on error
	        }
	    }
	 @DeleteMapping("/deleteVehicle/{vehicleId}")
	    public ResponseEntity<Void> deleteVehicle(@PathVariable("vehicleId") int vehicleId) {
	        try {
	            vehicleService.deleteVehicle(vehicleId);
	            return ResponseEntity.noContent().build(); // Return 204 No Content
	        } catch (Exception e) {
	            // Handle exceptions here
	            return ResponseEntity.status(500).build(); // Return 500 Internal Server Error
	        }
	    }
	 
	    @GetMapping("/getSeatsByVehicleId/{vehicleId}")
	    public ResponseEntity<List<SeatsDTO>> getSeatsByVehicleId(@PathVariable int vehicleId) {
	    	List<Seats> seats = seatService.getSeatsByVehicleId(vehicleId);
	        
	        
	        List<SeatsDTO> seatsDTO = seats.stream()
	                .map(seat -> modelMapper.map(seat, SeatsDTO.class))
	                .collect(Collectors.toList());
	        return ResponseEntity.ok(seatsDTO);
	    }
	    
	    @PutMapping("/availability")
	    public ResponseEntity<Seats> updateSeatAvailability(@RequestParam int seatId, @RequestParam Boolean isAvailable) {
	    	   Seats seat = seatService.findById(seatId);
	           seat.setAvailable(isAvailable);
	           Seats updatedSeat= seatService.save(seat);
	        return ResponseEntity.ok(updatedSeat);
	    }
}
