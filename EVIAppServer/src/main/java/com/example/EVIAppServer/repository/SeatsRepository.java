package com.example.EVIAppServer.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.EVIAppServer.entity.Bookings;
import com.example.EVIAppServer.entity.Schedules;
import com.example.EVIAppServer.entity.Seats;
import com.example.EVIAppServer.entity.Vehicles;
@Repository
public interface SeatsRepository extends JpaRepository<Seats, Integer> {
	Seats findById(int id);
	 List<Seats> findByVehicleVehicleId(int vehicleId);
	 Seats findBySeatId(int seatId);
	@Query(value = "SELECT * FROM seats WHERE seat_number = :seat_number AND vehicle_id = :vehicle_id", nativeQuery = true)
	Seats findSeatByNumberAndVehicleId(@Param("seat_number") String seatNumber, @Param("vehicle_id") int vehicleId);

}
