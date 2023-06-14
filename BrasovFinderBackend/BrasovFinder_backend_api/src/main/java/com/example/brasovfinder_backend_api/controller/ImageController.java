package com.example.brasovfinder_backend_api.controller;


import com.example.brasovfinder_backend_api.exception.NotFoundException;
import com.example.brasovfinder_backend_api.model.Image;
import com.example.brasovfinder_backend_api.repository.IPlaceRepository;
import com.example.brasovfinder_backend_api.service.ImageService;
import com.example.brasovfinder_backend_api.service.PlaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/places")
public class ImageController {
    private final ImageService imageService;
    private final PlaceService placeService;



    @Autowired
    private IPlaceRepository placeRepository;

    public ImageController(ImageService imageService, PlaceService placeService) {
        this.imageService = imageService;
        this.placeService = placeService;
    }

    @GetMapping("/{placeId}/images")
    @CrossOrigin
    public List<Image> getImagesByPlaceId(@PathVariable("placeId") Long placeId) throws NotFoundException {
        return imageService.findByPlaceId(placeId);
    }

    @GetMapping("/{placeId}/imagesOne")
    @CrossOrigin
    public Image getFirstImageByPlaceId(@PathVariable("placeId") Long placeId) throws NotFoundException {
        return imageService.findByPlaceId(placeId).stream().findFirst().orElse(null);
    }

    @PostMapping("/{placeId}/images")
    @CrossOrigin
    public Image addImage(@PathVariable("placeId") Long placeId, @RequestBody Image image) throws NotFoundException {
        return placeService.findPlaceById(placeId)
                .map(place -> {
                    image.setPlace(place);
                    image.setPhoto_path("data:image/jpeg;base64," + image.getPhoto_path());
                    return imageService.addImage(image);
                }).orElseThrow(()-> new NotFoundException("Place not found!"));
    }

    @PutMapping("/{placeId}/images/{imageId}")
    @CrossOrigin
    public Image updateImage(@PathVariable("placeId") Long placeId,
                             @PathVariable("imageId") Long imageId,
                             @RequestBody Image imageUpdated) throws NotFoundException {
        if (!placeRepository.existsById(placeId)){
            throw new NotFoundException("Place not found!");
        }
        return imageService.findImageById(imageId)
                .map(image -> {
                    image.setPhoto_path(imageUpdated.getPhoto_path());
                    return imageService.addImage(image);
                }).orElseThrow(()-> new NotFoundException("Place not found!"));
    }

    @DeleteMapping("/{placeId}/images/{imageId}")
    @CrossOrigin
    public String deleteImage(@PathVariable("placeId") Long placeId,
                              @PathVariable("imageId") Long imageId) throws NotFoundException {
        if (!placeRepository.existsById(placeId)){
            throw new NotFoundException("Place not found!");
        }
        return imageService.deleteImage(imageId);
    }
}
