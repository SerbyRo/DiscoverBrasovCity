package com.example.brasovfinder_backend_api.service;

import com.example.brasovfinder_backend_api.exception.InvalidTokenException;
import com.example.brasovfinder_backend_api.exception.NotFoundException;
import com.fasterxml.jackson.core.JsonProcessingException;

public interface PasswordResetService {

    void resetPasswordRequest(String email) throws NotFoundException, JsonProcessingException;
    void sendEmail(String to,String subject,String text);

    void resetPassword(String token,String newPassword) throws InvalidTokenException, JsonProcessingException;

}
