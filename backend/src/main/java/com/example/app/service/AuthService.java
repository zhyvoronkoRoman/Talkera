package com.example.app.service;

import com.example.app.dto.RegisterRequest;
import com.example.app.dto.GoogleLoginRequest;
import com.example.app.model.Role;
import com.example.app.model.User;
import com.example.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;
import java.util.UUID;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import com.example.app.dto.LoginRequest;
import com.example.app.dto.AuthResponse;
import com.example.app.security.JwtService;

@Service
@RequiredArgsConstructor // Автоматично створює конструктор для ін'єкції залежностей
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService; // Додаємо наш сервіс
    private final AuthenticationManager authenticationManager;

    public void register(RegisterRequest request) {
        // 1. Перевіряємо, чи існує email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Користувач з таким email вже існує");
        }

        // 2. Створюємо нового користувача
        User user = new User();
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName()); // Тепер це setFirstName
    user.setLastName(request.getLastName());

        
        // 3. Шифруємо пароль перед збереженням
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        // 4. Встановлюємо роль за замовчуванням
        user.setRole(Role.PATIENT);

        // 5. Зберігаємо в базу
        userRepository.save(user);
    }
    public AuthResponse login(LoginRequest request) {
        // 1. Spring сам перевіряє логін та пароль
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // 2. Якщо помилки не було - шукаємо юзера
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Користувача не знайдено"));

        // 3. Генеруємо токен
        var jwtToken = jwtService.generateToken(user);
        
        return new AuthResponse(jwtToken);
    }

    public AuthResponse loginWithGoogle(GoogleLoginRequest request) {
        // 1. Питаємо у Google інформацію про юзера за цим токеном
        // Використовуємо Google UserInfo API
        String googleUrl = "https://www.googleapis.com/oauth2/v3/userinfo";

        RestTemplate restTemplate = new RestTemplate();
        // Відправляємо заголовок Authorization: Bearer {google_token}
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.setBearerAuth(request.getToken());
        org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(headers);

        // Отримуємо відповідь (JSON)
        try {
            var response = restTemplate.exchange(googleUrl, org.springframework.http.HttpMethod.GET, entity, Map.class);
            Map<String, Object> userData = response.getBody();

            if (userData == null || !userData.containsKey("email")) {
                throw new RuntimeException("Не вдалося отримати email від Google");
            }

            String email = (String) userData.get("email");
            String firstName = (String) userData.get("given_name");
            String lastName = (String) userData.get("family_name");

            // 2. Шукаємо юзера в нашій базі
            User user = userRepository.findByEmail(email).orElse(null);

            if (user == null) {
                // 3. Якщо юзера немає - реєструємо автоматично
                user = new User();
                user.setEmail(email);
                user.setFirstName(firstName != null ? firstName : "GoogleUser");
                user.setLastName(lastName != null ? lastName : "");
                user.setRole(Role.PATIENT);
                // Генеруємо випадковий пароль, бо юзер заходить через Google
                user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));

                userRepository.save(user);
            }

            // 4. Генеруємо наш JWT токен (як при звичайному вході)
            String jwtToken = jwtService.generateToken(user);
            return new AuthResponse(jwtToken);

        } catch (Exception e) {
            throw new RuntimeException("Помилка валідації Google токена: " + e.getMessage());
        }
    }
}