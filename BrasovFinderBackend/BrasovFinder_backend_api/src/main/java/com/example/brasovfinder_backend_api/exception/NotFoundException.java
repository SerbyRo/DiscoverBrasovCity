package com.example.brasovfinder_backend_api.exception;

public class NotFoundException extends Exception{
    public NotFoundException() {
    }

    public NotFoundException(String message) {
        super(message);
    }
}
