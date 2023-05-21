package com.example.brasovfinder_backend_api.exception;

public class InvalidTokenException extends Exception{
    public InvalidTokenException() {
    }

    public InvalidTokenException(String message) {
        super(message);
    }
}
