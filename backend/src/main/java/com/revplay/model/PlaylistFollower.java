package com.revplay.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "playlist_followers", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "playlist_id"})
})
@Data
public class PlaylistFollower {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "playlist_id")
    private Playlist playlist;

    private LocalDateTime followedAt = LocalDateTime.now();
}
