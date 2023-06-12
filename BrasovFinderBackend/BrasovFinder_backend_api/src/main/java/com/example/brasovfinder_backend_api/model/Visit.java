package com.example.brasovfinder_backend_api.model;

import com.example.brasovfinder_backend_api.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "visits")
public class Visit implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long visit_id;

    @CreationTimestamp
    private LocalDateTime visitedAt;

//    @PrePersist
//    public void prePersist() {
//        visitedAt = new Date();
//    }

    @ManyToOne(fetch = FetchType.LAZY,optional = false)
    @JoinColumn(name = "place_id",nullable = false)
    @JsonIgnore
    private Place placeVisit;

    @ManyToOne(fetch = FetchType.LAZY,optional = false)
    @JoinColumn(name = "user_id",nullable = false)
    @JsonIgnore
    private User userVisit;

    @Override
    public String toString() {
        return "Visit{" +
                "visit_id=" + visit_id +
                ", visitedAt=" + visitedAt +
                '}';
    }
}
