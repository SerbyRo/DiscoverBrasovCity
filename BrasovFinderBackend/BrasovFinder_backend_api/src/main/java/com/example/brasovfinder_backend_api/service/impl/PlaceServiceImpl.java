package com.example.brasovfinder_backend_api.service.impl;

import com.example.brasovfinder_backend_api.exception.NotFoundException;
import com.example.brasovfinder_backend_api.model.Place;
import com.example.brasovfinder_backend_api.model.Visit;
import com.example.brasovfinder_backend_api.repository.IPlaceRepository;
import com.example.brasovfinder_backend_api.service.PlaceService;
import com.example.brasovfinder_backend_api.service.VisitService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;


@Service
public class PlaceServiceImpl implements PlaceService {

    private final IPlaceRepository placeRepository;

    private final VisitService visitService;

    public PlaceServiceImpl(IPlaceRepository placeRepository, VisitService visitService) {
        this.placeRepository = placeRepository;
        this.visitService = visitService;
    }

    @Override
    public List<Place> getAllPlaces() {
        List<Place> places = placeRepository.findAll();
        Collections.sort(places);
        for (var place : places) {
            System.out.println(place.getRelevanceScore());
        }
        return places;

    }

    @Override
    public Optional<Place> findPlaceById(Long id) throws NotFoundException {
        Optional<Place> place = placeRepository.findById(id);
        if (place.isPresent()){
            return place;
        }
        else
        {
            throw new NotFoundException("Place not found with id "+id);
        }
    }

    @Override
    public Place addPlace(Place place) {
        return placeRepository.save(place);
    }

    @Override
    public Place updatePlace(Place newPlace,Long id) throws NotFoundException {
        return placeRepository.findById(id)
                .map(place ->{
                    place.setPrice(newPlace.getPrice());
                    place.setName(newPlace.getName());
                    place.setLongitude(newPlace.getLongitude());
                    place.setLatitude(newPlace.getLatitude());
                    place.setPoints(newPlace.getPoints());
                    return placeRepository.save(place);
                }).orElseThrow(() -> new NotFoundException("Place not found with id " + id));
    }

    @Override
    public String deletePlace(Long id) throws NotFoundException {
        return placeRepository.findById(id)
                .map(place -> {
                    placeRepository.delete(place);
                    return "Delete successfully!";
                }).orElseThrow(()-> new NotFoundException("Place not found with id "+id));
    }

    @Override
    public List<Place> findAllPlacesByUserId(Integer user_id) throws NotFoundException {
        List<Visit> visitList = visitService.findVisitByUserId(user_id);
        List<Place> placeList = new ArrayList<>();
        for (Visit visit: visitList){
            placeList.add(visit.getPlaceVisit());
        }
        return placeList;
    }
}
