package com.example.app.controller;

import com.example.app.model.Appointment;
import com.example.app.model.User;
import com.example.app.repository.UserRepository;
import com.example.app.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final UserRepository userRepository;

    // Створити новий запис
    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<Appointment> createAppointment(
            @RequestBody CreateAppointmentRequest request,
            Authentication authentication) {

        // Отримуємо email поточного користувача з токена
        String email = authentication.getName();

        // Знаходимо користувача за email
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Користувача не знайдено"));

        Long patientId = currentUser.getId();

        Appointment appointment = appointmentService.createAppointment(
            patientId,
            request.getDoctorId(),
            request.getDateTime()
        );

        return ResponseEntity.ok(appointment);
    }

    // Скасувати запис
    @PutMapping("/{appointmentId}/cancel")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<Map<String, String>> cancelAppointment(
            @PathVariable Long appointmentId,
            Authentication authentication) {

        // Отримуємо email поточного користувача з токена
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Користувача не знайдено"));
        Long patientId = currentUser.getId();

        appointmentService.cancelAppointment(appointmentId, patientId);
        return ResponseEntity.ok(Map.of("message", "Запис скасовано"));
    }

    // Отримати всі записи пацієнта
    @GetMapping("/my")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<List<Appointment>> getMyAppointments(Authentication authentication) {
        // Отримуємо email поточного користувача з токена
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Користувача не знайдено"));
        Long patientId = currentUser.getId();

        List<Appointment> appointments = appointmentService.getPatientAppointments(patientId);
        return ResponseEntity.ok(appointments);
    }

    // Отримати майбутні записи пацієнта
    @GetMapping("/my/upcoming")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<List<Appointment>> getMyUpcomingAppointments(Authentication authentication) {
        // Отримуємо email поточного користувача з токена
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Користувача не знайдено"));
        Long patientId = currentUser.getId();

        List<Appointment> appointments = appointmentService.getUpcomingPatientAppointments(patientId);
        return ResponseEntity.ok(appointments);
    }

    // Отримати всі записи лікаря
    @GetMapping("/doctor")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<Appointment>> getDoctorAppointments(Authentication authentication) {
        // Отримуємо email поточного лікаря з токена
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Користувача не знайдено"));
        Long doctorId = currentUser.getId();

        List<Appointment> appointments = appointmentService.getDoctorAppointments(doctorId);
        return ResponseEntity.ok(appointments);
    }

    // Позначити запис як завершений (для лікаря)
    @PutMapping("/{appointmentId}/complete")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<Map<String, String>> completeAppointment(
            @PathVariable Long appointmentId,
            Authentication authentication) {

        // Отримуємо email поточного лікаря з токена
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Користувача не знайдено"));
        Long doctorId = currentUser.getId();

        appointmentService.completeAppointment(appointmentId, doctorId);
        return ResponseEntity.ok(Map.of("message", "Запис позначено як завершений"));
    }
}

// DTO для створення запису
class CreateAppointmentRequest {
    private Long doctorId;
    private LocalDateTime dateTime;

    // Getters and setters
    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }

    public LocalDateTime getDateTime() { return dateTime; }
    public void setDateTime(LocalDateTime dateTime) { this.dateTime = dateTime; }
}
