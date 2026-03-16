package com.revplay.repository;

import com.revplay.model.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SongRepository extends JpaRepository<Song, Long> {
    List<Song> findByArtistId(Long artistId);
    List<Song> findByAlbumId(Long albumId);
    List<Song> findByVisibility(Song.Visibility visibility);
}
