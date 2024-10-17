package com.example.EVIAppServer.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingDetailsDTO {
		private int bookingDetailId;
	    private SeatsDTO seat;
}
