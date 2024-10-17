package com.example.EVIAppServer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "Schedules")
public class Schedules {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "schedule_id")
    private int scheduleId;

    @ManyToOne
    @JoinColumn(name = "route_id")
    private Routes route;

    @Column(name = "departure_time")
    private LocalDateTime  departureTime;

    @Column(name = "arrival_time")
    private LocalDateTime  arrivalTime;

    @Column(name = "price")
    private double price;

    @OneToMany(mappedBy = "schedule")
    private List<Bookings> bookings;

    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicles vehicle;
}