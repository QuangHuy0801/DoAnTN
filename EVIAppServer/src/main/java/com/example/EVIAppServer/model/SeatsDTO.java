package com.example.EVIAppServer.model;

import java.util.List;

import com.example.EVIAppServer.entity.BookingDetails;
import com.example.EVIAppServer.entity.Vehicles;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Data;
@Data
public class SeatsDTO {
    private int seatId;
    private String seatNumber;
    private boolean isAvailable;
}
