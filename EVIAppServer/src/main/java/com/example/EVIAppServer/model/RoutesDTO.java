package com.example.EVIAppServer.model;

import java.util.List;


import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Data
@Getter
@Setter
public class RoutesDTO {
    private int routeId;
    private double distance;
    private String endLocation;
    private String startLocation;
    private List<RouteStationsDTO> routeStations;
}
