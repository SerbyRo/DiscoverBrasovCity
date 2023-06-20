package com.example.brasovfinder_backend_api.auth;

import com.example.brasovfinder_backend_api.config.JwtService;
import com.example.brasovfinder_backend_api.exception.NotFoundException;
import com.example.brasovfinder_backend_api.user.Role;
import com.example.brasovfinder_backend_api.user.User;
import com.example.brasovfinder_backend_api.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository repository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;

    public void register(RegisterRequest request) {
        var user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .role(Role.USER)
                .build();
        repository.save(user);
    }


    public Optional<User> findUserByUsername(String username) throws NotFoundException {
        Optional<User> user = repository.findByUsername(username);
        if (user.isPresent()){
            return user;
        }
        else
        {
            throw new NotFoundException("User not found with username "+username);
        }
    }

    public Optional<User> findUserById(Integer id) throws NotFoundException {
        Optional<User> user = repository.findById(id);
        if (user.isPresent()){
            return user;
        }
        else
        {
            throw new NotFoundException("User not found with id "+id);
        }
    }



    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        var user = repository.findByUsername(request.getUsername())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public List<User> findTop5ByOrderByPersonal_scoreDesc(){
        List<User> standingsUsers = repository.findTop5UsersByPersonal_scoreDesc();
        return standingsUsers;
    }

    public Integer findUserRankByPersonal_score(Integer user_id){
        return repository.findUserRankByPersonal_score(user_id);
    }

}
