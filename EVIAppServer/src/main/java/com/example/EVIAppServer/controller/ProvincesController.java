package com.example.EVIAppServer.controller;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.EVIAppServer.entity.Provinces;
import com.example.EVIAppServer.model.ProvincesDTO;
import com.example.EVIAppServer.service.ProvincesService;

@CrossOrigin("*")
@RestController
public class ProvincesController {
	@Autowired
	ProvincesService provincesService;
	
	@Autowired
    private ModelMapper modelMapper;
	
	@GetMapping(path = "/getallprovince")
	public ResponseEntity<List<ProvincesDTO>> GetAllProvince(){
		List<ProvincesDTO> listProvince = provincesService.getAllProvince();
		System.out.println(listProvince.toString());
		return new ResponseEntity<>(listProvince, HttpStatus.OK);
	}

}
