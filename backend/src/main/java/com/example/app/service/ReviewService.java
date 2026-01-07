package com.example.app.service;

import com.example.app.model.Review;
import com.example.app.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public List<Review> getAllReviews() {
        return reviewRepository.findAllByOrderByCreatedAtDesc();
    }

    public Review createReview(String name, String role, String text, Integer rating) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Ім'я обов'язкове");
        }
        if (role == null || role.trim().isEmpty()) {
            role = "Користувач"; // значення за замовчуванням
        }
        if (text == null || text.trim().isEmpty()) {
            throw new IllegalArgumentException("Текст відгуку обов'язковий");
        }
        if (rating == null || rating < 1 || rating > 5) {
            rating = 5; // значення за замовчуванням
        }

        Review review = new Review();
        review.setName(name.trim());
        review.setRole(role.trim());
        review.setText(text.trim());
        review.setRating(rating);

        return reviewRepository.save(review);
    }
}
