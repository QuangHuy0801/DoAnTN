package com.example.EVIAppServer.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class StationUpdateDTO {
	    private int id;
	    private int stationId;
	    private String stationName;
	    private String stationAddress;
	    private Integer stopOrder;

}
