package com.example.EVIAppServer.controller;

import java.sql.Date;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

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

import com.example.EVIAppServer.entity.Bookings;
import com.example.EVIAppServer.entity.Routes;
import com.example.EVIAppServer.entity.Schedules;
import com.example.EVIAppServer.model.Mail;
import com.example.EVIAppServer.model.SearchScheduleDTO;
import com.example.EVIAppServer.repository.BookingRepository;
import com.example.EVIAppServer.service.BookingService;
import com.example.EVIAppServer.service.MailService;
import com.example.EVIAppServer.service.RoutesService;
import com.example.EVIAppServer.service.SchedulesService;
import com.example.EVIAppServer.service.VehicleService;
import com.google.gson.Gson;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.mail.MessagingException;
@CrossOrigin("*")
@RestController
public class SchedulesController {
    private final SchedulesService schedulesService;

    @Autowired
    public SchedulesController(SchedulesService schedulesService) {
        this.schedulesService = schedulesService;
    }
	@Autowired
    private ModelMapper modelMapper;
	
	@Autowired
    private BookingService bookingService;
	
	@Autowired
    private RoutesService routesService;
	
	@Autowired
	MailService mailService;
	
	@Autowired
    private VehicleService vehicleService;
	
    @GetMapping("/searchschedules")
    public List<SearchScheduleDTO> findSchedulesWithEmptySeats(
            @RequestParam("fromProvinceId") int fromProvinceId,
            @RequestParam("toProvinceId") int toProvinceId,
            @RequestParam("departureDate") Date departureDate) {
    	System.out.println(fromProvinceId+toProvinceId+departureDate.toString());
    	List<Schedules> schedules = schedulesService.findSchedulesWithEmptySeats(fromProvinceId, toProvinceId, departureDate);
    	List<SearchScheduleDTO> searchScheduleDTOs = new ArrayList<>();
		for(Schedules s:schedules) {
			SearchScheduleDTO scheduleDTO = modelMapper.map(s, SearchScheduleDTO.class);
			searchScheduleDTOs.add(scheduleDTO);
		}
		System.out.println(searchScheduleDTOs);
        return searchScheduleDTOs;
    }
    
    
    
    @PostMapping("/delaynotification")
    public SearchScheduleDTO delayNotification(
            @RequestParam("schedulesID") int scheduleId,
            @RequestParam("dateTime") LocalDateTime dateTime,
            @RequestParam("message") String message) {
        System.out.println(scheduleId + " " + dateTime.toString() + " " + message);
        Schedules schedule = schedulesService.getSchedulesById(scheduleId);
        schedule.setDepartureTime(dateTime);
        schedulesService.save(schedule);
        List<Bookings> bookings = schedule.getBookings();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        String formattedDateTime = dateTime.format(formatter);

        for (Bookings booking : bookings) {
            Mail mail = new Mail();
            mail.setMailFrom("n20dccn022@student.ptithcm.edu.vn");
            mail.setMailTo(booking.getPassengerEmail());
            mail.setMailSubject("Thông báo trễ chuyến");
            String emailContent = String.format("Chuyến xe của bạn bị trễ. %s\nNgày giờ bắt đầu mới: %s", 
                                                message, formattedDateTime);
            mail.setMailContent(emailContent);

            try {
                mailService.sendEmail(mail);
                System.out.println("Đã gửi email đến: " + booking.getPassengerEmail());
            } catch (MessagingException e) {
                e.printStackTrace();
                System.out.println("Không thể gửi email đến: " + booking.getPassengerEmail());
            }
        }
        SearchScheduleDTO scheduleDTO = modelMapper.map(schedule, SearchScheduleDTO.class);
        return scheduleDTO;
    }
    
    @GetMapping("/getallschedules")
    public List<SearchScheduleDTO> getAllSchedule() {
    	List<Schedules> schedules = schedulesService.findAll();
    	List<SearchScheduleDTO> searchScheduleDTOs = new ArrayList<>();
		for(Schedules s:schedules) {
			SearchScheduleDTO scheduleDTO = modelMapper.map(s, SearchScheduleDTO.class);
			searchScheduleDTOs.add(scheduleDTO);
		}
        return searchScheduleDTOs;
    }
    
    @GetMapping("/getschedulesbyid/{id}")
    public ResponseEntity<SearchScheduleDTO> getSchedulesById(@PathVariable Integer id) {
        Schedules schedules = schedulesService.getSchedulesById(id);
        SearchScheduleDTO scheduleDTO = modelMapper.map(schedules, SearchScheduleDTO.class);
        return ResponseEntity.ok(scheduleDTO);
    }
    
    @PostMapping("/changepaidbooking")
    public ResponseEntity<SearchScheduleDTO> changePaidBooking(@RequestParam("schedulesID") int schedulesID,@RequestParam("seatNumber") String seatNumber) {
    	Bookings bookings = bookingService.changePaidBooking(schedulesID, seatNumber);
    	SearchScheduleDTO scheduleDTO = modelMapper.map( bookings.getSchedule(), SearchScheduleDTO.class);
        return ResponseEntity.ok(scheduleDTO);
    }
    
    @PostMapping("/changestatusbooking")
    public ResponseEntity<SearchScheduleDTO> changeStatusBooking(@RequestParam("schedulesID") int schedulesID,@RequestParam("QRCode") String QRCode) {
    	Bookings bookings = bookingService.changeStatusBooking(schedulesID, QRCode);
    	SearchScheduleDTO scheduleDTO = modelMapper.map( bookings.getSchedule(), SearchScheduleDTO.class);
        return ResponseEntity.ok(scheduleDTO);
    }
    


    @PostMapping("/addSchedule")
    public ResponseEntity<Schedules> addSchedule(@RequestParam int routeId,
                                                 @RequestParam double price,
                                                 @RequestParam String departureTime,
                                                 @RequestParam String arrivalTime,
                                                 @RequestParam int vehicleId) {
        Schedules schedule = new Schedules();
        schedule.setRoute(routesService.findById(routeId));
        schedule.setPrice(price);
        schedule.setDepartureTime(Instant.parse(departureTime)
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime());
        schedule.setArrivalTime(Instant.parse(arrivalTime)
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime());
        
        schedule.setVehicle(vehicleService.findById(vehicleId));
        Schedules savedSchedule = schedulesService.save(schedule);
        return ResponseEntity.ok(savedSchedule);
    }
    @PutMapping("/updateSchedule")
    public ResponseEntity<Schedules> updateSchedule(@RequestParam int scheduleId,
    											@RequestParam int routeId,
                                                 @RequestParam double price,
                                                 @RequestParam String departureTime,
                                                 @RequestParam String arrivalTime,
                                                 @RequestParam int vehicleId) {
        Schedules schedule = schedulesService.getSchedulesById(scheduleId);
        schedule.setRoute(routesService.findById(routeId));
        schedule.setPrice(price);
        schedule.setDepartureTime(Instant.parse(departureTime)
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime());
        schedule.setArrivalTime(Instant.parse(arrivalTime)
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime());
        schedule.setVehicle(vehicleService.findById(vehicleId));
        Schedules savedSchedule = schedulesService.save(schedule);
        return ResponseEntity.ok(savedSchedule);
    }
    
    @DeleteMapping("deleteSchedule/{scheduleId}")
    public ResponseEntity<?> deleteSchedule(@PathVariable int scheduleId) {
        try {
            if (!schedulesService.existsById(scheduleId)) {
                return ResponseEntity.notFound().build();
            }
            schedulesService.delete(scheduleId);
            return ResponseEntity.ok().body("Schedule deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error deleting schedule: " + e.getMessage());
        }
    }

}
    

