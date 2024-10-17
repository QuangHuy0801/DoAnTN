package com.example.EVIAppServer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.EVIAppServer.entity.BookingDetails;

import jakarta.transaction.Transactional;

public interface BookingDetailsRepository extends JpaRepository<BookingDetails, Integer>{
	
	@Modifying
	@Transactional
	@Query("DELETE FROM BookingDetails bd WHERE bd.booking.id =?1")
	void deleteBookingDetailByBookingId(int booking_id);
	 BookingDetails findByBooking_Schedule_ScheduleIdAndSeat_SeatNumber(int scheduleId, String seatNumber);
	 List<BookingDetails> findByBooking_Schedule_ScheduleIdAndBooking_QrCode(int scheduleId, String QRCode);
	 
	 @Query("SELECT CASE WHEN COUNT(bd) = 0 THEN true ELSE false END FROM BookingDetails bd " +
	           "JOIN bd.booking b " +
	           "JOIN bd.seat s " +
	           "WHERE b.schedule.scheduleId = :scheduleId AND s.seatNumber = :seatNumber")
	    boolean isSeatAvailableForSchedule(@Param("scheduleId") int scheduleId, @Param("seatNumber") String seatNumber);
}
