package com.example.EVIAppServer.service.impl;

import com.example.EVIAppServer.entity.Bookings;
import com.example.EVIAppServer.repository.BookingDetailsRepository;
import com.example.EVIAppServer.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class TemporaryBookingCleaner {
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    BookingDetailsRepository bookingDetailsRepository;
    
    @Scheduled(fixedRate = 60000)
    public void cleanExpiredTemporaryBookings() {
        LocalDateTime expirationTime = LocalDateTime.now().minusMinutes(10);
        List<Bookings> expiredBookings = bookingRepository.findExpiredTemporaryBookings(Bookings.STATUS_TEMPORARY, expirationTime);
        for (Bookings booking : expiredBookings) {
        	bookingDetailsRepository.deleteBookingDetailByBookingId(booking.getBookingId());
            bookingRepository.delete(booking);
        }
    }
}