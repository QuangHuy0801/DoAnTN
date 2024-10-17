package com.example.EVIAppServer.service;

import java.util.List;

import com.example.EVIAppServer.entity.RouteStations;
import com.example.EVIAppServer.entity.Routes;
import com.example.EVIAppServer.entity.Stations;

public interface RoutesService {
	 public List<Routes> getAllRoutes ();
	 public Routes save (Routes routes);
	 public Routes update(Routes routes) ;
	 public void deleteRoute(int routeID) ;
	 public Routes updateWithNewStations(Routes routes, List<RouteStations> newStations);
	 public List<Stations> getAllStations ();
	 public Routes findById (int id);
}
