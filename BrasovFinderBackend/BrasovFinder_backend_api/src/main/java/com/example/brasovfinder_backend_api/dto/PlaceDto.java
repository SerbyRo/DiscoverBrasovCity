package com.example.brasovfinder_backend_api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class PlaceDto {
    private Long place_id;
    private String name;

    private Date booked_date;

    private double price;

    private double latitude;

    private double longitude;
}
