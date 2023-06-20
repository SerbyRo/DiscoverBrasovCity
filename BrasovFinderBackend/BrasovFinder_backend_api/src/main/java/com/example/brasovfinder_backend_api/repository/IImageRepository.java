package com.example.brasovfinder_backend_api.repository;

import com.example.brasovfinder_backend_api.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IImageRepository extends JpaRepository<Image, Long> {

}
