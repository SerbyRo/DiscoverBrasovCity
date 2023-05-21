package com.example.brasovfinder_backend_api.controller;


import com.example.brasovfinder_backend_api.exception.InvalidDateException;
import com.example.brasovfinder_backend_api.exception.NotFoundException;
import com.example.brasovfinder_backend_api.model.Place;
import com.example.brasovfinder_backend_api.service.PlaceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/places")
public class PlaceController {

    private final PlaceService placeService;

    public PlaceController(PlaceService placeService) {
        this.placeService = placeService;
    }

    @GetMapping
    @CrossOrigin
    public List<Place> getAllPlaces(){
        return placeService.getAllPlaces();
    }

    @GetMapping("/{id}")
    @CrossOrigin
    public Optional<Place> findPlaceById(@PathVariable("id") Long id) throws NotFoundException {
        return placeService.findPlaceById(id);
    }

    @PostMapping
    @CrossOrigin
    public Place addPlace(@RequestBody Place place) throws InvalidDateException {
        return placeService.addPlace(place);
    }


    @PutMapping("/{id}")
    @CrossOrigin
    public Place updatePlace(@RequestBody Place place, @PathVariable("id") Long id) throws NotFoundException, InvalidDateException {
        return placeService.updatePlace(place,id);
    }


    @DeleteMapping("/{id}")
    @CrossOrigin
    public String deletePlace(@PathVariable("id") Long id) throws NotFoundException {
        return placeService.deletePlace(id);
    }
}
