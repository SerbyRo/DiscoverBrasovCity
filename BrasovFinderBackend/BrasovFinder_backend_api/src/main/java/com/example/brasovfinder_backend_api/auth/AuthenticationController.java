package com.example.brasovfinder_backend_api.auth;

import com.example.brasovfinder_backend_api.config.JwtService;
import com.example.brasovfinder_backend_api.dto.VisitWithPlaceDto;
import com.example.brasovfinder_backend_api.exception.NotFoundException;
import com.example.brasovfinder_backend_api.service.VisitService;
import com.example.brasovfinder_backend_api.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/places/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;

    private final VisitService visitService;

    private final JwtService jwtService;

    @PostMapping("/register")
    @CrossOrigin
    public void register(
            @RequestBody RegisterRequest request
    ){
        service.register(request);
    }



    @GetMapping("/user/{token}")
    @CrossOrigin
    public Optional<User> findUserByToken(@PathVariable("token") String token) throws NotFoundException {
        return service.findUserByUsername(jwtService.extractUsername(token));
    }

    @PostMapping("/authenticate")
    @CrossOrigin
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ){
        return ResponseEntity.ok(service.authenticate(request));
    }

    @GetMapping("/{user_id}/visitsList")
    @CrossOrigin
    public List<VisitWithPlaceDto> findAllPlacesByUserId(@PathVariable("user_id") Integer user_id) throws NotFoundException {
        return visitService.findVisitByUserId(user_id).stream()
                .map(VisitWithPlaceDto::toDto)
                .toList();
    }
}
