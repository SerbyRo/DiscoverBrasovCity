package com.example.brasovfinder_backend_api.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Integer> {
    Optional<User> findByUsername(String username);
    User findByEmail(String email);

    Optional<User> findById(Integer id);

    @Query("SELECT u FROM User u ORDER BY u.personal_score DESC LIMIT 5")
    List<User> findTop5UsersByPersonal_scoreDesc();

    @Query("SELECT (COUNT(u)+1) FROM User u WHERE u.personal_score>(SELECT u2.personal_score from User u2 WHERE u2.id = :userId)")
    Integer findUserRankByPersonal_score(@Param("userId") Integer userId);
}
