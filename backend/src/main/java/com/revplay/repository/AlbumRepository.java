package com.revplay.repository;

import com.revplay.model.Album;
import com.revplay.model.Artist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AlbumRepository extends JpaRepository<Album, Long> {
    List<Album> findByArtistId(Long artistId);
    Optional<Album> findByNameAndArtist(String name, Artist artist);
}
