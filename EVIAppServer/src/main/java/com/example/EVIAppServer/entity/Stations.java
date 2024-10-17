package com.example.EVIAppServer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "Stations")
public class Stations {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "station_id")
    private int stationId;

    @Column(name = "station_name", columnDefinition = "nvarchar(255)")
    private String stationName;

    @Column(name = "station_address", columnDefinition = "nvarchar(255)")
    private String stationAddress;

    @Column(name = "station_location")
    private String stationLocation;


    @OneToMany(mappedBy = "pickupStation")
    private List<Bookings> pickupBookings;

    @OneToMany(mappedBy = "dropoffStation")
    private List<Bookings> dropoffBookings;
    @ManyToOne
    @JoinColumn(name = "province_id")
    private Provinces province;
    
    @OneToMany(mappedBy = "station")
    private List<RouteStations> routeStations;
}