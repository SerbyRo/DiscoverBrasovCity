package com.example.brasovfinder_backend_api.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "places")
public class Place {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long place_id;
    private String name;

    private Date booked_date;

    private double price;

    private double latitude;

    private double longitude;

    private double points;

    @OneToMany(mappedBy = "placeFeedback", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Feedback> feedbacks;

    @OneToMany(mappedBy = "place",cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Image> images;

    @OneToMany(mappedBy = "placeVisit", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Visit> visits;

}
