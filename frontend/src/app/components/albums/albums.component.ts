import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
  selector: 'app-albums',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss']
})
export class AlbumsComponent implements OnInit {
  albums: Album[] = [];
  loading = true;
  error = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAlbums();
  }

  loadAlbums(): void {
    this.http.get<Album[]>('http://localhost:8081/api/albums')
      .subscribe({
        next: (data) => {
          const albumMap = new Map<string, Album>();
          
          data.forEach(album => {
            const key = album.name.toLowerCase();
            if (!albumMap.has(key)) {
              albumMap.set(key, album);
            }
          });
          
          this.albums = Array.from(albumMap.values())
            .sort((a, b) => a.name.localeCompare(b.name));
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load albums';
          this.loading = false;
          console.error('Error loading albums:', err);
        }
      });
  }

  viewAlbum(album: Album): void {
    this.router.navigate(['/albums', encodeURIComponent(album.name)]);
  }

  getAlbumCover(coverArt: string): string {
    if (!coverArt) return 'http://localhost:8081/images/default-cover.svg';
    return `http://localhost:8081${coverArt}`;
  }
}
