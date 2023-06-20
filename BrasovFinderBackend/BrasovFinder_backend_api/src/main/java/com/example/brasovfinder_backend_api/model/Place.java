package com.example.brasovfinder_backend_api.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;

import java.util.List;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "places")
public class Place implements Comparable<Place>{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long place_id;
    private String name;

    private double price;

    private double latitude;

    private double longitude;

    private double points;

    public Place(String name,double price,double latitude,double longitude,double points){
        this.name = name;
        if (price<0){
            throw new IllegalArgumentException("Price cannot be negative");
        }
        this.price = price;
        this.latitude = latitude;
        this.longitude = longitude;
        this.points = points;
    }

    @OneToMany(mappedBy = "placeFeedback", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Feedback> feedbacks;

    @OneToMany(mappedBy = "place",cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Image> images;

    @OneToMany(mappedBy = "placeVisit", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Visit> visits;

    private static double computeModel(double price, double points, double stars, int visits) {
        return 3.3744639091522375 + 0.030718149128136408 * price + 0.0007664796098374033 * points
                + 1.0421768288632554 * stars + 0.04102878529664218 * visits;
    }

    public double getStars() {
        return feedbacks.stream().mapToDouble(Feedback::getStars).sum()
                / feedbacks.size();
    }

    public double getRelevanceScore() {
        double stars = getStars();
        int visits1 = visits.size();
        return computeModel(price, points, stars, visits1);
    }

    @Override
    public int compareTo(@NotNull Place o) {
        return -Double.compare(getRelevanceScore(), o.getRelevanceScore());
    }

    @Override
    public String toString() {
        return "Place{" +
                "place_id=" + place_id +
                ", name='" + name + '\'' +
                ", price=" + price +
                ", latitude=" + latitude +
                ", longitude=" + longitude +
                ", points=" + points +
                '}';
    }
}
