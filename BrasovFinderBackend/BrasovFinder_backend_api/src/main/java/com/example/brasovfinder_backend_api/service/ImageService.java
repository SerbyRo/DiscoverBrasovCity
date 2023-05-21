package com.example.brasovfinder_backend_api.service;

import com.example.brasovfinder_backend_api.exception.NotFoundException;
import com.example.brasovfinder_backend_api.model.Image;

import java.util.List;
import java.util.Optional;

public interface ImageService {
    List<Image> getAllImages();

    Optional<Image> findImageById(Long id);

    Image addImage(Image image);

    void updateImage(Image newImage);

    String deleteImage(Long id) throws NotFoundException;

    List<Image> findByPlaceId(Long id) throws NotFoundException;
}
