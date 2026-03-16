package com.revplay.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.revplay.dto.AuthRequest;
import com.revplay.model.User;
import com.revplay.repository.ArtistRepository;
import com.revplay.repository.UserRepository;
import com.revplay.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @MockBean
    private UserRepository userRepository;
    
    @MockBean
    private ArtistRepository artistRepository;
    
    @MockBean
    private PasswordEncoder passwordEncoder;
    
    @MockBean
    private JwtUtil jwtUtil;
    
    @Test
    void register_WithValidData_ShouldSucceed() throws Exception {
        AuthRequest request = new AuthRequest();
        request.setEmail("test@example.com");
        request.setUsername("testuser");
        request.setPassword("password123");
        
        when(userRepository.existsByEmail(any())).thenReturn(false);
        when(userRepository.existsByUsername(any())).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(i -> {
            User user = i.getArgument(0);
            user.setId(1L);
            return user;
        });
        when(jwtUtil.generateToken(any(), any())).thenReturn("test-token");
        
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.user.email").value("test@example.com"));
    }
    
    @Test
    void register_WithExistingEmail_ShouldFail() throws Exception {
        AuthRequest request = new AuthRequest();
        request.setEmail("existing@example.com");
        request.setUsername("testuser");
        request.setPassword("password123");
        
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);
        
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
    
    @Test
    void login_WithValidCredentials_ShouldSucceed() throws Exception {
        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");
        user.setUsername("testuser");
        user.setPassword("hashedPassword");
        user.setRole(User.Role.USER);
        
        AuthRequest request = new AuthRequest();
        request.setEmailOrUsername("testuser");
        request.setPassword("password123");
        
        when(userRepository.findByEmailOrUsername(any(), any())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(any(), any())).thenReturn(true);
        when(jwtUtil.generateToken(any(), any())).thenReturn("test-token");
        
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("test-token"));
    }
}
