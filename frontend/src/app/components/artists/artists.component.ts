import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Artist {
  id: number;
  artistName: string;
  bio: string;
  genre: string;
  profilePicture: string;
}

@Component({
  selector: 'app-artists',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.scss']
})
export class ArtistsComponent implements OnInit {
  artists: Artist[] = [];
  loading = true;
  error = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadArtists();
  }

  loadArtists(): void {
    this.http.get<Artist[]>('http://localhost:8081/api/artists')
      .subscribe({
        next: (data) => {
          const artistMap = new Map<string, Artist>();
          
          data.forEach(artist => {
            const key = artist.artistName.toLowerCase();
            if (!artistMap.has(key)) {
              artistMap.set(key, artist);
            }
          });
          
          this.artists = Array.from(artistMap.values())
            .sort((a, b) => a.artistName.localeCompare(b.artistName));
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load artists';
          this.loading = false;
          console.error('Error loading artists:', err);
        }
      });
  }

  viewArtist(artist: Artist): void {
    this.router.navigate(['/artists', encodeURIComponent(artist.artistName)]);
  }

  getArtistImage(profilePicture: string): string {
    if (!profilePicture) return 'https://via.placeholder.com/200?text=Artist';
    return `http://localhost:8081${profilePicture}`;
  }
}
