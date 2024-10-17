package com.example.EVIAppServer.model;

import java.util.List;

import org.springframework.util.RouteMatcher.Route;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class TripData {
    private Route route;
    private String departureTime;
    private int seatCount;
    private int price;
    private List<String> selectedSeats;
    private String pickUpPoint;
    private String dropOffPoint;
}
