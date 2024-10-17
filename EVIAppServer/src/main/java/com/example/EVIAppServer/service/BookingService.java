package com.example.EVIAppServer.service;

import java.util.List;

import com.example.EVIAppServer.entity.BookingDetails;
import com.example.EVIAppServer.entity.Bookings;
import com.example.EVIAppServer.model.TemporaryBookingDTO;

import jakarta.transaction.Transactional;

public interface BookingService {
	 public Bookings createTemporaryBooking(TemporaryBookingDTO bookingDTO) throws Exception;
	 Bookings findById(int id);
	 public Bookings save(Bookings bookings);
	 List<Bookings> getAllBookingByUser_Id(String id);

	 public Bookings changePaidBooking(int schedulesID, String seatNumber);
	 public Bookings changeStatusBooking(int schedulesID, String QRCode);
	 public Bookings  findByQrCode(String QRcode);   
	 public List<Bookings>  findAll();
	 public void deleteBookingDetailByBookingId(int bookingID);
}
