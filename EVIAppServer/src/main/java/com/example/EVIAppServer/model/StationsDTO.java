package com.example.EVIAppServer.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StationsDTO {
    private int stationId;
    private String stationName;
    private String stationAddress;
}