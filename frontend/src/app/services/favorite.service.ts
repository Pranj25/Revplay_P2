import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Song } from './song.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private apiUrl = 'http://localhost:8081/api/favorites';
  favoriteSongIds = signal<Set<number>>(new Set());
  
  constructor(private http: HttpClient) {
    this.loadFavorites();
  }
  
  private loadFavorites() {
    this.getFavorites().subscribe({
      error: (err) => console.error('Error loading favorites:', err)
    });
  }
  
  getFavorites(): Observable<Song[]> {
    return this.http.get<Song[]>(this.apiUrl).pipe(
      tap(songs => {
        const ids = new Set(songs.map(s => s.id));
        this.favoriteSongIds.set(ids);
        console.log('Loaded favorites:', Array.from(ids));
      })
    );
  }
  
  addFavorite(songId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${songId}`, {}).pipe(
      tap({
        next: () => {
          this.favoriteSongIds.update(currentIds => {
            const newIds = new Set(currentIds);
            newIds.add(songId);
            console.log('Added to favorites:', songId, 'Total:', newIds.size);
            return newIds;
          });
        },
        error: (err) => console.error('Error adding favorite:', err)
      })
    );
  }
  
  removeFavorite(songId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${songId}`).pipe(
      tap({
        next: () => {
          this.favoriteSongIds.update(currentIds => {
            const newIds = new Set(currentIds);
            newIds.delete(songId);
            console.log('Removed from favorites:', songId, 'Total:', newIds.size);
            return newIds;
          });
        },
        error: (err) => console.error('Error removing favorite:', err)
      })
    );
  }
  
  isFavorite(songId: number): boolean {
    const result = this.favoriteSongIds().has(songId);
    return result;
  }
  
  toggleFavorite(songId: number): Observable<any> {
    const isFav = this.isFavorite(songId);
    console.log('Toggling favorite for song:', songId, 'Currently favorited:', isFav);
    
    if (isFav) {
      return this.removeFavorite(songId);
    } else {
      return this.addFavorite(songId);
    }
  }
}
