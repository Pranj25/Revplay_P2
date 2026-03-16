package com.revplay.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {
    
    private JwtUtil jwtUtil;
    
    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret", "test_secret_key_for_testing_purposes_only");
        ReflectionTestUtils.setField(jwtUtil, "expiration", 3600000L);
    }
    
    @Test
    void generateToken_ShouldCreateValidToken() {
        String token = jwtUtil.generateToken(1L, "USER");
        
        assertNotNull(token);
        assertTrue(token.length() > 0);
    }
    
    @Test
    void validateToken_WithValidToken_ShouldReturnTrue() {
        String token = jwtUtil.generateToken(1L, "USER");
        
        boolean isValid = jwtUtil.validateToken(token);
        
        assertTrue(isValid);
    }
    
    @Test
    void validateToken_WithInvalidToken_ShouldReturnFalse() {
        boolean isValid = jwtUtil.validateToken("invalid.token.here");
        
        assertFalse(isValid);
    }
    
    @Test
    void getUserIdFromToken_ShouldExtractCorrectId() {
        Long userId = 123L;
        String token = jwtUtil.generateToken(userId, "USER");
        
        Long extractedId = jwtUtil.getUserIdFromToken(token);
        
        assertEquals(userId, extractedId);
    }
}
