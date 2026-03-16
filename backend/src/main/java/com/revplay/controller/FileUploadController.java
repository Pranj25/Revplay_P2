package com.revplay.controller;

import com.revplay.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@Tag(name = "File Upload", description = "File upload endpoints")
public class FileUploadController {
    
    private final FileStorageService fileStorageService;
    
    public FileUploadController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }
    
    @PostMapping("/audio")
    @Operation(summary = "Upload audio file", description = "Upload MP3 audio file")
    public ResponseEntity<Map<String, String>> uploadAudio(@RequestParam("file") MultipartFile file) {
        try {
            String filePath = fileStorageService.storeAudioFile(file);
            Map<String, String> response = new HashMap<>();
            response.put("filePath", filePath);
            response.put("message", "Audio file uploaded successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/cover")
    @Operation(summary = "Upload cover image", description = "Upload album/song cover image")
    public ResponseEntity<Map<String, String>> uploadCover(@RequestParam("file") MultipartFile file) {
        try {
            String filePath = fileStorageService.storeCoverImage(file);
            Map<String, String> response = new HashMap<>();
            response.put("filePath", filePath);
            response.put("message", "Cover image uploaded successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/profile")
    @Operation(summary = "Upload profile image", description = "Upload user profile picture")
    public ResponseEntity<Map<String, String>> uploadProfile(@RequestParam("file") MultipartFile file) {
        try {
            String filePath = fileStorageService.storeProfileImage(file);
            Map<String, String> response = new HashMap<>();
            response.put("filePath", filePath);
            response.put("message", "Profile image uploaded successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
