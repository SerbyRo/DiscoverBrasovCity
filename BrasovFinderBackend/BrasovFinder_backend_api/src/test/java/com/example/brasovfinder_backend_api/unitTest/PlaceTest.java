package com.example.brasovfinder_backend_api.unitTest;

import com.example.brasovfinder_backend_api.model.Place;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class PlaceTest {
    @Test
    void constructorTest(){
        String name = "place2";
        double price = 12.54;
        double latitude = 9.45;
        double longitude = 34.11;
        double points = 9;

        Place place = new Place(null,name,price,latitude,longitude,points,null,null,null);

        assertEquals(place.getName(),name);
        assertEquals(place.getPrice(),price);
        assertEquals(place.getLatitude(),latitude);
        assertEquals(place.getLongitude(),longitude);
        assertEquals(place.getPoints(),points);

        double price1 = -9;
        assertThrows(IllegalArgumentException.class, () -> new Place(name,price1,latitude,longitude,points));

        String name2 = "namePlace";
        double price2 = 32.99;
        double latitude2 = 10.34;
        double longitude2 = 32.53;
        double points2 = 6;
        place.setName(name2);
        place.setLatitude(latitude2);
        place.setLongitude(longitude2);
        place.setPrice(price2);
        place.setPoints(points2);

        assertEquals(place.getName(),name2);
        assertEquals(place.getPrice(),price2);
        assertEquals(place.getLatitude(),latitude2);
        assertEquals(place.getLongitude(),longitude2);
        assertEquals(place.getPoints(),points2);
    }
}
