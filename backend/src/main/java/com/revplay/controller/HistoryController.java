package com.revplay.controller;

import com.revplay.model.ListeningHistory;
import com.revplay.model.Song;
import com.revplay.model.User;
import com.revplay.repository.ListeningHistoryRepository;
import com.revplay.repository.SongRepository;
import com.revplay.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/history")
@Tag(name = "Listening History", description = "User listening history management")
public class HistoryController {
    
    private final ListeningHistoryRepository historyRepository;
    private final SongRepository songRepository;
    private final UserRepository userRepository;
    
    public HistoryController(ListeningHistoryRepository historyRepository,
                           SongRepository songRepository,
                           UserRepository userRepository) {
        this.historyRepository = historyRepository;
        this.songRepository = songRepository;
        this.userRepository = userRepository;
    }
    
    @GetMapping
    @Operation(summary = "Get user history", description = "Get listening history for current user")
    public ResponseEntity<List<Song>> getUserHistory(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        List<ListeningHistory> history = historyRepository.findTop50ByUserIdOrderByPlayedAtDesc(userId);
        List<Song> songs = history.stream()
                .map(ListeningHistory::getSong)
                .distinct()
                .collect(Collectors.toList());
        return ResponseEntity.ok(songs);
    }
    
    @PostMapping("/{songId}")
    @Operation(summary = "Add to history", description = "Record a song play in user's history")
    public ResponseEntity<?> addToHistory(@PathVariable Long songId, Authentication authentication) {
        try {
            Long userId = Long.parseLong(authentication.getName());
            User user = userRepository.findById(userId).orElseThrow();
            Song song = songRepository.findById(songId).orElseThrow();
            
            ListeningHistory history = new ListeningHistory();
            history.setUser(user);
            history.setSong(song);
            historyRepository.save(history);
            
            return ResponseEntity.ok(Map.of("message", "Added to history"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to add to history: " + e.getMessage()));
        }
    }
    
    @DeleteMapping
    @Operation(summary = "Clear history", description = "Clear all listening history for current user")
    public ResponseEntity<?> clearHistory(Authentication authentication) {
        try {
            Long userId = Long.parseLong(authentication.getName());
            List<ListeningHistory> history = historyRepository.findByUserIdOrderByPlayedAtDesc(userId);
            historyRepository.deleteAll(history);
            return ResponseEntity.ok(Map.of("message", "History cleared"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to clear history: " + e.getMessage()));
        }
    }
}
