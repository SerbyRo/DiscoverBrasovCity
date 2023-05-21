package com.example.brasovfinder_backend_api.dto;

import com.example.brasovfinder_backend_api.model.Feedback;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class FeedbackWithPlaceDto {
    private Long feedback_id;

    private String feedback_text;

    private double stars;

    private Long place_id;

    private String place_name;

    public static FeedbackWithPlaceDto toDto(Feedback feedback){
        return FeedbackWithPlaceDto.builder().feedback_id(feedback.getFeedback_id())
                .feedback_text(feedback.getFeedback_text())
                .stars(feedback.getStars())
                .place_id(feedback.getPlaceFeedback().getPlace_id())
                .place_name(feedback.getPlaceFeedback().getName())
                .build();
    }
}
