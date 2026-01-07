package com.example.app.controller;

import com.example.app.model.Review;
import com.example.app.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        try {
            List<Review> reviews = reviewService.getAllReviews();
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            System.err.println("Помилка отримання відгуків: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody Map<String, Object> request) {
        try {
            // Валідація даних
            String name = (String) request.get("name");
            String role = (String) request.get("role");
            String text = (String) request.get("text");
            Integer rating = null;

            if (request.get("rating") instanceof Integer) {
                rating = (Integer) request.get("rating");
            } else if (request.get("rating") instanceof Number) {
                rating = ((Number) request.get("rating")).intValue();
            }

            if (name == null || name.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Ім'я обов'язкове");
            }
            if (text == null || text.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Текст відгуку обов'язковий");
            }

            // Створюємо відгук
            Review newReview = reviewService.createReview(name, role, text, rating);

            return ResponseEntity.ok(newReview);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.err.println("Помилка створення відгуку: " + e.getMessage());
            return ResponseEntity.internalServerError().body("Помилка створення відгуку. Спробуйте пізніше.");
        }
    }
}
