package com.example.app.service;

import com.example.app.dto.SlotDto;
import com.example.app.model.Appointment;
import com.example.app.model.AppointmentSlot;
import com.example.app.model.AppointmentStatus;
import com.example.app.model.DoctorProfile;
import com.example.app.repository.AppointmentSlotRepository;
import com.example.app.repository.AppointmentRepository;
import com.example.app.repository.DoctorProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentSlotService {

    private final AppointmentSlotRepository slotRepository;
    private final AppointmentRepository appointmentRepository;
    private final DoctorProfileRepository doctorRepository;

    // Отримати всі доступні слоти для лікаря на конкретну дату
    // (ті, що існують в slots і не мають активних appointment)
    public List<SlotDto> getAvailableSlotsForDoctor(Long doctorId, LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

        // Отримуємо лікаря для перевірки бронювань
        DoctorProfile doctor = doctorRepository.findById(doctorId)
            .orElseThrow(() -> new RuntimeException("Лікар не знайдений"));

        List<AppointmentSlot> allSlots = slotRepository
            .findByDoctorProfileIdAndDateTimeBetweenOrderByDateTimeAsc(
                doctorId, startOfDay, endOfDay
            );

        // Фільтруємо тільки ті слоти, що не мають активних бронювань (тільки BOOKED)
        List<AppointmentSlot> availableSlots = allSlots.stream()
            .filter(slot -> {
                // Перевіряємо, чи є активне бронювання (BOOKED) на цей час
                List<Appointment> appointments = appointmentRepository
                    .findByDoctorAndDateTime(doctor, slot.getDateTime());
                // Слот доступний, якщо немає BOOKED записів на цей час
                return appointments.stream()
                    .noneMatch(appointment -> appointment.getStatus() == AppointmentStatus.BOOKED);
            })
            .collect(Collectors.toList());

        return availableSlots.stream()
            .map(SlotDto::new)
            .collect(Collectors.toList());
    }

    // Отримати всі слоти лікаря (розклад)
    public List<SlotDto> getAllSlotsForDoctor(Long doctorId) {
        List<AppointmentSlot> slots = slotRepository
            .findByDoctorProfileIdOrderByDateTimeAsc(doctorId);

        return slots.stream()
            .map(SlotDto::new)
            .collect(Collectors.toList());
    }

    // Отримати всі доступні слоти лікаря (майбутні дати)
    public List<SlotDto> getAllAvailableSlotsForDoctor(Long doctorId) {
        LocalDateTime now = LocalDateTime.now();

        // Знаходимо всі слоти лікаря (включаючи майбутні)
        List<AppointmentSlot> allSlots = slotRepository
            .findByDoctorProfileIdOrderByDateTimeAsc(doctorId);

        // Фільтруємо тільки майбутні слоти, що не мають активних бронювань (тільки BOOKED)
        List<AppointmentSlot> availableSlots = allSlots.stream()
            .filter(slot -> slot.getDateTime().isAfter(now))
            .filter(slot -> {
                // Перевіряємо, чи є активне бронювання (BOOKED) на цей час
                List<Appointment> appointments = appointmentRepository.findByDoctorIdAndDateTimeBetween(
                    doctorId, slot.getDateTime(), slot.getDateTime());
                return appointments.stream()
                    .noneMatch(appointment -> appointment.getStatus() == AppointmentStatus.BOOKED);
            })
            .collect(Collectors.toList());

        return availableSlots.stream()
            .map(SlotDto::new)
            .collect(Collectors.toList());
    }

    // Створити слоти для лікаря на тиждень вперед
    @Transactional
    public void generateWeeklySlotsForDoctor(Long doctorId) {
        DoctorProfile doctor = doctorRepository.findById(doctorId)
            .orElseThrow(() -> new RuntimeException("Лікар не знайдений"));

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime weekFromNow = now.plusWeeks(1);

        // Створюємо слоти з 9:00 до 17:00, щодня, крім вихідних
        LocalDateTime current = now.toLocalDate().atTime(9, 0);

        while (current.isBefore(weekFromNow)) {
            // Пропускаємо вихідні (субота = 6, неділя = 7)
            if (current.getDayOfWeek().getValue() < 6) {
                // Створюємо слоти кожні 30 хвилин до 17:00
                LocalDateTime slotTime = current;
                while (slotTime.getHour() < 17) {
                    if (!slotRepository.existsByDoctorProfileAndDateTime(doctor, slotTime)) {
                        AppointmentSlot slot = new AppointmentSlot(doctor, slotTime);
                        slotRepository.save(slot);
                    }
                    slotTime = slotTime.plusMinutes(30);
                }
            }
            current = current.plusDays(1).toLocalDate().atTime(9, 0);
        }
    }

    // AppointmentSlotService тепер працює тільки з розкладом!
    // Бронювання відбувається через AppointmentService

    // Видалити старі слоти
    @Transactional
    public void cleanupOldSlots() {
        LocalDateTime yesterday = LocalDateTime.now().minusDays(1);
        slotRepository.deleteByDateTimeBefore(yesterday);
    }
}
