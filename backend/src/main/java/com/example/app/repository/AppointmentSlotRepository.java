package com.example.app.repository;

import com.example.app.model.AppointmentSlot;
import com.example.app.model.DoctorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentSlotRepository extends JpaRepository<AppointmentSlot, Long> {

    // Знайти всі слоти для конкретного лікаря
    List<AppointmentSlot> findByDoctorProfileIdOrderByDateTimeAsc(Long doctorProfileId);

    // Знайти слоти лікаря за датою
    @Query("SELECT s FROM AppointmentSlot s WHERE s.doctorProfile.id = :doctorId " +
           "AND DATE(s.dateTime) = :date ORDER BY s.dateTime ASC")
    List<AppointmentSlot> findByDoctorProfileIdAndDate(
        @Param("doctorId") Long doctorProfileId,
        @Param("date") LocalDate date
    );

    // Знайти слоти в діапазоні дат
    List<AppointmentSlot> findByDoctorProfileIdAndDateTimeBetweenOrderByDateTimeAsc(
        Long doctorProfileId,
        LocalDateTime startDateTime,
        LocalDateTime endDateTime
    );

    // Перевірити, чи існує слот на цей час для лікаря
    boolean existsByDoctorProfileAndDateTime(DoctorProfile doctorProfile, LocalDateTime dateTime);

    // Видалити старі слоти (наприклад, слоти старші ніж сьогодні)
    void deleteByDateTimeBefore(LocalDateTime dateTime);
}
