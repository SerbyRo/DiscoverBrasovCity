package com.example.brasovfinder_backend_api.service.impl;

import com.example.brasovfinder_backend_api.exception.InvalidTokenException;
import com.example.brasovfinder_backend_api.exception.NotFoundException;
import com.example.brasovfinder_backend_api.repository.IResetPasswordTokenRepository;
import com.example.brasovfinder_backend_api.service.PasswordResetService;
import com.example.brasovfinder_backend_api.user.ResetPassword;
import com.example.brasovfinder_backend_api.user.User;
import com.example.brasovfinder_backend_api.user.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class PasswordResetServiceImpl implements PasswordResetService {

    private final UserRepository userRepository;
    private final IResetPasswordTokenRepository resetPasswordTokenRepository;

    private final JavaMailSender mailSender;
    private PasswordEncoder passwordEncoder;

    //passwordEncoder.encode(request.getPassword())

    public PasswordResetServiceImpl(UserRepository userRepository, IResetPasswordTokenRepository resetPasswordTokenRepository, JavaMailSender mailSender, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.resetPasswordTokenRepository = resetPasswordTokenRepository;
        this.mailSender = mailSender;
        this.passwordEncoder = passwordEncoder;
    }


    @Override
    public void resetPasswordRequest(String email) throws NotFoundException, JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(email);
        String emailAddress = rootNode.asText();
        System.out.println(emailAddress);
        User user = userRepository.findByEmail(emailAddress);
        System.out.println(user.getEmail());

        if (user.getEmail() == null){
            throw new NotFoundException();
        }

        String token = UUID.randomUUID().toString();
        System.out.println(token);

        ResetPassword resetPassword = new ResetPassword(token,user);
        resetPasswordTokenRepository.save(resetPassword);
        System.out.println(resetPassword);

        String resetUrl = "http://localhost:8100/reset-password/" + token;
        System.out.println(resetUrl);
        String subject = " Password forgotten? No worries, reset your password here";
        System.out.println(subject);
        String text = " For resetting the password please click here: " + resetUrl;
        System.out.println(text);
        sendEmail(user.getEmail(),subject,text);
    }

    @Override
    public void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }

    @Override
    public void resetPassword(String token, String newPassword) throws InvalidTokenException, JsonProcessingException {
        ResetPassword resetPassword = resetPasswordTokenRepository.findByToken(token);
        if (resetPassword ==null || resetPassword.isExpired())
        {
            throw new InvalidTokenException("Invalid token");
        }

        User user = resetPassword.getUser();
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(newPassword);
        String changedPassword = rootNode.get("newPassword").asText();
        System.out.println(changedPassword);
        user.setPassword(passwordEncoder.encode(changedPassword));
        userRepository.save(user);

        resetPasswordTokenRepository.delete(resetPassword);
    }
}
