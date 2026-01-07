package com.example.app.repository;

import com.example.app.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    // Знайти всі відгуки, відсортовані за датою створення (найновіші спочатку)
    List<Review> findAllByOrderByCreatedAtDesc();
}
