package com.example.app.controller;

import com.example.app.dto.SlotDto;
import com.example.app.service.AppointmentSlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/slots")
@RequiredArgsConstructor
public class AppointmentSlotController {

    private final AppointmentSlotService slotService;

    // Отримати доступні слоти для лікаря на конкретну дату
    @GetMapping("/doctor/{doctorId}/available")
    public ResponseEntity<List<SlotDto>> getAvailableSlots(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        List<SlotDto> slots = slotService.getAvailableSlotsForDoctor(doctorId, date);
        return ResponseEntity.ok(slots);
    }

    // Отримати всі доступні слоти лікаря на наступний тиждень
    @GetMapping("/doctor/{doctorId}/available/all")
    public ResponseEntity<List<SlotDto>> getAllAvailableSlots(@PathVariable Long doctorId) {
        LocalDate today = LocalDate.now();
        List<SlotDto> allSlots = new ArrayList<>();

        // Отримуємо слоти на наступні 7 днів
        for (int i = 0; i < 7; i++) {
            LocalDate date = today.plusDays(i);
            List<SlotDto> daySlots = slotService.getAvailableSlotsForDoctor(doctorId, date);
            allSlots.addAll(daySlots);
        }

        return ResponseEntity.ok(allSlots);
    }


    // Отримати всі слоти лікаря (для адмінів)
    @GetMapping("/doctor/{doctorId}/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SlotDto>> getAllSlots(@PathVariable Long doctorId) {
        List<SlotDto> slots = slotService.getAllSlotsForDoctor(doctorId);
        return ResponseEntity.ok(slots);
    }

    // Згенерувати тижневий розклад для лікаря
    @PostMapping("/doctor/{doctorId}/generate-weekly")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<Map<String, String>> generateWeeklySlots(@PathVariable Long doctorId) {
        slotService.generateWeeklySlotsForDoctor(doctorId);
        return ResponseEntity.ok(Map.of("message", "Тижневий розклад створено успішно"));
    }

    // AppointmentSlotController тепер працює тільки з розкладом!
    // Бронювання відбувається через AppointmentController

    // Очистити старі слоти (для адмінів)
    @DeleteMapping("/cleanup")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> cleanupOldSlots() {
        slotService.cleanupOldSlots();
        return ResponseEntity.ok(Map.of("message", "Старі слоти видалено"));
    }
}
