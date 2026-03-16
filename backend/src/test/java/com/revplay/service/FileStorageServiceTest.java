package com.revplay.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

class FileStorageServiceTest {
    
    private FileStorageService fileStorageService;
    
    @TempDir
    Path tempDir;
    
    @BeforeEach
    void setUp() {
        fileStorageService = new FileStorageService();
        ReflectionTestUtils.setField(fileStorageService, "uploadPath", tempDir.toString());
    }
    
    @Test
    void storeAudioFile_WithValidMP3_ShouldSucceed() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "test.mp3",
            "audio/mpeg",
            "test audio content".getBytes()
        );
        
        String filePath = fileStorageService.storeAudioFile(file);
        
        assertNotNull(filePath);
        assertTrue(filePath.contains("/songs/"));
        assertTrue(filePath.endsWith(".mp3"));
    }
    
    @Test
    void storeAudioFile_WithInvalidType_ShouldThrowException() {
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "test.txt",
            "text/plain",
            "test content".getBytes()
        );
        
        assertThrows(IllegalArgumentException.class, () -> {
            fileStorageService.storeAudioFile(file);
        });
    }
    
    @Test
    void storeCoverImage_WithValidImage_ShouldSucceed() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "cover.jpg",
            "image/jpeg",
            "test image content".getBytes()
        );
        
        String filePath = fileStorageService.storeCoverImage(file);
        
        assertNotNull(filePath);
        assertTrue(filePath.contains("/covers/"));
    }
}
