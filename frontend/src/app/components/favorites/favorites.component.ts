import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoriteService } from '../../services/favorite.service';
import { PlayerService } from '../../services/player.service';
import { Song } from '../../services/song.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  songs: Song[] = [];
  loading = true;
  
  constructor(
    public favoriteService: FavoriteService,
    public playerService: PlayerService
  ) {}
  
  ngOnInit() {
    this.loadFavorites();
  }
  
  loadFavorites() {
    this.favoriteService.getFavorites().subscribe({
      next: (songs) => {
        this.songs = songs;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading favorites:', err);
        this.loading = false;
      }
    });
  }
  
  playSong(song: Song) {
    this.playerService.playSong(song, this.songs);
  }
  
  removeFavorite(event: Event, songId: number) {
    event.stopPropagation();
    this.favoriteService.removeFavorite(songId).subscribe({
      next: () => {
        this.songs = this.songs.filter(s => s.id !== songId);
      },
      error: (err) => console.error('Error removing favorite:', err)
    });
  }
  
  getSongCover(song: Song): string {
    return song.coverImage 
      ? `http://localhost:8081${song.coverImage}`
      : 'http://localhost:8081/images/default-cover.svg';
  }
}
