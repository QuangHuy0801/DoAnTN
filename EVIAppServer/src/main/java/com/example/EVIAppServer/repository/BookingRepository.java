package com.example.EVIAppServer.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.EVIAppServer.entity.Bookings;
import com.example.EVIAppServer.entity.Schedules;
public interface BookingRepository extends JpaRepository<Bookings, Integer> {
    
	 @Query("SELECT b FROM Bookings b WHERE b.status = :temporaryStatus AND b.bookingDate < :expirationTime")
	    List<Bookings> findExpiredTemporaryBookings(@Param("temporaryStatus") String temporaryStatus, @Param("expirationTime") LocalDateTime expirationTime);

		Bookings findById(int id);
		Bookings findByQrCode(String QRcode);
	    @Query("SELECT b FROM Bookings b WHERE b.user.id = :userId ORDER BY b.bookingDate DESC")
	    List<Bookings> findAllByUserIdOrdered(@Param("userId") String userId);
	    List<Bookings> findAll();
	    
	    
	    @Query("SELECT b FROM Bookings b WHERE b.status = :temporaryStatus AND b.bookingId = :BookingID")
	    Bookings findTemporaryBookingsById(@Param("temporaryStatus") String temporaryStatus, @Param("BookingID") int BookingID);

}