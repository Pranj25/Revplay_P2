import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Song {
  id: number;
  title: string;
  genre: string;
  duration: number;
  audioFile: string;
  coverImage: string;
  visibility: string;
  playCount: number;
  artist: any;
  album: any;
}

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private apiUrl = 'http://localhost:8081/api/songs';
  
  constructor(private http: HttpClient) {}
  
  getAllSongs(): Observable<Song[]> {
    return this.http.get<Song[]>(this.apiUrl);
  }
  
  getSongById(id: number): Observable<Song> {
    return this.http.get<Song>(`${this.apiUrl}/${id}`);
  }
  
  createSong(song: any): Observable<Song> {
    return this.http.post<Song>(this.apiUrl, song);
  }
}
