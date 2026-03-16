import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PlayerService } from '../../services/player.service';
import { FavoriteService } from '../../services/favorite.service';
import { AuthService } from '../../services/auth.service';
import { Song } from '../../services/song.service';

interface Artist {
  id: number;
  artistName: string;
  bio: string;
  genre: string;
  profilePicture: string;
}

@Component({
  selector: 'app-artist-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './artist-detail.component.html',
  styleUrls: ['./artist-detail.component.scss']
})
export class ArtistDetailComponent implements OnInit {
  artist: Artist | null = null;
  songs: Song[] = [];
  loading = true;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private playerService: PlayerService,
    public favoriteService: FavoriteService,
    public authService: AuthService
  ) {}
  
  ngOnInit() {
    const artistName = this.route.snapshot.paramMap.get('name');
    if (artistName) {
      this.loadArtistSongs(decodeURIComponent(artistName));
    }
    if (this.authService.currentUser()) {
      this.favoriteService.getFavorites().subscribe();
    }
  }
  
  loadArtistSongs(artistName: string) {
    this.http.get<Song[]>('http://localhost:8081/api/songs').subscribe({
      next: (allSongs) => {
        this.songs = allSongs
          .filter(song => song.artist?.artistName.toLowerCase() === artistName.toLowerCase())
          .sort((a, b) => a.title.localeCompare(b.title));
        
        if (this.songs.length > 0 && this.songs[0].artist) {
          this.artist = this.songs[0].artist;
        }
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
  
  goBack() {
    this.router.navigate(['/artists']);
  }
}
