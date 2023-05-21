package com.example.brasovfinder_backend_api.dto;


import com.example.brasovfinder_backend_api.model.Visit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class VisitWithPlaceDto {
    private Long place_id;

    private String name;

    private double price;

    private Long visit_id;

    private Integer timeSinceVisit;

    public static VisitWithPlaceDto toDto(Visit visit)
    {
        return VisitWithPlaceDto.builder().place_id(visit.getPlaceVisit().getPlace_id())
                .name(visit.getPlaceVisit().getName())
                .price(visit.getPlaceVisit().getPrice())
                .visit_id(visit.getVisit_id())
                .timeSinceVisit((int) ChronoUnit.DAYS.between( visit.getVisitedAt(),LocalDateTime.now()))
                .build();
    }
}
