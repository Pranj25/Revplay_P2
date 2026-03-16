import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SongService, Song } from '../../services/song.service';
import { PlayerService } from '../../services/player.service';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  songs: Song[] = [];
  loading = true;
  
  constructor(
    public authService: AuthService,
    private songService: SongService,
    private playerService: PlayerService,
    public favoriteService: FavoriteService
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
        this.songs = songs.slice(0, 6);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading songs:', err);
        this.loading = false;
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
}
