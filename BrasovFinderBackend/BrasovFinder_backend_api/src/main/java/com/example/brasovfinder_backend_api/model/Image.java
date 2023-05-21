package com.example.brasovfinder_backend_api.model;


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
@Table(name = "images")
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long image_id;

    private String photo_path;

    @ManyToOne(fetch = FetchType.LAZY,optional = false)
    @JoinColumn(name = "place_id",nullable = false)
    @JsonIgnore
    private Place place;

}
