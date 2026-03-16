import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PlayerService } from '../../services/player.service';
import { Song } from '../../services/song.service';

interface Playlist {
  id: number;
  name: string;
  description: string;
  isPublic: boolean;
  songs: Song[];
}

@Component({
  selector: 'app-playlist-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './playlist-detail.component.html',
  styleUrls: ['./playlist-detail.component.scss']
})
export class PlaylistDetailComponent implements OnInit {
  playlist: Playlist | null = null;
  allSongs: Song[] = [];
  loading = true;
  showAddSongModal = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private playerService: PlayerService
  ) {}
  
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPlaylist(+id);
      this.loadAllSongs();
    }
  }
  
  loadPlaylist(id: number) {
    this.http.get<Playlist>(`http://localhost:8081/api/playlists/${id}`).subscribe({
      next: (data) => {
        this.playlist = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading playlist:', err);
        this.loading = false;
      }
    });
  }
  
  loadAllSongs() {
    this.http.get<Song[]>('http://localhost:8081/api/songs').subscribe({
      next: (songs) => {
        this.allSongs = songs;
      },
      error: (err) => console.error('Error loading songs:', err)
    });
  }
  
  playSong(song: Song) {
    if (this.playlist?.songs) {
      this.playerService.playSong(song, this.playlist.songs);
    } else {
      this.playerService.playSong(song);
    }
  }
  
  openAddSongModal() {
    this.showAddSongModal = true;
  }
  
  closeAddSongModal() {
    this.showAddSongModal = false;
  }
  
  addSongToPlaylist(songId: number) {
    if (!this.playlist) return;
    
    this.http.post(`http://localhost:8081/api/playlists/${this.playlist.id}/songs/${songId}`, {}).subscribe({
      next: () => {
        this.loadPlaylist(this.playlist!.id);
        this.closeAddSongModal();
      },
      error: (err) => console.error('Error adding song:', err)
    });
  }
  
  removeSongFromPlaylist(songId: number) {
    if (!this.playlist) return;
    
    if (confirm('Remove this song from playlist?')) {
      this.http.delete(`http://localhost:8081/api/playlists/${this.playlist.id}/songs/${songId}`).subscribe({
        next: () => {
          this.loadPlaylist(this.playlist!.id);
        },
        error: (err) => console.error('Error removing song:', err)
      });
    }
  }
  
  isSongInPlaylist(songId: number): boolean {
    return this.playlist?.songs?.some(s => s.id === songId) || false;
  }
  
  getSongCover(song: Song): string {
    return song.coverImage 
      ? `http://localhost:8081${song.coverImage}`
      : 'http://localhost:8081/images/default-cover.svg';
  }
  
  goBack() {
    this.router.navigate(['/playlists']);
  }
}
