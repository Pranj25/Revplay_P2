import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../services/player.service';
import { FavoriteService } from '../../services/favorite.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent {
  constructor(
    public playerService: PlayerService,
    public favoriteService: FavoriteService,
    public authService: AuthService
  ) {}
  
  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  
  onSeek(event: any) {
    this.playerService.seek(event.target.value);
  }
  
  onVolumeChange(event: any) {
    this.playerService.setVolume(event.target.value);
  }
  
  toggleFavorite() {
    if (!this.authService.currentUser()) {
      alert('Please login to add favorites');
      return;
    }
    const song = this.playerService.currentSong();
    if (song && song.id) {
      this.favoriteService.toggleFavorite(song.id).subscribe({
        error: (err) => console.error('Error toggling favorite:', err)
      });
    }
  }
  
  isFavorite(): boolean {
    const song = this.playerService.currentSong();
    return song ? this.favoriteService.isFavorite(song.id) : false;
  }
}
