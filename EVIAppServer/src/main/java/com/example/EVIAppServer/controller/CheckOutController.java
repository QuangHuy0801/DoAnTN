package com.example.EVIAppServer.controller;

import org.cloudinary.json.JSONObject;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.EVIAppServer.config.VNPayConfig;
import com.example.EVIAppServer.entity.Bookings;
import com.example.EVIAppServer.entity.Routes;
import com.example.EVIAppServer.entity.Schedules;
import com.example.EVIAppServer.model.BookingDTO;
import com.example.EVIAppServer.model.CustomerInfo;
import com.example.EVIAppServer.model.Mail;
import com.example.EVIAppServer.model.MoMoIPNRequest;
import com.example.EVIAppServer.model.TemporaryBookingDTO;
import com.example.EVIAppServer.model.TripData;
import com.example.EVIAppServer.momo.MomoModel;
import com.example.EVIAppServer.momo.ResultMoMo;
import com.example.EVIAppServer.momo.utils.Constant;
import com.example.EVIAppServer.momo.utils.Decode;
import com.example.EVIAppServer.service.BookingService;
import com.example.EVIAppServer.service.MailService;
import com.example.EVIAppServer.service.MomoPaymentService;
import com.example.EVIAppServer.service.PaypalService;
import com.example.EVIAppServer.service.VNPayService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import com.paypal.api.payments.Links;
import ch.qos.logback.core.model.Model;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import com.example.EVIAppServer.paypal.*;

@CrossOrigin("*")
@RestController
public class CheckOutController {
	public static final String URL_PAYPAL_SUCCESS = "paypal/success";
	public static final String URL_PAYPAL_CANCEL = "paypal/cancel";
	public static final Double change_USD = 0.000039 ;
    @Autowired
    private MomoPaymentService momoPaymentService;
    
    @Autowired
    private BookingService bookingService;
	@Autowired
    private ModelMapper modelMapper;
	
	@Autowired
	VNPayService vnPayService;
	@Autowired
	PaypalService paypalService;
	
	@Autowired
	MailService mailService;
	
	@Autowired
	HttpSession session;
	
	
    @PostMapping(path = "/temporary", consumes = "application/x-www-form-urlencoded")
    public ResponseEntity<BookingDTO> createTemporaryBooking(@RequestBody TemporaryBookingDTO bookingDTO) throws Exception {
    	System.out.println(bookingDTO);
        Bookings temporaryBooking = bookingService.createTemporaryBooking(bookingDTO);
        BookingDTO bookingRequest = modelMapper.map(temporaryBooking, BookingDTO.class);
        System.out.println(bookingRequest);
        return ResponseEntity.ok(bookingRequest);
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

    
    
    
    @PostMapping(path = "/bookings")
    public ResponseEntity<Map<String, String>> createBooking( @RequestParam("bookingId") int bookingId, @RequestParam("paymentMethod") String paymentMethod,HttpServletRequest request) {
    	String ticketCode = generateTicketCode(bookingId);
    	Bookings bookings = bookingService.findById(bookingId);
//    	int code = new Random().nextInt(89999999) + 10000000;
//        String orderId = Integer.toString(code);
        String orderId = String.format("%08d", bookingId);
        System.out.println(orderId);
    	if (paymentMethod.equals("momo")) {
        MomoModel jsonRequest = new MomoModel();
        jsonRequest.setPartnerCode(Constant.IDMOMO);
        jsonRequest.setOrderId(orderId);
        jsonRequest.setStoreId(orderId);
        jsonRequest.setRedirectUrl(Constant.redirectUrl);
        jsonRequest.setIpnUrl(Constant.ipnUrl);
        double price = bookings.getSchedule().getPrice()*bookings.getBookingDetails().size();
        int intPrice = (int) price;
        String amountString = String.valueOf(intPrice);
        jsonRequest.setAmount(amountString);
        jsonRequest.setOrderInfo("Thanh toán EVI BUS.");
        jsonRequest.setRequestId(orderId);
        jsonRequest.setOrderType(Constant.orderType);
        jsonRequest.setRequestType(Constant.requestType);
        jsonRequest.setTransId("1");
        jsonRequest.setResultCode("200");
        jsonRequest.setMessage("");
        jsonRequest.setPayType(Constant.payType);
        jsonRequest.setResponseTime("300000");
        jsonRequest.setExtraData("");
        String decode = "accessKey=" + Constant.accessKey + "&amount=" + jsonRequest.getAmount() + "&extraData=" +
                jsonRequest.getExtraData() + "&ipnUrl=" + Constant.ipnUrl + "&orderId=" + orderId + "&orderInfo=" +
                jsonRequest.getOrderInfo() + "&partnerCode=" + jsonRequest.getPartnerCode() + "&redirectUrl=" +
                Constant.redirectUrl + "&requestId=" + jsonRequest.getRequestId() + "&requestType=" +
                Constant.requestType;
        String signature = Decode.encode(Constant.serectkey, decode);
        jsonRequest.setSignature(signature);

        // Convert the request to JSON
        ObjectMapper mapper = new ObjectMapper();
        String json;
        try {
            json = mapper.writeValueAsString(jsonRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Failed to create payment request JSON"));
        }

        // Send the request to Momo
        HttpClient client = HttpClient.newHttpClient();
        ResultMoMo res;
        try {
            HttpRequest requestMomo = HttpRequest.newBuilder()
                    .uri(new URI(Constant.Url))
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .headers("Content-Type", "application/json")
                    .build();
            HttpResponse<String> response = client.send(requestMomo, HttpResponse.BodyHandlers.ofString());
            res = mapper.readValue(response.body(), ResultMoMo.class);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Failed to communicate with Momo"));
        }
        if (res == null || res.getPayUrl() == null) {
            return ResponseEntity.status(500).body(Map.of("error", "Payment failed"));
        }
        Map<String, String> responseMap = new HashMap<>();
        responseMap.put("code", res.getDeeplink());
        System.out.println(res.getDeeplink());
//        responseMap.put("code", "<QRCode \r\n"
//        		+ "  value=\"https://www.example.com/payment?orderId=1234567890&userId=0987654321&transactionId=abcdefghij&amount=100000&currency=VND&description=This+is+a+very+long+description+to+generate+a+complex+QR+code+with+many+modules+to+see+how+version+40+looks+like\" \r\n"
//        		+ "  version={40} \r\n"
//        		+ "  size={200} \r\n"
//        		+ "/>\r\n"
//        		+ "");
        return ResponseEntity.ok(responseMap);
    	}	
    	else if(paymentMethod.equals("vnpay")) {
	        String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + "4000";
	        String vnpayUrl = vnPayService.createOrder((int) bookings.getSchedule().getPrice()*bookings.getBookingDetails().size(), "Thanh toán EVI BUS.", baseUrl,orderId);
	        Map<String, String> responseMap = new HashMap<>();
	        System.out.println(vnpayUrl);
	        responseMap.put("code", vnpayUrl);
	        return ResponseEntity.ok(responseMap);
		}
    	else if(paymentMethod.equals("paypal")) {
    		String cancelUrl = Utils.getBaseURL(request) + "/" + CheckOutController.URL_PAYPAL_CANCEL;
            String successUrl = Utils.getBaseURL(request) + "/" + CheckOutController.URL_PAYPAL_SUCCESS+ "?orderId=" + orderId;
            try {
                Payment payment = paypalService.createPayment(
                		bookings.getSchedule().getPrice()*bookings.getBookingDetails().size()*change_USD,
                        "USD",
                        PaypalPaymentMethod.paypal,
                        PaypalPaymentIntent.sale,
                        "payment description",
                        cancelUrl,
                        successUrl);
                for (Links links : payment.getLinks()) {
                    if (links.getRel().equals("approval_url")) { 
                        Map<String, String> responseMap = new HashMap<>();
            	        responseMap.put("code", links.getHref());
            	        return ResponseEntity.ok(responseMap);
                    }
                }
            } catch (PayPalRESTException e) {
            	e.printStackTrace();
            }
    		
    	}
    	else if (paymentMethod.equals("Thanh toán Khi lên xe")) {
    		 Bookings booking = bookingService.findById(bookingId);
    		 System.out.println(booking.getBookingId());
    		 booking.setStatus(Bookings.STATUS_PENDING);
    		 booking.setPaymentMethod("COD");
    		 booking.setQrCode(ticketCode);
    		 bookingService.save(booking);		 
    		 try {
                 sendEmailWithQRCode(ticketCode,booking );
             } catch (Exception e) {
                 e.printStackTrace();
                 return ResponseEntity.status(500).body(Map.of("error", "Failed to send email"));
             }
    	     Map<String, String> responseMap = new HashMap<>();
    	     responseMap.put("code", "COD");
    	     return ResponseEntity.ok(responseMap);
    	}
    	 return ResponseEntity.status(500).body(Map.of("error", "Payment failed"));
    }
//    @GetMapping("/status/{orderId}")
//    public ResponseEntity<String> getPaymentStatus(@PathVariable String orderId) {
//        String status = getTransactionStatus(orderId);
//        if ("SUCCESS".equals(status)) {
//            return ResponseEntity.ok("Payment successful");
//        } else if ("FAILED".equals(status)) {
//            return ResponseEntity.ok("Payment failed");
//        } else {
//            return ResponseEntity.ok("Payment pending");
//        }
//    }

    @GetMapping("/checkstatus")
    public ResponseEntity<Map<String, String>> checkPaymentStatus(@RequestParam("bookingId") int bookingId) {
        String status = bookingService.findById(bookingId).getStatus();
        return ResponseEntity.ok(Map.of("status", status));
    }
    
//    @GetMapping("/vnPayPayment")
////  @ResponseBody
//  public ResponseEntity<String> PayWithVNPayGet(HttpServletRequest request,Model model) {
//      int paymentStatus = vnPayService.orderReturn(request);
//      String vnp_Amount = request.getParameter("vnp_Amount");
//      String vnp_BankCode = request.getParameter("vnp_BankCode");
//      String vnp_BankTranNo = request.getParameter("vnp_BankTranNo");
//      String vnp_CardType = request.getParameter("vnp_CardType");
//      String vnp_OrderInfo = request.getParameter("vnp_OrderInfo");
//      String vnp_PayDate = request.getParameter("vnp_PayDate");
//      String vnp_ResponseCode = request.getParameter("vnp_ResponseCode");
//      String vnp_TmnCode = request.getParameter("vnp_TmnCode");
//      String vnp_TransactionNo = request.getParameter("vnp_TransactionNo");
//      String vnp_TransactionStatus = request.getParameter("vnp_TransactionStatus");
//      String vnp_TxnRef = request.getParameter("vnp_TxnRef");
//      String vnp_SecureHash = request.getParameter("vnp_SecureHash");
//      if(!vnp_ResponseCode.equals("00")) {
//         	System.out.println("Thanh toán thất bại");
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Payment processing failed");
//      }else {
//    	  System.out.println(vnp_TxnRef);
//    	  System.out.println("Thanh toán thành công"+request);
//      	Bookings bookings =bookingService.findByQrCode(vnp_TxnRef);
//      	String ticketCode = generateTicketCode(bookings.getBookingId());
//      	bookings.setStatus(Bookings.STATUS_PENDING);
//      	bookings.setPaymentMethod("VNPay");
//      	bookings.setPaid(true);
//      	bookings.setQrCode(ticketCode);
//      	bookings=bookingService.save(bookings);
//      	try {
//				sendEmailWithQRCode(ticketCode,bookings);
//			} catch (MessagingException | IOException | WriterException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//          return ResponseEntity.ok("Payment processed successfully");
//		}
//	}
    
    @GetMapping("/IPN")
    @ResponseBody
        public ResponseEntity<String> PayWithVNPayIPN(HttpServletRequest request,Model model) {
            int paymentStatus = vnPayService.orderReturn(request);
            String vnp_Amount = request.getParameter("vnp_Amount");
            String vnp_BankCode = request.getParameter("vnp_BankCode");
            String vnp_BankTranNo = request.getParameter("vnp_BankTranNo");
            String vnp_CardType = request.getParameter("vnp_CardType");
            String vnp_OrderInfo = request.getParameter("vnp_OrderInfo");
            String vnp_PayDate = request.getParameter("vnp_PayDate");
            String vnp_ResponseCode = request.getParameter("vnp_ResponseCode");
            String vnp_TmnCode = request.getParameter("vnp_TmnCode");
            String vnp_TransactionNo = request.getParameter("vnp_TransactionNo");
            String vnp_TransactionStatus = request.getParameter("vnp_TransactionStatus");
            String vnp_TxnRef = request.getParameter("vnp_TxnRef");
            String vnp_SecureHash = request.getParameter("vnp_SecureHash");	
            JSONObject response = new JSONObject();
        System.out.println(request);
        boolean checkOrderId = false; 
        boolean checkAmount = false;
        boolean checkOrderStatus = false; 
        if(!vnp_ResponseCode.equals("00")) {
         	System.out.println("Thanh toán thất bại");
            response.put("RspCode", "00");
            response.put("Message", "Confirm Success");
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(response.toString());
      }else {
    	  
      	int orderId;
        try {
            orderId = Integer.parseInt(vnp_TxnRef);
        } catch (NumberFormatException e) {
            response.put("RspCode", "01");
            response.put("Message", "Order not Found");
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(response.toString());
        }
      	Bookings bookings =bookingService.findById(orderId);
       	if (bookings != null ){
      		checkOrderId = true;
      	}
       	int expectedAmount = (int) Math.round(bookings.getSchedule().getPrice() * bookings.getBookingDetails().size());
       	int vnpAmountInSmallestUnit = Integer.parseInt(vnp_Amount) / 100; 
       	if (expectedAmount == vnpAmountInSmallestUnit) {
       		checkAmount = true;
       	}
      	if(!bookings.getStatus().equals(Bookings.STATUS_PENDING)) {
      		checkOrderStatus= true;
      	}
    	  System.out.println(vnp_TxnRef);
    	  System.out.println("Thanh toán thành công"+request);
     
        try {
            Map<String, String> fields = new HashMap<>();
            Enumeration<String> params = request.getParameterNames();
            while (params.hasMoreElements()) {
                String fieldName = params.nextElement();
                String fieldValue = request.getParameter(fieldName);
                if (fieldValue != null && !fieldValue.isEmpty()) {
                    fields.put(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()), URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                }
            }
            fields.remove("vnp_SecureHashType");
            fields.remove("vnp_SecureHash");
System.out.println(checkOrderId +" "+checkAmount+" "+checkOrderStatus);
            // Check checksum
            String signValue = VNPayConfig.hashAllFields(fields); // Implement Config.hashAllFields(fields)
            if (signValue.equals(vnp_SecureHash)) {

                if (checkOrderId) {
                    if (checkAmount) {
                        if (checkOrderStatus) {
                            if ("00".equals(request.getParameter("vnp_ResponseCode"))) {
                            	String ticketCode = generateTicketCode(bookings.getBookingId());
                              	bookings.setStatus(Bookings.STATUS_PENDING);
                              	bookings.setPaymentMethod("VNPay");
                              	bookings.setPaid(true);
                              	bookings.setQrCode(ticketCode);
                              	 try {
                                     bookings = bookingService.save(bookings);
                                 } catch (Exception e) {
                                     e.printStackTrace();
                                 }
                              	try {
                        				sendEmailWithQRCode(ticketCode,bookings);
                        			} catch (MessagingException | IOException | WriterException e) {
                        				// TODO Auto-generated catch block
                        				e.printStackTrace();
                        			}
                              catch (Exception e) {
                                  e.printStackTrace();
                              }
                                response.put("RspCode", "00");
                                response.put("Message", "Confirm Success");
                            } else {
                                response.put("RspCode", "00");
                                response.put("Message", "Confirm Success");
                            }
                        } else {
                            response.put("RspCode", "02");
                            response.put("Message", "Order already confirmed");
                        }
                    } else {
                        response.put("RspCode", "04");
                        response.put("Message", "Invalid Amount");
                    }
                } else {
                    response.put("RspCode", "01");
                    response.put("Message", "Order not Found");
                }
            } else {
                response.put("RspCode", "97");
                response.put("Message", "Invalid Checksum");
            }
        } catch (Exception e) {
            response.put("RspCode", "99");
            response.put("Message", "Unknown error");
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(response.toString());
    }}
    
    @GetMapping(URL_PAYPAL_CANCEL)
	public String cancelPay() {
		System.out.println("không thành công");
		return "redirect:/home";}
	

	@GetMapping(URL_PAYPAL_SUCCESS)
	public ResponseEntity<String> successPay(@RequestParam("paymentId") String paymentId, @RequestParam("PayerID") String payerId,@RequestParam("orderId")String orderId) {
	    try {
	        Payment payment = paypalService.executePayment(paymentId, payerId);
	        if (payment.getState().equals("approved")) {
	        	
	        	int orderIdint = Integer.parseInt(orderId);
	        	Bookings bookings =bookingService.findById(orderIdint);
	        	System.out.println("thành công");
	        	String ticketCode = generateTicketCode(bookings.getBookingId());
	          	bookings.setStatus(Bookings.STATUS_PENDING);
	          	bookings.setPaymentMethod("Paypal");
	          	bookings.setPaid(true);
	          	bookings.setQrCode(ticketCode);
	          	bookings=bookingService.save(bookings);
	          	try {
					sendEmailWithQRCode(ticketCode,bookings);
				} catch (MessagingException | IOException | WriterException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
	          return ResponseEntity.ok("Payment processed successfully");
			}
	        
	    } catch (PayPalRESTException e) {
	        e.printStackTrace();
	    }
	    return ResponseEntity.ok("Payment processed successfully");
	}
	@PostMapping("/ipn")
	public ResponseEntity<String> handlePayPalIPN(@RequestBody String body, HttpServletRequest request) {
	    System.out.println("paypal thành công");
	    System.out.println(body);
	    System.out.println("dừng");
	    return ResponseEntity.ok("Payment processed successfully");
	}
    
    

}
