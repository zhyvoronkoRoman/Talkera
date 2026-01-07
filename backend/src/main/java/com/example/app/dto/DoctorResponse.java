package com.example.app.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class DoctorResponse {
    private Long id;
    private String name;        // З user.firstName
    private String surname;     // З user.lastName
    private String profession;  // З specialization
    private Boolean isAvailable;
    private String experience;
    private String image;       // З imagePath
    private String education;
    private Double price;
    private String about;       // З description
    
    // Тимчасово: слоти поки що будемо віддавати пустими або заглушкою, 
    // бо це окрема велика таблиця в базі
    private List<Object> slots; 
}