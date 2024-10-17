package com.example.EVIAppServer.service;

import org.springframework.stereotype.Service;

import com.example.EVIAppServer.model.CustomerInfo;
import com.example.EVIAppServer.model.TripData;

@Service
public class MomoPaymentService {
	    public String createPaymentUrl(CustomerInfo customerInfo, TripData tripData) {
	        // Implement Momo payment URL generation logic
	        // For example, call Momo API with the booking details and return the URL
	        return "https://example.com/payment-url"; // Replace with actual logic
	    
	}
}
