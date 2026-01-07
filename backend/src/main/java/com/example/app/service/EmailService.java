package com.example.app.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.contact.recipient}")
    private String recipientEmail;

    @Value("${spring.mail.username}")
    private String senderEmail;

    public void sendContactMessage(String name, String userEmail, String message) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();

        // Відправник
        mailMessage.setFrom(senderEmail);

        // Одержувач
        mailMessage.setTo(recipientEmail);

        // Тема листа
        mailMessage.setSubject("Нове повідомлення з сайту Talkera");

        // Тіло листа
        String emailBody = String.format(
            "Нове повідомлення з форми зворотного зв'язку:\n\n" +
            "Від: %s (%s)\n\n" +
            "Повідомлення:\n%s\n\n" +
            "---\n" +
            "Це автоматичне повідомлення з сайту Talkera",
            name, userEmail, message
        );

        mailMessage.setText(emailBody);

        try {
            mailSender.send(mailMessage);
            System.out.println("Email успішно надіслано на " + recipientEmail);
        } catch (Exception e) {
            System.err.println("Помилка відправки email: " + e.getMessage());
            throw new RuntimeException("Не вдалося надіслати повідомлення", e);
        }
    }
}
