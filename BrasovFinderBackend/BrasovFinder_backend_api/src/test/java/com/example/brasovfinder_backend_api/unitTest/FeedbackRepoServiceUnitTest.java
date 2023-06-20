package com.example.brasovfinder_backend_api.unitTest;

import com.example.brasovfinder_backend_api.model.Feedback;
import com.example.brasovfinder_backend_api.model.Place;
import com.example.brasovfinder_backend_api.repository.IFeedbackRepository;
import com.example.brasovfinder_backend_api.repository.IPlaceRepository;
import com.example.brasovfinder_backend_api.service.impl.FeedbackServiceImpl;
import com.example.brasovfinder_backend_api.user.Role;
import com.example.brasovfinder_backend_api.user.User;
import com.example.brasovfinder_backend_api.user.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FeedbackRepoServiceUnitTest {

    @Mock
    private IFeedbackRepository feedbackRepository;

    @Mock
    private IPlaceRepository placeRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private FeedbackServiceImpl feedbackService;

    private User user;
    private Place place;

    private Feedback feedback;
    private List<Feedback> feedbackList;


    @BeforeEach
    void setUp() {
        user = new User(23,"licenta","$2a$10$RqL6AvbIUU3gkeNxkQldtO4iX9a5BATvGEE7ZR0jiTQ6aZHxiqOQu","licenta@gmail.com",0,null,null,Role.USER);
        place = new Place(77L,"Iulius Mall",4,46.7716798,23.6255747,5,null,null,null);
        feedback = new Feedback(237L,"Nu e deschis la Starbucks",1,place,user);
        place.setFeedbacks(List.of(feedback));
        user.setFeedbacks(List.of(feedback));
        feedbackList = new ArrayList<>();
        feedbackList.add(feedback);
    }

    @Test
    void findFeedbackByPlaceAndUser(){

        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        when(placeRepository.findById(place.getPlace_id())).thenReturn(Optional.of(place));

        when(feedbackRepository.findFeedbackByPlaceFeedbackAndUserFeedback(place,user))
                .thenReturn(feedback);

        Feedback actualFeedback = feedbackService.findFeedbackByPlaceIdAndUserId(place.getPlace_id(), user.getId());
        Assertions.assertEquals(feedback, actualFeedback);
        verify(feedbackRepository).findFeedbackByPlaceFeedbackAndUserFeedback(place, user);

    }

    @AfterEach
    void tearDown() {
    }
}