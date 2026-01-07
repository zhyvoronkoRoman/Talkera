package com.example.app.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Хто записався (Пацієнт)
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private User patient;

    // До кого записалися (Лікар)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "doctor_profile_id")
    private DoctorProfile doctor;

    private LocalDateTime dateTime; // Дата і час запису

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status; // BOOKED, COMPLETED, CANCELLED
}