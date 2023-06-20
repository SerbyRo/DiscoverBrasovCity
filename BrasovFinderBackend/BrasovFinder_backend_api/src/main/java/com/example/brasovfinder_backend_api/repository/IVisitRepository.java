package com.example.brasovfinder_backend_api.repository;

import com.example.brasovfinder_backend_api.model.Place;
import com.example.brasovfinder_backend_api.model.Visit;
import com.example.brasovfinder_backend_api.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IVisitRepository extends JpaRepository<Visit,Long> {
    Visit findVisitByUserVisitAndPlaceVisit(User user, Place place);

    List<Visit> findVisitByUserVisit(User user);
}
