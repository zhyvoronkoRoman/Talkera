package com.example.app.dto;

import com.example.app.model.AppointmentSlot;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data // Lombok генерує геттери, сеттери, toString
@NoArgsConstructor
@AllArgsConstructor
public class SlotDto {

    private Long id;
    private Long doctorId;
    private String doctorName;
    private LocalDateTime dateTime;
    private Integer durationMinutes;

    // Конструктор для відповіді з Entity
    public SlotDto(AppointmentSlot slot) {
        this.id = slot.getId();
        this.doctorId = slot.getDoctorProfile().getId();
        this.doctorName = slot.getDoctorProfile().getUser().getFirstName() + " " +
                         slot.getDoctorProfile().getUser().getLastName();
        this.dateTime = slot.getDateTime();
        this.durationMinutes = slot.getDurationMinutes();
        // isAvailable і patientId більше не потрібні - перевіряємо через appointments
    }
}
