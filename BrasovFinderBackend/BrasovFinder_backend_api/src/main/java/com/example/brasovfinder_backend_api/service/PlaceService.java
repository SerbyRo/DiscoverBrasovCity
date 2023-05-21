package com.example.brasovfinder_backend_api.service;

import com.example.brasovfinder_backend_api.exception.InvalidDateException;
import com.example.brasovfinder_backend_api.exception.NotFoundException;
import com.example.brasovfinder_backend_api.model.Place;

import java.util.List;
import java.util.Optional;

public interface PlaceService {
    List<Place> getAllPlaces();

    Optional<Place> findPlaceById(Long id) throws NotFoundException;

    Place addPlace(Place place) throws InvalidDateException;

    Place updatePlace(Place newPlace,Long id) throws NotFoundException, InvalidDateException;

    String deletePlace(Long id) throws NotFoundException;

    List<Place> findAllPlacesByUserId(Integer user_id) throws NotFoundException;
}
