package com.example.brasovfinder_backend_api.repository;

import com.example.brasovfinder_backend_api.model.Feedback;
import com.example.brasovfinder_backend_api.model.Place;
import com.example.brasovfinder_backend_api.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IFeedbackRepository extends JpaRepository<Feedback, Long> {
    Feedback findFeedbackByPlaceFeedbackAndUserFeedback(Place place, User user);
}
