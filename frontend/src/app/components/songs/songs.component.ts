import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongService, Song } from '../../services/song.service';
import { PlayerService } from '../../services/player.service';
import { FavoriteService } from '../../services/favorite.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-songs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss']
})
export class SongsComponent implements OnInit {
  songs: Song[] = [];
  loading = true;
  error = '';
  
  constructor(
    private songService: SongService,
    private playerService: PlayerService,
    public favoriteService: FavoriteService,
    public authService: AuthService
  ) {}
  
  ngOnInit() {
    this.loadSongs();
    if (this.authService.currentUser()) {
      this.favoriteService.getFavorites().subscribe();
    }
  }
  
  loadSongs() {
    this.songService.getAllSongs().subscribe({
      next: (songs) => {
        this.songs = songs;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load songs';
        this.loading = false;
        console.error('Error loading songs:', err);
      }
    });
  }
  
  playSong(song: Song) {
    this.playerService.playSong(song, this.songs);
  }
  
  toggleFavorite(event: Event, songId: number) {
    event.stopPropagation();
    if (!this.authService.currentUser()) {
      alert('Please login to add favorites');
      return;
    }
    this.favoriteService.toggleFavorite(songId).subscribe({
      error: (err) => console.error('Error toggling favorite:', err)
    });
  }
  
  getSongCover(song: Song): string {
    return song.coverImage 
      ? `http://localhost:8081${song.coverImage}`
      : 'http://localhost:8081/images/default-cover.svg';
  }
  
  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
