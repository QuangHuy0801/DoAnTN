package com.example.EVIAppServer.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.aspectj.apache.bcel.classfile.Code;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.EVIAppServer.entity.Bookings;
import com.example.EVIAppServer.model.BookingDTO;
import com.example.EVIAppServer.model.SearchScheduleDTO;
import com.example.EVIAppServer.model.TemporaryBookingDTO;
import com.example.EVIAppServer.service.BookingService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@CrossOrigin("*")
@RestController
public class BookingController {
    @Autowired
    private BookingService bookingService;
	@Autowired
    private ModelMapper modelMapper;
	
    @GetMapping(path = "/getBookingById/{id}")
    public ResponseEntity<BookingDTO> getBookingById(@PathVariable int id) {
    	System.out.println("code ở đây");
        // Call the service to get booking details by id
        Bookings booking = bookingService.findById(id);
        if (booking == null) {
            return ResponseEntity.notFound().build(); 
        }
        BookingDTO bookingDTO = modelMapper.map(booking, BookingDTO.class);
        System.out.println(bookingDTO);
        if (bookingDTO != null) {
            return ResponseEntity.ok(bookingDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping(path = "/getBookingByUserId")
	public ResponseEntity<List<BookingDTO>> getBookingById(String user_id){
		System.out.println(user_id);
		List<Bookings> listBooking = bookingService.getAllBookingByUser_Id(user_id);
		List<BookingDTO> listBookingDto = new ArrayList<>();
		for(Bookings o: listBooking) {
			BookingDTO bookingDto = modelMapper.map(o, BookingDTO.class);
			System.out.println(bookingDto.getBookingId());
			listBookingDto.add(bookingDto);
		}
		return new ResponseEntity<>(listBookingDto, HttpStatus.OK);
	}
    
    @GetMapping(path = "/getAllBooking")
    public ResponseEntity<List<BookingDTO>> getAllBooking() {
        List<Bookings> bookings = bookingService.findAll();
        if (bookings == null || bookings.isEmpty()) {
            return ResponseEntity.notFound().build();  // Return 404 if no bookings are found
        }
        List<BookingDTO> bookingDTOs = bookings.stream()
                .map(booking -> modelMapper.map(booking, BookingDTO.class))
                .collect(Collectors.toList());
        System.out.println(bookingDTOs);
        return ResponseEntity.ok(bookingDTOs);
    }
    
    @DeleteMapping(path = "/deleteTemporary/{bookingId}")
    public ResponseEntity<Void> deleteTemporary(@PathVariable("bookingId") int bookingId) {
        try {
            bookingService.deleteBookingDetailByBookingId(bookingId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build(); 
        }
    }
}
