package com.example.brasovfinder_backend_api.controller;

import com.example.brasovfinder_backend_api.dto.VisitDto;
import com.example.brasovfinder_backend_api.exception.DuplicateExeption;
import com.example.brasovfinder_backend_api.exception.NotFoundException;
import com.example.brasovfinder_backend_api.model.Place;
import com.example.brasovfinder_backend_api.model.Visit;
import com.example.brasovfinder_backend_api.repository.IPlaceRepository;
import com.example.brasovfinder_backend_api.repository.IVisitRepository;
import com.example.brasovfinder_backend_api.service.PlaceService;
import com.example.brasovfinder_backend_api.service.VisitService;
import com.example.brasovfinder_backend_api.user.User;
import com.example.brasovfinder_backend_api.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/places")
public class VisitController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IPlaceRepository placeRepository;

    @Autowired
    private IVisitRepository visitRepository;

    private final PlaceService placeService;

    private final VisitService visitService;

    public VisitController(PlaceService placeService, VisitService visitService) {
        this.placeService = placeService;
        this.visitService = visitService;
    }

    @PostMapping("/visits")
    @CrossOrigin
    public Visit addVisit(@RequestBody VisitDto visitDto) throws NotFoundException, DuplicateExeption {
        User user =userRepository.findById(visitDto.getUser_id())
                .orElseThrow(() -> new IllegalArgumentException("Innvalid user"));

        Place place = placeRepository.findById(visitDto.getPlace_id())
                .orElseThrow(()-> new IllegalArgumentException("Invalid place"));
        double numberOfPoints = place.getPoints();
        user.setPersonal_score(user.getPersonal_score()+numberOfPoints);
        Visit visit =Visit.builder().placeVisit(place)
                .userVisit(user)
                .build();
        return visitService.addVisit(visit);
    }

    @DeleteMapping("/visits/delete/{visitId}")
    @CrossOrigin
    public String deleteVisit(@PathVariable("visitId") Long visitId) throws NotFoundException {
        if (!visitRepository.existsById(visitId)){
            throw new NotFoundException("Visit not found!");
        }
        Optional<Visit> visit = visitRepository.findById(visitId);
        Optional<User> user = userRepository.findById(visit.get().getUserVisit().getId());
        Optional<Place> place = placeRepository.findById(visit.get().getPlaceVisit().getPlace_id());
        user.get().setPersonal_score(user.get().getPersonal_score()-place.get().getPoints());
        return visitService.deleteVisit(visitId);
    }

    @GetMapping("visits/{placeId}/{userId}")
    @CrossOrigin
    public Visit findVisitByUserIdAndPlaceId(@PathVariable("placeId") Long place_id,@PathVariable("userId") Integer user_id) throws NotFoundException {
        if (!placeRepository.existsById(place_id)){
            throw new NotFoundException("Place not found!");
        }
        if (!userRepository.existsById(user_id)){
            throw new NotFoundException("User not found!");
        }
        return visitService.findVisitByUserIdAndPlaceId(user_id,place_id);
    }
}
