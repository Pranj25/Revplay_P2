package com.revplay.controller;

import com.revplay.model.Album;
import com.revplay.repository.AlbumRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/albums")
public class AlbumController {
    
    private final AlbumRepository albumRepository;
    
    public AlbumController(AlbumRepository albumRepository) {
        this.albumRepository = albumRepository;
    }
    
    @GetMapping
    public ResponseEntity<List<Album>> getAllAlbums() {
        return ResponseEntity.ok(albumRepository.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Album> getAlbumById(@PathVariable Long id) {
        return albumRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Album> createAlbum(@RequestBody Album album) {
        Album savedAlbum = albumRepository.save(album);
        return ResponseEntity.ok(savedAlbum);
    }
}
