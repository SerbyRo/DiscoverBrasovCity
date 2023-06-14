package com.example.brasovfinder_backend_api.controller;


import com.example.brasovfinder_backend_api.exception.InvalidTokenException;
import com.example.brasovfinder_backend_api.exception.NotFoundException;
import com.example.brasovfinder_backend_api.service.impl.PasswordResetServiceImpl;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reset")
@RequiredArgsConstructor
public class ResetPasswordController {
    private final PasswordResetServiceImpl passwordResetService;



    @PostMapping("/reset-password")
    @CrossOrigin
    public void resetPasswordRequest(@RequestBody String email) throws NotFoundException, JsonProcessingException {
        System.out.println("Ajiunge aici!");
        System.out.println(email);
        passwordResetService.resetPasswordRequest(email);
    }

    @PutMapping("/reset-password/{token}")
    @CrossOrigin
    public void resetPasswordResponse(@PathVariable("token") String token, @RequestBody String newPassword) throws InvalidTokenException, JsonProcessingException {
        passwordResetService.resetPassword(token,newPassword);
    }
}
