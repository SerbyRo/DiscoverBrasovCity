package com.example.brasovfinder_backend_api.controller;

import com.example.brasovfinder_backend_api.dto.FeedbackDto;
import com.example.brasovfinder_backend_api.dto.FeedbackWithPlaceDto;
import com.example.brasovfinder_backend_api.dto.FeedbackWithUserDto;
import com.example.brasovfinder_backend_api.exception.DuplicateExeption;
import com.example.brasovfinder_backend_api.exception.NotFoundException;
import com.example.brasovfinder_backend_api.model.Feedback;
import com.example.brasovfinder_backend_api.model.Place;
import com.example.brasovfinder_backend_api.repository.IFeedbackRepository;
import com.example.brasovfinder_backend_api.repository.IPlaceRepository;
import com.example.brasovfinder_backend_api.service.FeedbackService;
import com.example.brasovfinder_backend_api.service.PlaceService;
import com.example.brasovfinder_backend_api.user.User;
import com.example.brasovfinder_backend_api.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/places")
public class FeedbackController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IPlaceRepository placeRepository;

    @Autowired
    private IFeedbackRepository feedbackRepository;

    private final PlaceService placeService;

    private final FeedbackService feedbackService;

    public FeedbackController(PlaceService placeService, FeedbackService feedbackService) {
        this.placeService = placeService;
        this.feedbackService = feedbackService;
    }

    @PostMapping("/feedbacks")
    @CrossOrigin
    public Feedback addFeedback(@RequestBody FeedbackDto feedbackDto) throws NotFoundException, DuplicateExeption {
        System.out.println(feedbackDto);
        User user =userRepository.findById(feedbackDto.getUser_id())
                .orElseThrow(() -> new IllegalArgumentException("Innvalid user"));

        Place place = placeRepository.findById(feedbackDto.getPlace_id())
                .orElseThrow(()-> new IllegalArgumentException("Invalid place"));
        Feedback feedback =Feedback.builder().placeFeedback(place)
                .userFeedback(user)
                .stars(feedbackDto.getStars())
                .feedback_text(feedbackDto.getFeedback_text())
                .build();
        user.setPersonal_score(user.getPersonal_score()+1);
        return feedbackService.addFeedback(feedback);
    }

    @GetMapping("/feedbacks/place/{placeId}")
    @CrossOrigin
    public List<FeedbackWithUserDto> getFeedbacksByPlaceId(@PathVariable("placeId") Long placeId) throws NotFoundException {
        return feedbackService.findFeedbackByPlaceId(placeId).stream()
                .map(FeedbackWithUserDto::toDto)
                .toList();
    }
    @GetMapping("/feedbacks/user/{userId}")
    @CrossOrigin
    public List<FeedbackWithPlaceDto> getFeedbacksByUserId(@PathVariable("userId") Integer userId) throws NotFoundException {
        return feedbackService.findFeedbackByUserId(userId)
                .stream().map(FeedbackWithPlaceDto::toDto)
                .toList();
    }

    @DeleteMapping("/feedbacks/delete/{feedbackId}")
    @CrossOrigin
    public String deleteFeedback(@PathVariable("feedbackId") Long feedbackId) throws NotFoundException {
        if (!feedbackRepository.existsById(feedbackId)){
            throw new NotFoundException("Feedback not found!");
        }
        Feedback feedback = feedbackRepository.findById(feedbackId).get();
        User user = feedback.getUserFeedback();
        user.setPersonal_score(user.getPersonal_score()-1);
        return feedbackService.deleteFeedback(feedbackId);
    }

    @GetMapping("feedbacks/{placeId}/{userId}")
    @CrossOrigin
    public Feedback findFeedbackByPlaceIdAndUserId(@PathVariable("placeId") Long place_id, @PathVariable("userId") Integer user_id) throws NotFoundException {
        if (!placeRepository.existsById(place_id)){
            throw new NotFoundException("Place not found!");
        }
        if (!userRepository.existsById(user_id)){
            throw new NotFoundException("User not found!");
        }
        return feedbackService.findFeedbackByPlaceIdAndUserId(place_id,user_id);
    }

}