import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PlayerService } from '../../services/player.service';
import { FavoriteService } from '../../services/favorite.service';
import { AuthService } from '../../services/auth.service';
import { Song } from '../../services/song.service';

interface Album {
  id: number;
  name: string;
  description: string;
  coverArt: string;
  releaseDate: string;
  artist: {
    id: number;
    artistName: string;
  };
}

@Component({
  selector: 'app-album-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.scss']
})
export class AlbumDetailComponent implements OnInit {
  album: Album | null = null;
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
    const albumName = this.route.snapshot.paramMap.get('name');
    if (albumName) {
      this.loadAlbumSongs(decodeURIComponent(albumName));
    }
    if (this.authService.currentUser()) {
      this.favoriteService.getFavorites().subscribe();
    }
  }
  
  loadAlbumSongs(albumName: string) {
    this.http.get<Song[]>('http://localhost:8081/api/songs').subscribe({
      next: (allSongs) => {
        this.songs = allSongs
          .filter(song => song.album?.name.toLowerCase() === albumName.toLowerCase())
          .sort((a, b) => a.title.localeCompare(b.title));
        
        if (this.songs.length > 0 && this.songs[0].album) {
          this.album = this.songs[0].album;
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
  
  getAlbumCover(): string {
    if (!this.album?.coverArt) return 'http://localhost:8081/images/default-cover.svg';
    return `http://localhost:8081${this.album.coverArt}`;
  }
  
  goBack() {
    this.router.navigate(['/albums']);
  }
}