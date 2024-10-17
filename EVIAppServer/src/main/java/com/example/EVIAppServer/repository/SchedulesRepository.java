package com.example.EVIAppServer.repository;

import java.sql.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.example.EVIAppServer.entity.Schedules;
import com.example.EVIAppServer.model.SearchScheduleDTO;

@Repository
public interface SchedulesRepository extends JpaRepository<Schedules, Integer>{
	
	Schedules findById(int id);
	
	@Query(value ="SELECT s.* " +
            "FROM schedules s " +
            "JOIN routes r ON s.route_id = r.route_id " +
            "JOIN route_stations rsFrom ON r.route_id = rsFrom.route_id " +
            "JOIN stations stFrom ON rsFrom.station_id = stFrom.station_id " +
            "JOIN provinces pFrom ON stFrom.province_id = pFrom.province_id " +
            "JOIN route_stations rsTo ON r.route_id = rsTo.route_id " +
            "JOIN stations stTo ON rsTo.station_id = stTo.station_id " +
            "JOIN provinces pTo ON stTo.province_id = pTo.province_id " +
            "JOIN vehicles v ON s.vehicle_id = v.vehicle_id " +
            "LEFT JOIN booking_details bd ON bd.seat_id IN (SELECT seat_id FROM seats WHERE vehicle_id = v.vehicle_id) AND bd.booking_id IN (SELECT booking_id FROM bookings WHERE schedule_id = s.schedule_id) " +
            "WHERE pFrom.province_id = ?1 " +
            "AND pTo.province_id = ?2 " +
            "AND rsFrom.stop_order < rsTo.stop_order " +
            "AND DATE(s.departure_time) = ?3 " +
            "GROUP BY s.schedule_id", nativeQuery = true)
    List<Schedules> findSchedulesWithEmptySeats(
            int fromProvinceId,
            int toProvinceId,
            Date departureDate);
	
	Schedules deleteById (int id);
}
