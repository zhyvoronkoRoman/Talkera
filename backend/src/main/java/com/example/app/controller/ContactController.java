package com.example.app.controller;

import com.example.app.dto.ContactRequest;
import com.example.app.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final EmailService emailService;

    @PostMapping("/send")
    public ResponseEntity<?> sendContactMessage(@RequestBody ContactRequest request) {
        try {
            // Валідація даних
            if (request.getName() == null || request.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Ім'я обов'язкове");
            }
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email обов'язковий");
            }
            if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Повідомлення обов'язкове");
            }

            // Відправляємо email
            emailService.sendContactMessage(
                request.getName().trim(),
                request.getEmail().trim(),
                request.getMessage().trim()
            );

            return ResponseEntity.ok("Повідомлення успішно надіслано!");

        } catch (Exception e) {
            System.err.println("Помилка обробки контактної форми: " + e.getMessage());
            return ResponseEntity.internalServerError().body("Помилка відправки повідомлення. Спробуйте пізніше.");
        }
    }
}
