package com.revplay.controller;

import com.revplay.exception.ResourceNotFoundException;
import com.revplay.model.Album;
import com.revplay.model.Artist;
import com.revplay.model.Song;
import com.revplay.model.User;
import com.revplay.repository.AlbumRepository;
import com.revplay.repository.ArtistRepository;
import com.revplay.repository.SongRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/songs")
@Tag(name = "Songs", description = "Song management endpoints")
public class SongController {
    
    private final SongRepository songRepository;
    private final AlbumRepository albumRepository;
    private final ArtistRepository artistRepository;
    
    public SongController(SongRepository songRepository, AlbumRepository albumRepository, ArtistRepository artistRepository) {
        this.songRepository = songRepository;
        this.albumRepository = albumRepository;
        this.artistRepository = artistRepository;
    }
    
    @GetMapping
    @Operation(summary = "Get all public songs", description = "Retrieve all publicly visible songs")
    public ResponseEntity<List<Song>> getAllSongs() {
        List<Song> songs = songRepository.findByVisibility(Song.Visibility.PUBLIC);
        return ResponseEntity.ok(songs);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get song by ID", description = "Retrieve a specific song by its ID")
    public ResponseEntity<Song> getSongById(@PathVariable Long id) {
        Song song = songRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Song not found with id: " + id));
        return ResponseEntity.ok(song);
    }
    
    @PostMapping
    @Operation(summary = "Create new song", description = "Upload a new song with auto album/artist creation")
    public ResponseEntity<?> createSong(@RequestBody Map<String, Object> request, @RequestHeader("Authorization") String token) {
        try {
            String title = (String) request.get("title");
            String albumName = (String) request.get("albumName");
            String artistName = (String) request.get("artistName");
            String genre = (String) request.get("genre");
            String audioFilePath = (String) request.get("audioFilePath");
            String coverImageParam = (String) request.get("coverImage");
            Object userIdObj = request.get("userId");
            
            final String coverImage = (coverImageParam == null || coverImageParam.isEmpty()) 
                ? "/images/default-cover.svg" 
                : coverImageParam;
            
            Artist artist = artistRepository.findByArtistName(artistName)
                    .orElseGet(() -> {
                        Artist newArtist = new Artist();
                        newArtist.setArtistName(artistName);
                        newArtist.setGenre(genre);
                        return artistRepository.save(newArtist);
                    });
            
            Album album = albumRepository.findByNameAndArtist(albumName, artist)
                    .orElseGet(() -> {
                        Album newAlbum = new Album();
                        newAlbum.setName(albumName);
                        newAlbum.setArtist(artist);
                        newAlbum.setCoverArt(coverImage);
                        return albumRepository.save(newAlbum);
                    });
            
            Song song = new Song();
            song.setTitle(title);
            song.setGenre(genre);
            song.setAudioFile(audioFilePath);
            song.setCoverImage(coverImage);
            song.setArtist(artist);
            song.setAlbum(album);
            song.setDuration(0);
            
            if (userIdObj != null) {
                Long userId = userIdObj instanceof Integer ? ((Integer) userIdObj).longValue() : (Long) userIdObj;
                User uploader = new User();
                uploader.setId(userId);
                song.setUploadedBy(uploader);
            }
            
            Song savedSong = songRepository.save(song);
            return ResponseEntity.ok(savedSong);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to create song: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update song", description = "Update song details")
    public ResponseEntity<?> updateSong(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            Song song = songRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Song not found with id: " + id));
            
            if (request.containsKey("title")) {
                song.setTitle((String) request.get("title"));
            }
            if (request.containsKey("genre")) {
                song.setGenre((String) request.get("genre"));
            }
            if (request.containsKey("coverImage")) {
                song.setCoverImage((String) request.get("coverImage"));
            }
            
            if (request.containsKey("albumName") && request.containsKey("artistName")) {
                String albumName = (String) request.get("albumName");
                String artistName = (String) request.get("artistName");
                
                Artist artist = artistRepository.findByArtistName(artistName)
                        .orElseGet(() -> {
                            Artist newArtist = new Artist();
                            newArtist.setArtistName(artistName);
                            newArtist.setGenre(song.getGenre());
                            return artistRepository.save(newArtist);
                        });
                
                Album album = albumRepository.findByNameAndArtist(albumName, artist)
                        .orElseGet(() -> {
                            Album newAlbum = new Album();
                            newAlbum.setName(albumName);
                            newAlbum.setArtist(artist);
                            newAlbum.setCoverArt(song.getCoverImage());
                            return albumRepository.save(newAlbum);
                        });
                
                song.setArtist(artist);
                song.setAlbum(album);
            }
            
            song.setUpdatedAt(LocalDateTime.now());
            Song updatedSong = songRepository.save(song);
            return ResponseEntity.ok(updatedSong);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to update song: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete song", description = "Delete a song by ID")
    public ResponseEntity<?> deleteSong(@PathVariable Long id) {
        try {
            Song song = songRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Song not found with id: " + id));
            songRepository.delete(song);
            return ResponseEntity.ok(Map.of("message", "Song deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to delete song: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/play")
    @Operation(summary = "Increment play count", description = "Increment the play count for a song")
    public ResponseEntity<Void> incrementPlayCount(@PathVariable Long id) {
        Song song = songRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Song not found with id: " + id));
        song.setPlayCount(song.getPlayCount() + 1);
        songRepository.save(song);
        return ResponseEntity.ok().build();
    }
}
