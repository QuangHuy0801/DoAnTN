package com.example.EVIAppServer.controller;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.EVIAppServer.entity.Bookings;
import com.example.EVIAppServer.entity.Routes;
import com.example.EVIAppServer.entity.Schedules;
import com.example.EVIAppServer.model.Mail;
import com.example.EVIAppServer.model.MoMoIPNRequest;
import com.example.EVIAppServer.service.BookingService;
import com.example.EVIAppServer.service.MailService;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/momo_ipn")
public class MoMoIpnController {
	
	@Autowired
	MailService mailService;
    @Autowired
    private BookingService bookingService;
    @PostMapping()
    public ResponseEntity<String> handleMoMoIpn(@RequestBody MoMoIPNRequest request) {
        if (request.getResultCode() == 0) {
        	System.out.println("Thanh toán thành công"+request);
        	int orderId = Integer.parseInt(request.getOrderId());
        	Bookings bookings =bookingService.findById(orderId);
        	System.out.println(orderId);
        	String ticketCode = generateTicketCode(bookings.getBookingId());
        	bookings.setStatus(Bookings.STATUS_PENDING);
        	bookings.setPaymentMethod("momo");
        	bookings.setPaid(true);
        	bookings.setQrCode(ticketCode);
        	bookings=bookingService.save(bookings);
        	try {
				sendEmailWithQRCode(ticketCode,bookings);
			} catch (MessagingException | IOException | WriterException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
//        	   return ResponseEntity.ok("Payment processed successfully");
        	return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } else {
        	System.out.println("Thanh toán thất bại");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Payment processing failed");
        }
    }
    
    private void sendEmailWithQRCode( String ticketCode, Bookings booking) throws MessagingException, IOException, WriterException {
        // Tạo QR code
        ByteArrayOutputStream qrOutputStream = new ByteArrayOutputStream();
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(ticketCode, BarcodeFormat.QR_CODE, 200, 200);
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", qrOutputStream);
        byte[] qrCodeBytes = qrOutputStream.toByteArray();

        // Lấy thông tin lịch trình
        Schedules schedule = booking.getSchedule();
        Routes route = schedule.getRoute();
        String startLocation = route.getStartLocation();
        String endLocation = route.getEndLocation();
        String departureTime = booking.getBookingDate().toString();

        // Tạo nội dung email
        String emailContent = String.format(
            "Dear %s,\n\n" +
            "Your ticket code is: %s\n\n" +
            "Chi tiết tuyến xe:\n" +
            "Ngày giờ xuất phát: %s\n" +
            "Điểm đầu: %s\n" +
            "Điểm cuối: %s\n\n" +
            "Chúc bạn có một chuyến đi vui vẻ!\n\n" +
            "Best regards,\n" +
            "Evi Bus",
            booking.getPassengerName(),
            booking.getBookingId(),
            departureTime,
            startLocation,
            endLocation
        );

        // Chuẩn bị mail
        Mail mail = new Mail();
        mail.setMailFrom("n20dccn022@student.ptithcm.edu.vn");
        mail.setMailTo(booking.getPassengerEmail());
        mail.setMailSubject("Thanh toán thành công Evi Bus");
        mail.setMailContent(emailContent);
        mail.setAttachments(Map.of("QRCode.png", qrCodeBytes));

        // Gửi mail
        mailService.sendEmail(mail);
    }

    
    private String generateTicketCode(int bookingId) {
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        String dateTimeString = now.format(formatter);
        
        String randomPrefix = generateRandomPrefix();
        String ticketCode = randomPrefix + bookingId + dateTimeString;
        
        return ticketCode;
    }
    private String generateRandomPrefix() {
        String alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0987654321";
        StringBuilder sb = new StringBuilder();
        Random random = new Random();
        
        for (int i = 0; i < 5; i++) {
            int index = random.nextInt(alphabet.length());
            sb.append(alphabet.charAt(index));
        }
        
        return sb.toString();
    }
}