package com.example.EVIAppServer.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.EVIAppServer.entity.BookingDetails;
import com.example.EVIAppServer.entity.Bookings;
import com.example.EVIAppServer.entity.Schedules;
import com.example.EVIAppServer.entity.Seats;
import com.example.EVIAppServer.entity.Stations;
import com.example.EVIAppServer.entity.User;
import com.example.EVIAppServer.model.TemporaryBookingDTO;
import com.example.EVIAppServer.repository.BookingDetailsRepository;
import com.example.EVIAppServer.repository.BookingRepository;
import com.example.EVIAppServer.repository.SchedulesRepository;
import com.example.EVIAppServer.repository.SeatsRepository;
import com.example.EVIAppServer.repository.StationsRepository;
import com.example.EVIAppServer.repository.UserRepository;
import com.example.EVIAppServer.service.BookingService;

import jakarta.transaction.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class BookingServiceImpl implements BookingService {
    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BookingDetailsRepository bookingDetailsRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StationsRepository stationsRepository;
    
    @Autowired
    private SeatsRepository seatsRepository;

    @Autowired
    private SchedulesRepository schedulesRepository;
    
    
    private boolean isSeatAvailable(int scheduleId, String seatNumber) {
        return bookingDetailsRepository.isSeatAvailableForSchedule(scheduleId, seatNumber);
    }
    
    public Bookings createTemporaryBooking(TemporaryBookingDTO bookingDTO) throws Exception {
    	
        for (String seatNumber : bookingDTO.getSelectedSeats()) {
            String cleanedSeatNumber = seatNumber.replace("[", "").replace("]", "").replace("\"", "").trim();
            if (!isSeatAvailable(bookingDTO.getScheduleId(), cleanedSeatNumber)) {
                throw new Exception("Seat " + cleanedSeatNumber + " is already booked for this schedule.");
            }
        }
    	
    	
        Bookings booking = new Bookings();
        // Set user if userId is provided
        if (bookingDTO.getUserId() != null && !bookingDTO.getUserId().isEmpty()) {
            User user = userRepository.findById(bookingDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
            booking.setUser(user);
        }
        else booking.setUser(null);
        booking.setStatus(Bookings.STATUS_TEMPORARY);
        Stations pickupStation = stationsRepository.findById(bookingDTO.getPickupStationId())
            .orElseThrow(() -> new RuntimeException("Pickup station not found"));
        Stations dropoffStation = stationsRepository.findById(bookingDTO.getDropoffStationId())
            .orElseThrow(() -> new RuntimeException("Dropoff station not found"));
        booking.setPickupStation(pickupStation);
        booking.setDropoffStation(dropoffStation);

        booking.setPassengerName(bookingDTO.getPassengerName());
        booking.setPassengerEmail(bookingDTO.getPassengerEmail());
        booking.setPassengerPhone(bookingDTO.getPassengerPhone());

        // Set schedule
        Schedules schedule = schedulesRepository.findById(bookingDTO.getScheduleId())
            .orElseThrow(() -> new RuntimeException("Schedule not found"));
        booking.setSchedule(schedule);

        booking.setBookingDate(new Date()); // Set current date as booking date

        // Save the booking first to get the ID
        booking = bookingRepository.save(booking);

        List<BookingDetails> bookingDetailsList = new ArrayList<>();

        // Create booking details for each selected seat
        for (String seatNumber : bookingDTO.getSelectedSeats()) {
            BookingDetails detail = new BookingDetails();
            detail.setBooking(booking);
            System.out.println(seatNumber);
            String output = seatNumber.replace("[", "").replace("]", "").replace("\"", "").trim();
            System.out.println(output);
            System.out.println(booking.getSchedule().getVehicle().getVehicleId());
            Seats seat = seatsRepository.findSeatByNumberAndVehicleId(output, booking.getSchedule().getVehicle().getVehicleId());
            detail.setSeat(seat);
            bookingDetailsRepository.save(detail);
            bookingDetailsList.add(detail); // Add the detail to the list
        }

        booking.setBookingDetails(bookingDetailsList); // Set the booking details list to the booking
        System.out.println(booking.getSchedule().getScheduleId());
        return booking;
    }
    public Bookings findById(int id) {
    	return bookingRepository.findById(id);
    }
    
    public Bookings  findByQrCode(String QRcode) {
    	return bookingRepository. findByQrCode( QRcode);
    }
    
    public void deleteBookingDetailByBookingId(int bookingID) {
        Bookings expiredBookings = bookingRepository.findTemporaryBookingsById(Bookings.STATUS_TEMPORARY, bookingID);
        	bookingDetailsRepository.deleteBookingDetailByBookingId(expiredBookings.getBookingId());
            bookingRepository.delete(expiredBookings);
        
    }
    
    public List<Bookings>  findAll() {
    	return bookingRepository. findAll();
    }
    
    public Bookings save(Bookings bookings) {
    	return bookingRepository.save(bookings);
    }
	@Override
	public List<Bookings> getAllBookingByUser_Id(String id) {
		return bookingRepository.findAllByUserIdOrdered(id);
	}
    @Transactional
    public Bookings changePaidBooking(int schedulesID, String seatNumber) {
        BookingDetails bookingDetail = bookingDetailsRepository.findByBooking_Schedule_ScheduleIdAndSeat_SeatNumber(schedulesID, seatNumber);
        Bookings bookings;
        if (bookingDetail != null) {
            bookings= bookingDetail.getBooking();
            bookings.setPaid(true);
            return bookingRepository.save(bookings);
        }
        return null;
    }
    @Transactional
    public Bookings changeStatusBooking(int schedulesID, String QRCode) {
    	List<BookingDetails> bookingDetails = bookingDetailsRepository.findByBooking_Schedule_ScheduleIdAndBooking_QrCode(schedulesID, QRCode);
        Bookings bookings;
        if (bookingDetails != null && !bookingDetails.isEmpty()) {
        	BookingDetails bookingDetail = bookingDetails.get(0);
            bookings= bookingDetail.getBooking();
            bookings.setStatus(Bookings.STATUS_CONFIRMED);
            return bookingRepository.save(bookings);
        }
        return null;
    }
}