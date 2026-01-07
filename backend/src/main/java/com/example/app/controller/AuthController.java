package com.example.app.controller;

import com.example.app.dto.RegisterRequest;
import com.example.app.dto.LoginRequest;
import com.example.app.dto.AuthResponse;
import com.example.app.dto.GoogleLoginRequest;
import com.example.app.model.Role;
import com.example.app.model.User;
import com.example.app.repository.UserRepository;
import com.example.app.service.AuthService;
import com.example.app.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final RestTemplate restTemplate;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        try {
            authService.register(request);
            return ResponseEntity.ok("Користувача успішно зареєстровано");
        } catch (RuntimeException e) {
            // Якщо user вже існує, повертаємо помилку 400 (Bad Request)
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/test")
    public ResponseEntity<?> testEndpoint(@RequestBody Map<String, String> request) {
        System.out.println("Test endpoint called with: " + request);
        return ResponseEntity.ok(Map.of("message", "Test successful", "received", request));
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(@RequestBody GoogleLoginRequest request) {
        return ResponseEntity.ok(authService.loginWithGoogle(request));
    }

    @PostMapping("/google/verify")
    public ResponseEntity<?> verifyGoogleToken(@RequestBody Map<String, String> request) {
        try {
            System.out.println("=== GOOGLE TOKEN VERIFICATION START ===");
            System.out.println("Received Google token request: " + request);
            String googleAccessToken = request.get("token");
            System.out.println("Google access token: " + (googleAccessToken != null ? googleAccessToken.substring(0, Math.min(50, googleAccessToken.length())) + "..." : "null"));

            if (googleAccessToken == null || googleAccessToken.isEmpty()) {
                System.out.println("Google token is null or empty");
                return ResponseEntity.badRequest().body("Google token is required");
            }

            // Логуємо інформацію про токен
            System.out.println("Token length: " + googleAccessToken.length());
            System.out.println("Token starts with: " + googleAccessToken.substring(0, 10));
            System.out.println("Token contains dots: " + googleAccessToken.contains("."));

            // Перевіряємо Google токен через Google API
            String googleUrl = "https://www.googleapis.com/oauth2/v3/userinfo";

            // Відправляємо заголовок Authorization: Bearer {google_token}
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(googleAccessToken);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            // Отримуємо відповідь (JSON)
            var response = restTemplate.exchange(googleUrl, HttpMethod.GET, entity, Map.class);
            Map<String, Object> googleUser = response.getBody();

            if (googleUser != null) {

                String email = (String) googleUser.get("email");
                String googleId = (String) googleUser.get("id");
                String firstName = (String) googleUser.get("given_name");
                String lastName = (String) googleUser.get("family_name");

                System.out.println("Extracted user data - email: " + email + ", id: " + googleId + ", name: " + firstName + " " + lastName);

                // Шукаємо користувача по Google ID
                Optional<User> existingUser = userRepository.findByProviderAndProviderId("google", googleId);

                User user;
                if (existingUser.isPresent()) {
                    // Користувач вже існує
                    user = existingUser.get();
                } else {
                    // Створюємо нового користувача
                    user = new User();
                    user.setEmail(email);
                    user.setFirstName(firstName);
                    user.setLastName(lastName);
                    user.setProvider("google");
                    user.setProviderId(googleId);
                    user.setRole(Role.PATIENT);
                    user.setPassword(""); // Порожній пароль для OAuth користувачів
                    user = userRepository.save(user);
                }

                // Генеруємо JWT токен
                String jwtToken = jwtService.generateToken(user);
                System.out.println("Generated JWT token for user: " + user.getEmail());
                System.out.println("=== GOOGLE TOKEN VERIFICATION SUCCESS ===");

                return ResponseEntity.ok(Map.of(
                    "token", jwtToken,
                    "email", user.getEmail(),
                    "firstName", user.getFirstName(),
                    "lastName", user.getLastName()
                ));
            } else {
                return ResponseEntity.badRequest().body("Invalid Google token");
            }

        } catch (Exception e) {
            System.out.println("=== GOOGLE TOKEN VERIFICATION ERROR ===");
            System.out.println("Error verifying Google token: " + e.getMessage());
            e.printStackTrace();
            System.out.println("=== END ERROR ===");
            return ResponseEntity.badRequest().body("Failed to verify Google token: " + e.getMessage());
        }
    }


}