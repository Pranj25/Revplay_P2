import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { PlayerService } from '../../services/player.service';
import { Song } from '../../services/song.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  songs: Song[] = [];
  loading = true;
  error = '';

  constructor(
    private http: HttpClient,
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.http.get<Song[]>('http://localhost:8081/api/history')
      .subscribe({
        next: (data) => {
          this.songs = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load history';
          this.loading = false;
          console.error('Error loading history:', err);
        }
      });
  }

  playSong(song: Song): void {
    this.playerService.playSong(song, this.songs);
  }

  clearHistory(): void {
    if (confirm('Are you sure you want to clear your listening history?')) {
      this.http.delete('http://localhost:8081/api/history')
        .subscribe({
          next: () => {
            this.songs = [];
          },
          error: (err) => {
            console.error('Error clearing history:', err);
          }
        });
    }
  }

  getSongCover(song: Song): string {
    return song.coverImage 
      ? `http://localhost:8081${song.coverImage}`
      : 'http://localhost:8081/images/default-cover.svg';
  }
}
