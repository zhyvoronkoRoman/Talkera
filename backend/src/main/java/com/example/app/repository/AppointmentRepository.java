package com.example.app.repository;

import com.example.app.model.Appointment;
import com.example.app.model.DoctorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // Знайти всі записи пацієнта
    List<Appointment> findByPatientIdOrderByDateTimeAsc(Long patientId);

    // Знайти всі записи до лікаря
    List<Appointment> findByDoctorIdOrderByDateTimeAsc(Long doctorId);

    // Перевірити, чи є запис на цей час у лікаря
    boolean existsByDoctorAndDateTime(DoctorProfile doctor, LocalDateTime dateTime);

    // Знайти всі записи лікаря на конкретний час
    List<Appointment> findByDoctorAndDateTime(DoctorProfile doctor, LocalDateTime dateTime);

    // Знайти записи в діапазоні дат для лікаря
    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId " +
           "AND a.dateTime BETWEEN :start AND :end ORDER BY a.dateTime ASC")
    List<Appointment> findByDoctorIdAndDateTimeBetween(
        @Param("doctorId") Long doctorId,
        @Param("start") LocalDateTime start,
        @Param("end") LocalDateTime end
    );

    // Знайти записи пацієнта в діапазоні дат
    @Query("SELECT a FROM Appointment a WHERE a.patient.id = :patientId " +
           "AND a.dateTime >= :start ORDER BY a.dateTime ASC")
    List<Appointment> findUpcomingByPatientId(
        @Param("patientId") Long patientId,
        @Param("start") LocalDateTime start
    );
}
