package com.example.app.service;

import com.example.app.dto.DoctorResponse;
import com.example.app.model.DoctorProfile;
import com.example.app.repository.DoctorProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorProfileRepository repository;

    // Отримати всіх
    public List<DoctorResponse> getAllDoctors() {
        return repository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Отримати одного
    public DoctorResponse getDoctorById(Long id) {
        DoctorProfile doc = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Лікаря не знайдено"));
        return mapToDTO(doc);
    }

    // Мапер: перекладає з мови Бази на мову Фронтенду
    private DoctorResponse mapToDTO(DoctorProfile doc) {
        return DoctorResponse.builder()
                .id(doc.getId())
                .name(doc.getUser().getFirstName()) // Беремо з таблиці юзерів
                .surname(doc.getUser().getLastName())
                .profession(doc.getSpecialization())
                .isAvailable(doc.getIsAvailable())
                .experience(doc.getExperience())
                .image(doc.getImagePath()) 
                .education(doc.getEducation())
                .price(doc.getPrice())
                .about(doc.getDescription())
                .build();
    }
}