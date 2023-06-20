package com.example.brasovfinder_backend_api.model;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PlaceTest {

    private Place validPlace;

    @BeforeEach
    void setUp() {
        try{
            validPlace = new Place(null, "testPlace", 23.33, 12.33, 45.11, 5, null, null, null);
        }catch (Exception ex){
            ex.printStackTrace();
        }
    }

    @Test
    void testTaskCreation() throws Exception{
        assert validPlace.getName() == "testPlace";
        assert validPlace.getPrice() == 23.33;
        assert validPlace.getLatitude() == 12.33;
        assert validPlace.getLongitude() == 45.11;
        assert validPlace.getPoints() == 5;
    }

    @AfterEach
    void tearDown() {
    }


}