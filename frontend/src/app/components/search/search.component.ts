import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PlayerService } from '../../services/player.service';
import { FavoriteService } from '../../services/favorite.service';
import { AuthService } from '../../services/auth.service';
import { Song } from '../../services/song.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  searchQuery = '';
  songs: Song[] = [];
  allSongs: Song[] = [];
  loading = false;
  searched = false;
  
  constructor(
    private http: HttpClient,
    public playerService: PlayerService,
    public favoriteService: FavoriteService,
    public authService: AuthService
  ) {
    this.loadAllSongs();
  }
  
  loadAllSongs() {
    this.http.get<Song[]>('http://localhost:8081/api/songs').subscribe({
      next: (songs) => {
        this.allSongs = songs;
      },
      error: (err) => console.error('Error loading songs:', err)
    });
  }
  
  search() {
    if (!this.searchQuery.trim()) {
      this.songs = [];
      this.searched = false;
      return;
    }
    
    this.loading = true;
    this.searched = true;
    
    const query = this.searchQuery.toLowerCase();
    this.songs = this.allSongs.filter(song => 
      song.title.toLowerCase().includes(query) ||
      song.artist?.artistName.toLowerCase().includes(query) ||
      song.album?.name.toLowerCase().includes(query) ||
      song.genre.toLowerCase().includes(query)
    );
    
    this.loading = false;
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
