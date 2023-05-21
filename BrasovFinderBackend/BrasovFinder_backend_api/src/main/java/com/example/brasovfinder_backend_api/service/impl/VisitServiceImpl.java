package com.example.brasovfinder_backend_api.service.impl;

import com.example.brasovfinder_backend_api.exception.DuplicateExeption;
import com.example.brasovfinder_backend_api.exception.NotFoundException;
import com.example.brasovfinder_backend_api.model.Place;
import com.example.brasovfinder_backend_api.model.Visit;
import com.example.brasovfinder_backend_api.repository.IPlaceRepository;
import com.example.brasovfinder_backend_api.repository.IVisitRepository;
import com.example.brasovfinder_backend_api.service.VisitService;
import com.example.brasovfinder_backend_api.user.User;
import com.example.brasovfinder_backend_api.user.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VisitServiceImpl implements VisitService {

    private final IPlaceRepository placeRepository;

    private final UserRepository userRepository;
    private final IVisitRepository visitRepository;

    public VisitServiceImpl(IPlaceRepository placeRepository, UserRepository userRepository, IVisitRepository visitRepository) {
        this.placeRepository = placeRepository;
        this.userRepository = userRepository;
        this.visitRepository = visitRepository;
    }

    @Override
    public Visit addVisit(Visit visit) throws DuplicateExeption {
        System.out.println(visitRepository.findVisitByUserVisitAndPlaceVisit(visit.getUserVisit(),visit.getPlaceVisit()));
        if (visitRepository.findVisitByUserVisitAndPlaceVisit(visit.getUserVisit(),visit.getPlaceVisit()) != null)
        {
            throw new DuplicateExeption("A visit with this user id and place id already exists!");
        }
        placeRepository.findById(visit.getPlaceVisit().getPlace_id());
        userRepository.findById(visit.getUserVisit().getId());
        return visitRepository.save(visit);
    }



    @Override
    public List<Visit> findVisitByUserId(Integer user_id) throws NotFoundException {
        if (!userRepository.existsById(user_id)){
            throw new NotFoundException("The user with the given id doesn't exists!");
        }
        Optional<User> user = userRepository.findById(user_id);
        return user.get().getVisits();
    }

    @Override
    public Visit findVisitByUserIdAndPlaceId(Integer user_id, Long place_id) {
        Optional<User> user = userRepository.findById(user_id);
        Optional<Place> place = placeRepository.findById(place_id);
        return visitRepository.findVisitByUserVisitAndPlaceVisit(user.get(),place.get());
    }

    @Override
    public String deleteVisit(Long visit_id) throws NotFoundException {
        return visitRepository.findById(visit_id)
                .map(visit -> {
                    visitRepository.delete(visit);
                    return "Delete successfully!";
                }).orElseThrow(()-> new NotFoundException("Visit not found!"));
    }
}
