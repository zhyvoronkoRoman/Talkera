package com.example.app.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "doctor_profiles")
@Data
@NoArgsConstructor
public class DoctorProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Зв'язок з таблицею User
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    private String specialization; // Логопед, Психолог...
    
    @Column(length = 1000)
    private String description; // Інформація "про себе"

    private String education; // Місце здобуття освіти

    private String experience;
    private Double price; // Вартість прийому

    private Boolean isAvailable; // Чи доступний зараз
    private String imagePath;
}