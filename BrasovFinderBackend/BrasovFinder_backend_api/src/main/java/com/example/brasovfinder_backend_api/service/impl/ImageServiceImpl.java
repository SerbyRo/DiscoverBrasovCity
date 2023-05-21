package com.example.brasovfinder_backend_api.service.impl;

import com.example.brasovfinder_backend_api.exception.NotFoundException;
import com.example.brasovfinder_backend_api.model.Image;
import com.example.brasovfinder_backend_api.model.Place;
import com.example.brasovfinder_backend_api.repository.IImageRepository;
import com.example.brasovfinder_backend_api.repository.IPlaceRepository;
import com.example.brasovfinder_backend_api.service.ImageService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ImageServiceImpl implements ImageService {

    private final IImageRepository imageRepository;
    private final IPlaceRepository placeRepository;


    public ImageServiceImpl(IImageRepository imageRepository, IPlaceRepository placeRepository) {
        this.imageRepository = imageRepository;
        this.placeRepository = placeRepository;
    }


    @Override
    public List<Image> getAllImages() {
        return null;
    }

    @Override
    public Optional<Image> findImageById(Long id) {
        return Optional.empty();
    }

    @Override
    public Image addImage(Image image) {
        placeRepository.findById(image.getPlace().getPlace_id());
        return imageRepository.save(image);
    }

    @Override
    public void updateImage(Image newImage) {

    }

    @Override
    public String deleteImage(Long id) throws NotFoundException {
        return imageRepository.findById(id)
                .map(image -> {
                    imageRepository.delete(image);
                    return "Delete successfully!";
                }).orElseThrow(()-> new NotFoundException("Image not found!"));
    }

    @Override
    public List<Image> findByPlaceId(Long id) throws NotFoundException {
        if (!placeRepository.existsById(id)){
            throw new NotFoundException("Place not found!");
        }
        Optional<Place> place = placeRepository.findById(id);
        return place.get().getImages();
    }
}
