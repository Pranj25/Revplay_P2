package com.revplay.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import jakarta.annotation.PostConstruct;

@Service
public class FileStorageService {
    
    @Value("${upload.path:./uploads}")
    private String uploadPath;
    
    @Value("${spring.servlet.multipart.max-file-size:150MB}")
    private String maxFileSize;
    
    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(Paths.get(uploadPath, "songs"));
            Files.createDirectories(Paths.get(uploadPath, "covers"));
            Files.createDirectories(Paths.get(uploadPath, "profiles"));
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directories", e);
        }
    }
    
    public String storeAudioFile(MultipartFile file) throws IOException {
        validateAudioFile(file);
        return storeFile(file, "songs");
    }
    
    public String storeCoverImage(MultipartFile file) throws IOException {
        validateImageFile(file);
        return storeFile(file, "covers");
    }
    
    public String storeProfileImage(MultipartFile file) throws IOException {
        validateImageFile(file);
        return storeFile(file, "profiles");
    }
    
    private String storeFile(MultipartFile file, String folder) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String filename = UUID.randomUUID().toString() + extension;
        
        Path targetLocation = Paths.get(uploadPath, folder, filename);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        
        return "/uploads/" + folder + "/" + filename;
    }
    
    private void validateAudioFile(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null || !contentType.equals("audio/mpeg")) {
            throw new IllegalArgumentException("Only MP3 files are allowed");
        }
        
        // No size validation - Spring handles it via application.properties
    }
    
    private void validateImageFile(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equals("image/jpeg") && 
            !contentType.equals("image/png") && !contentType.equals("image/jpg"))) {
            throw new IllegalArgumentException("Only JPEG/PNG images are allowed");
        }
        
        // Limit image size to 10MB for performance
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("Image size must be less than 10MB");
        }
    }
}
