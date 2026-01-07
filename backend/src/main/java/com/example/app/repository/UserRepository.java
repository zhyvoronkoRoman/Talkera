package com.example.app.repository;

import com.example.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Spring сам згенерує SQL запит по назві методу
    Optional<User> findByEmail(String email);
    
    // Перевірка, чи існує такий email (для реєстрації)
    Boolean existsByEmail(String email);

    // Знайти користувача за OAuth2 provider ID
    Optional<User> findByProviderId(String providerId);

    // Знайти користувача за provider та providerId
    Optional<User> findByProviderAndProviderId(String provider, String providerId);
}