package com.example.brasovfinder_backend_api.service;

import com.example.brasovfinder_backend_api.exception.DuplicateExeption;
import com.example.brasovfinder_backend_api.exception.NotFoundException;
import com.example.brasovfinder_backend_api.model.Feedback;

import java.util.List;
import java.util.Optional;

public interface FeedbackService {
    List<Feedback> getAllFeedbacks();

    Feedback addFeedback(Feedback feedback) throws DuplicateExeption;

    Optional<Feedback> findFeedbackById(Long feedback_id);

    Feedback updateFeedback(Feedback feedback);

    String deleteFeedback(Long feedback_id) throws NotFoundException;

    List<Feedback> findFeedbackByPlaceId(Long id) throws NotFoundException;


    List<Feedback> findFeedbackByUserId(Integer id) throws NotFoundException;

}
