package com.example.brasovfinder_backend_api.service.impl;

import com.example.brasovfinder_backend_api.exception.DuplicateExeption;
import com.example.brasovfinder_backend_api.exception.NotFoundException;
import com.example.brasovfinder_backend_api.model.Feedback;
import com.example.brasovfinder_backend_api.model.Place;
import com.example.brasovfinder_backend_api.repository.IFeedbackRepository;
import com.example.brasovfinder_backend_api.repository.IPlaceRepository;
import com.example.brasovfinder_backend_api.service.FeedbackService;
import com.example.brasovfinder_backend_api.user.User;
import com.example.brasovfinder_backend_api.user.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FeedbackServiceImpl implements FeedbackService {


    private final IPlaceRepository placeRepository;
    private final IFeedbackRepository feedbackRepository;

    private final UserRepository userRepository;

    public FeedbackServiceImpl(IPlaceRepository placeRepository, IFeedbackRepository feedbackRepository, UserRepository userRepository) {
        this.placeRepository = placeRepository;
        this.feedbackRepository = feedbackRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<Feedback> getAllFeedbacks() {
        return null;
    }

    @Override
    public Feedback addFeedback(Feedback feedback) throws DuplicateExeption {
        if (feedbackRepository.findFeedbackByPlaceFeedbackAndUserFeedback(feedback.getPlaceFeedback(),feedback.getUserFeedback()) != null){
            throw new DuplicateExeption("A feedback with this user id and place id already exists!");
        }
        placeRepository.findById(feedback.getPlaceFeedback().getPlace_id());
        userRepository.findById(feedback.getUserFeedback().getId());
        return feedbackRepository.save(feedback);
    }

    @Override
    public Optional<Feedback> findFeedbackById(Long feedback_id) {
        return feedbackRepository.findById(feedback_id);
    }

    @Override
    public Feedback updateFeedback(Feedback feedback) {
        return null;
    }

    @Override
    public String deleteFeedback(Long feedback_id) throws NotFoundException {
        return feedbackRepository.findById(feedback_id)
                .map(feedback -> {
                    feedbackRepository.delete(feedback);
                    return "Delete successfully!";
                }).orElseThrow(()-> new NotFoundException("Feedback not found!"));
    }

    @Override
    public List<Feedback> findFeedbackByPlaceId(Long id) throws NotFoundException {

        if (!placeRepository.existsById(id)){
            throw new NotFoundException("Place not found!");
        }
        Optional<Place> place = placeRepository.findById(id);
        List<Feedback> feedbackList = new ArrayList<>();
        for (Feedback feedback: place.get().getFeedbacks())
        {
            feedbackList.add(feedback);
        }
        return feedbackList;
    }

    @Override
    public List<Feedback> findFeedbackByUserId(Integer id) throws NotFoundException {
        if (!userRepository.existsById(id)){
            throw new NotFoundException("User not found!");
        }
        Optional<User> user = userRepository.findById(id);
        return user.get().getFeedbacks();
    }
}
