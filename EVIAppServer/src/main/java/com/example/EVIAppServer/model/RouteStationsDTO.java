package com.example.EVIAppServer.model;

import com.example.EVIAppServer.entity.Routes;
import com.example.EVIAppServer.entity.Stations;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Data
@Setter
@Getter
public class RouteStationsDTO {
    private int id;
    private StationsDTO station;
    private int stopOrder;
}
