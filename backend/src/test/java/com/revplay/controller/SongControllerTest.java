package com.revplay.controller;

import com.revplay.model.Song;
import com.revplay.repository.SongRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class SongControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private SongRepository songRepository;
    
    private Song testSong;
    
    @BeforeEach
    void setUp() {
        testSong = new Song();
        testSong.setId(1L);
        testSong.setTitle("Test Song");
        testSong.setGenre("Rock");
        testSong.setDuration(180);
        testSong.setAudioFile("/songs/test.mp3");
        testSong.setVisibility(Song.Visibility.PUBLIC);
        testSong.setPlayCount(0);
    }
    
    @Test
    void getAllSongs_ShouldReturnSongList() throws Exception {
        when(songRepository.findByVisibility(Song.Visibility.PUBLIC))
                .thenReturn(Arrays.asList(testSong));
        
        mockMvc.perform(get("/api/songs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Test Song"))
                .andExpect(jsonPath("$[0].genre").value("Rock"));
    }
    
    @Test
    void getSongById_WhenExists_ShouldReturnSong() throws Exception {
        when(songRepository.findById(1L)).thenReturn(Optional.of(testSong));
        
        mockMvc.perform(get("/api/songs/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Song"));
    }
    
    @Test
    void getSongById_WhenNotExists_ShouldReturn404() throws Exception {
        when(songRepository.findById(999L)).thenReturn(Optional.empty());
        
        mockMvc.perform(get("/api/songs/999"))
                .andExpect(status().isNotFound());
    }
    
    @Test
    void incrementPlayCount_ShouldUpdateCount() throws Exception {
        when(songRepository.findById(1L)).thenReturn(Optional.of(testSong));
        when(songRepository.save(any(Song.class))).thenReturn(testSong);
        
        mockMvc.perform(put("/api/songs/1/play"))
                .andExpect(status().isOk());
    }
}
