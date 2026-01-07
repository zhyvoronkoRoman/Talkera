package com.example.app.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Data // Lombok генерує геттери, сеттери, toString
@NoArgsConstructor
public class User implements UserDetails{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password; // Тут буде хеш пароля, не чистий текст!

    @Column(nullable = false)
    private String firstName; 

    private String lastName;

    private String phoneNumber;
    private String sex;

    private LocalDate birthDate; // Для віку

    @Enumerated(EnumType.STRING)
    private Role role;

    // OAuth2 поля
    private String provider; // "google", "local", null
    private String providerId; // ID від Google або null для локальних користувачів

    // --- МЕТОДИ UserDetails (Обов'язкові для Spring Security) ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Перетворюємо нашу роль (наприклад, PATIENT) у формат, який розуміє Spring Security
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return email; // Наш логін - це пошта
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}