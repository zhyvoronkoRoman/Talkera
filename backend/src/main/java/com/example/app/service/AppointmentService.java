package com.example.app.service;

import com.example.app.model.Appointment;
import com.example.app.model.AppointmentStatus;
import com.example.app.model.DoctorProfile;
import com.example.app.model.User;
import com.example.app.repository.AppointmentRepository;
import com.example.app.repository.AppointmentSlotRepository;
import com.example.app.repository.DoctorProfileRepository;
import com.example.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final AppointmentSlotRepository slotRepository;
    private final UserRepository userRepository;
    private final DoctorProfileRepository doctorRepository;

    // Створити запис на прийом
    @Transactional
    public Appointment createAppointment(Long patientId, Long doctorId, LocalDateTime dateTime) {
        // Перевірити, чи існує слот для цього часу
        DoctorProfile doctor = doctorRepository.findById(doctorId)
            .orElseThrow(() -> new RuntimeException("Лікар не знайдений"));

        if (!slotRepository.existsByDoctorProfileAndDateTime(doctor, dateTime)) {
            throw new RuntimeException("Цей час не доступний для запису");
        }

        // Перевірити, чи немає вже запису на цей час
        if (appointmentRepository.existsByDoctorAndDateTime(doctor, dateTime)) {
            throw new RuntimeException("Цей час вже заброньовано");
        }

        // Створити запис
        User patient = userRepository.findById(patientId)
            .orElseThrow(() -> new RuntimeException("Пацієнт не знайдений"));

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setDateTime(dateTime);
        appointment.setStatus(AppointmentStatus.BOOKED);

        return appointmentRepository.save(appointment);
    }

    // Скасувати запис
    @Transactional
    public void cancelAppointment(Long appointmentId, Long patientId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Запис не знайдений"));

        // Перевірити, чи це запис цього пацієнта
        if (!appointment.getPatient().getId().equals(patientId)) {
            throw new RuntimeException("Ви можете скасовувати тільки свої записи");
        }

        // Перевірити, чи можна скасувати (наприклад, не менше ніж за 24 години)
        if (appointment.getDateTime().isBefore(LocalDateTime.now().plusHours(24))) {
            throw new RuntimeException("Неможливо скасувати запис менше ніж за 24 години");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);
    }

    // Отримати всі записи пацієнта
    public List<Appointment> getPatientAppointments(Long patientId) {
        return appointmentRepository.findByPatientIdOrderByDateTimeAsc(patientId);
    }

    // Отримати майбутні записи пацієнта
    public List<Appointment> getUpcomingPatientAppointments(Long patientId) {
        LocalDateTime now = LocalDateTime.now();
        return appointmentRepository.findUpcomingByPatientId(patientId, now);
    }

    // Отримати всі записи лікаря
    public List<Appointment> getDoctorAppointments(Long doctorId) {
        return appointmentRepository.findByDoctorIdOrderByDateTimeAsc(doctorId);
    }

    // Позначити запис як завершений (для лікаря)
    @Transactional
    public void completeAppointment(Long appointmentId, Long doctorId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Запис не знайдений"));

        // Перевірити, чи це запис цього лікаря
        if (!appointment.getDoctor().getId().equals(doctorId)) {
            throw new RuntimeException("Ви можете змінювати тільки свої записи");
        }

        appointment.setStatus(AppointmentStatus.COMPLETED);
        appointmentRepository.save(appointment);
    }
}
