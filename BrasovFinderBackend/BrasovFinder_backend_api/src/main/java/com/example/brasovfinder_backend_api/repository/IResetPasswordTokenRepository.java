package com.example.brasovfinder_backend_api.repository;

import com.example.brasovfinder_backend_api.user.ResetPassword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IResetPasswordTokenRepository extends JpaRepository<ResetPassword,Long> {
    ResetPassword findByToken(String token);
}
