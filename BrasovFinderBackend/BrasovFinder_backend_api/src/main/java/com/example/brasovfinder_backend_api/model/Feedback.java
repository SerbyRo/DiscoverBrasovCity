package com.example.brasovfinder_backend_api.model;

import com.example.brasovfinder_backend_api.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "feedbacks")
public class Feedback {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long feedback_id;

    private String feedback_text;

    private double stars;

    @ManyToOne(fetch = FetchType.LAZY,optional = false)
    @JoinColumn(name = "place_id",nullable = false)
    @JsonIgnore
    private Place placeFeedback;

    @ManyToOne(fetch = FetchType.LAZY,optional = false)
    @JoinColumn(name = "user_id",nullable = false)
    @JsonIgnore
    private User userFeedback;
}
