package com.example.app.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointment_slots")
@Data // Lombok генерує геттери, сеттери, toString
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_profile_id", nullable = false)
    private DoctorProfile doctorProfile;

    @Column(nullable = false)
    private LocalDateTime dateTime; // Дата і час початку слота

    @Column(nullable = false)
    private Integer durationMinutes = 30; // Тривалість прийому в хвилинах

    // AppointmentSlot більше не містить інформацію про бронювання!
    // Це просто розклад лікаря - доступні часи для прийому

    @Column
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    // Конструктор для створення нових слотів
    public AppointmentSlot(DoctorProfile doctorProfile, LocalDateTime dateTime) {
        this.doctorProfile = doctorProfile;
        this.dateTime = dateTime;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // AppointmentSlot тепер просто містить інформацію про розклад!
    // Бронювання перевіряється через таблицю appointments
}
