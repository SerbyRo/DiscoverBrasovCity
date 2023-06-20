package com.example.brasovfinder_backend_api.unitTest;

import com.example.brasovfinder_backend_api.auth.AuthenticationService;
import com.example.brasovfinder_backend_api.exception.NotFoundException;
import com.example.brasovfinder_backend_api.model.Feedback;
import com.example.brasovfinder_backend_api.model.Place;
import com.example.brasovfinder_backend_api.user.Role;
import com.example.brasovfinder_backend_api.user.User;
import com.example.brasovfinder_backend_api.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
public class UserUnitTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthenticationService authenticationService;

    private User user;

    private Place place;

    private Feedback feedback;

    private List<User> userList;

    @BeforeEach
    void setUp() {
        user = new User(23,"licenta","$2a$10$RqL6AvbIUU3gkeNxkQldtO4iX9a5BATvGEE7ZR0jiTQ6aZHxiqOQu","licenta@gmail.com",0,null,null, Role.USER);
        place = new Place(77L,"Iulius Mall",4,46.7716798,23.6255747,5,null,null,null);
        feedback = new Feedback(237L,"Nu e deschis la Starbucks",1,place,user);
        user.setFeedbacks(List.of(feedback));
        userList = new ArrayList<>();
        userList.add(user);
    }

    @Test
    public void testFindByUsername() throws NotFoundException {

        Mockito.when(userRepository.findByUsername(user.getUsername())).thenReturn(Optional.of(user));
        Optional<User> expectedUser = authenticationService.findUserByUsername(user.getUsername());
        assertEquals(user,expectedUser.get());

    }
}