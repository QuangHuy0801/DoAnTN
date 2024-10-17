package com.example.EVIAppServer.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.EVIAppServer.entity.Provinces;
import com.example.EVIAppServer.entity.User;
import com.example.EVIAppServer.model.ProvincesDTO;
import com.example.EVIAppServer.repository.ProvincesRepository;
import com.example.EVIAppServer.repository.UserRepository;
import com.example.EVIAppServer.service.ProvincesService;

@Service
public class ProvincesServiceImpl implements ProvincesService {

    private final ProvincesRepository provincesRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public ProvincesServiceImpl(ProvincesRepository provincesRepository, ModelMapper modelMapper) {
        this.provincesRepository = provincesRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public List<ProvincesDTO> getAllProvince() {
        List<Provinces> provinces = provincesRepository.findAll();
        return provinces.stream()
                        .map(province -> modelMapper.map(province, ProvincesDTO.class))
                        .collect(Collectors.toList());
    }
}
