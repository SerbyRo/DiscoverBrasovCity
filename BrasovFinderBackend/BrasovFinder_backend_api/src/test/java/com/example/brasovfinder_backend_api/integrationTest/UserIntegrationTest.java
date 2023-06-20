package com.example.brasovfinder_backend_api.integrationTest;

import com.example.brasovfinder_backend_api.auth.AuthenticationController;
import com.example.brasovfinder_backend_api.auth.AuthenticationService;
import com.example.brasovfinder_backend_api.config.JwtService;
import com.example.brasovfinder_backend_api.model.Feedback;
import com.example.brasovfinder_backend_api.model.Place;
import com.example.brasovfinder_backend_api.service.VisitService;
import com.example.brasovfinder_backend_api.user.Role;
import com.example.brasovfinder_backend_api.user.User;
import com.example.brasovfinder_backend_api.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserIntegrationTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthenticationService authenticationService;

    @Mock
    private VisitService visitService;

    @InjectMocks
    private JwtService jwtService;


    @Test
    public void testGetUserByUsername() throws Exception {
        String username = "licenta";
        User user = new User(23, username, "$2a$10$RqL6AvbIUU3gkeNxkQldtO4iX9a5BATvGEE7ZR0jiTQ6aZHxiqOQu", "licenta@gmail.com", 0, null, null, Role.USER);
        Place place = new Place(77L,"Iulius Mall",4,46.7716798,23.6255747,5,null,null,null);
        Feedback feedback = new Feedback(237L,"Nu e deschis la Starbucks",1,place,user);
        place.setFeedbacks(List.of(feedback));
        user.setFeedbacks(List.of(feedback));
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
//        System.out.println(user);
        AuthenticationController authenticationController = new AuthenticationController(authenticationService,visitService,jwtService);
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(authenticationController).build();

        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/places/auth/users/{username}", username)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.username").value(username));
    }

}