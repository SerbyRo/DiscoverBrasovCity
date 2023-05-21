package com.example.brasovfinder_backend_api.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class FeedbackDto {
    private Long place_id;

    private Integer user_id;

    private double stars;

    private String feedback_text;
}
