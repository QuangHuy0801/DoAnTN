package com.example.EVIAppServer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "RouteStations")
public class RouteStations {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @ManyToOne
    @JoinColumn(name = "route_id")
    private Routes route;

    @ManyToOne
    @JoinColumn(name = "station_id")
    private Stations station;

    @Column(name = "stop_order")
    private int stopOrder;
}
