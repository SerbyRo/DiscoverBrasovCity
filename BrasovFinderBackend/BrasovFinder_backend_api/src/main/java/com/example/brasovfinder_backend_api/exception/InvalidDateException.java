package com.example.brasovfinder_backend_api.exception;

public class InvalidDateException extends Exception{
    public InvalidDateException() {
    }

    public InvalidDateException(String message) {
        super(message);
    }
}
