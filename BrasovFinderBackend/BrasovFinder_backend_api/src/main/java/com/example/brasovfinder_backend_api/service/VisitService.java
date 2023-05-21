package com.example.brasovfinder_backend_api.service;

import com.example.brasovfinder_backend_api.exception.DuplicateExeption;
import com.example.brasovfinder_backend_api.exception.NotFoundException;
import com.example.brasovfinder_backend_api.model.Visit;

import java.util.List;

public interface VisitService {
    Visit addVisit(Visit visit) throws DuplicateExeption;

    List<Visit> findVisitByUserId(Integer user_id) throws NotFoundException;

    Visit findVisitByUserIdAndPlaceId(Integer user_id,Long place_id);

    String deleteVisit(Long visit_id) throws NotFoundException;
}
