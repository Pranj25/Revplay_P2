package com.revplay.controller;

import com.revplay.model.Favorite;
import com.revplay.model.Song;
import com.revplay.model.User;
import com.revplay.repository.FavoriteRepository;
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
@RequestMapping("/api/favorites")
@Tag(name = "Favorites", description = "Favorite songs management")
public class FavoriteController {
    
    private final FavoriteRepository favoriteRepository;
    private final SongRepository songRepository;
    private final UserRepository userRepository;
    
    public FavoriteController(FavoriteRepository favoriteRepository, 
                            SongRepository songRepository,
                            UserRepository userRepository) {
        this.favoriteRepository = favoriteRepository;
        this.songRepository = songRepository;
        this.userRepository = userRepository;
    }
    
    @GetMapping
    @Operation(summary = "Get user favorites", description = "Get all favorite songs for current user")
    public ResponseEntity<List<Song>> getUserFavorites(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        List<Favorite> favorites = favoriteRepository.findByUserId(userId);
        List<Song> songs = favorites.stream()
                .map(Favorite::getSong)
                .collect(Collectors.toList());
        return ResponseEntity.ok(songs);
    }
    
    @PostMapping("/{songId}")
    @Operation(summary = "Add to favorites", description = "Add a song to user's favorites")
    public ResponseEntity<?> addFavorite(@PathVariable Long songId, Authentication authentication) {
        try {
            Long userId = Long.parseLong(authentication.getName());
            User user = userRepository.findById(userId).orElseThrow();
            Song song = songRepository.findById(songId).orElseThrow();
            
            if (favoriteRepository.findByUserIdAndSongId(userId, songId).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Song already in favorites"));
            }
            
            Favorite favorite = new Favorite();
            favorite.setUser(user);
            favorite.setSong(song);
            favoriteRepository.save(favorite);
            
            return ResponseEntity.ok(Map.of("message", "Added to favorites"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to add favorite: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{songId}")
    @Operation(summary = "Remove from favorites", description = "Remove a song from user's favorites")
    public ResponseEntity<?> removeFavorite(@PathVariable Long songId, Authentication authentication) {
        try {
            Long userId = Long.parseLong(authentication.getName());
            Favorite favorite = favoriteRepository.findByUserIdAndSongId(userId, songId)
                    .orElseThrow(() -> new RuntimeException("Favorite not found"));
            favoriteRepository.delete(favorite);
            return ResponseEntity.ok(Map.of("message", "Removed from favorites"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to remove favorite: " + e.getMessage()));
        }
    }
    
    @GetMapping("/check/{songId}")
    @Operation(summary = "Check if favorited", description = "Check if a song is in user's favorites")
    public ResponseEntity<Map<String, Boolean>> checkFavorite(@PathVariable Long songId, Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        boolean isFavorite = favoriteRepository.findByUserIdAndSongId(userId, songId).isPresent();
        return ResponseEntity.ok(Map.of("isFavorite", isFavorite));
    }
}
