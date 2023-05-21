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
public class FeedbackWithUserDto {
    private Long feedback_id;

    private String feedback_text;

    private double stars;

    private Integer user_id;

    private String username;

    public static FeedbackWithUserDto toDto(Feedback feedback){
        return FeedbackWithUserDto.builder().feedback_id(feedback.getFeedback_id())
                .feedback_text(feedback.getFeedback_text())
                .stars(feedback.getStars())
                .user_id(feedback.getUserFeedback().getId())
                .username(feedback.getUserFeedback().getUsername())
                .build();
    }
}
