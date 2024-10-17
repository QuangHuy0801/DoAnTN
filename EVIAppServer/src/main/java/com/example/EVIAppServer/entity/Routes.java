package com.example.EVIAppServer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "Routes")
public class Routes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "route_id")
    private int routeId;

    @Column(name = "end_location")
    private String endLocation;
    @Column(name = "start_location")
    private String startLocation;
    @Column(name = "distance")
    private double distance;
    @OneToMany(mappedBy = "route")
    private List<RouteStations> routeStations;
    @OneToMany(mappedBy = "route")
    private List<Schedules> schedules;
}
