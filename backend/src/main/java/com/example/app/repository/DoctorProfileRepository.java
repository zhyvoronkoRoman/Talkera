package com.example.app.repository;

import com.example.app.model.DoctorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorProfileRepository extends JpaRepository<DoctorProfile, Long> {
    // Знайти всіх лікарів, які доступні
    List<DoctorProfile> findByIsAvailableTrue();
}