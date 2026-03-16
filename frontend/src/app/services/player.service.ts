import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Song } from './song.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private audio: HTMLAudioElement;
  private apiUrl = 'http://localhost:8081/api';
  private lastTrackedSongId: number | null = null;
  private queue: Song[] = [];
  private currentIndex: number = -1;
  
  currentSong = signal<Song | null>(null);
  isPlaying = signal<boolean>(false);
  currentTime = signal<number>(0);
  duration = signal<number>(0);
  volume = signal<number>(1);
  
  constructor(private http: HttpClient) {
    this.audio = new Audio();
    this.setupAudioListeners();
  }
  
  private setupAudioListeners() {
    this.audio.addEventListener('timeupdate', () => {
      this.currentTime.set(this.audio.currentTime);
    });
    
    this.audio.addEventListener('loadedmetadata', () => {
      this.duration.set(this.audio.duration);
    });
    
    this.audio.addEventListener('ended', () => {
      this.isPlaying.set(false);
      this.playNext();
    });
  }
  
  playSong(song: Song, queue: Song[] = []) {
    const baseUrl = 'http://localhost:8081';
    this.audio.src = baseUrl + song.audioFile;
    this.currentSong.set(song);
    this.audio.play();
    this.isPlaying.set(true);
    
    if (queue.length > 0) {
      this.queue = queue;
      this.currentIndex = queue.findIndex(s => s.id === song.id);
    } else if (this.queue.length === 0) {
      this.queue = [song];
      this.currentIndex = 0;
    }
    
    if (song.id && song.id !== this.lastTrackedSongId) {
      this.lastTrackedSongId = song.id;
      this.addToHistory(song.id);
      this.incrementPlayCount(song.id);
    }
  }
  
  playNext() {
    if (this.queue.length === 0) return;
    
    const nextIndex = (this.currentIndex + 1) % this.queue.length;
    if (nextIndex < this.queue.length) {
      this.currentIndex = nextIndex;
      this.playSong(this.queue[this.currentIndex], this.queue);
    }
  }
  
  playPrevious() {
    if (this.queue.length === 0) return;
    
    const prevIndex = this.currentIndex - 1;
    if (prevIndex >= 0) {
      this.currentIndex = prevIndex;
      this.playSong(this.queue[this.currentIndex], this.queue);
    } else {
      this.currentIndex = this.queue.length - 1;
      this.playSong(this.queue[this.currentIndex], this.queue);
    }
  }
  
  hasNext(): boolean {
    return this.queue.length > 0 && this.currentIndex < this.queue.length - 1;
  }
  
  hasPrevious(): boolean {
    return this.queue.length > 0 && this.currentIndex > 0;
  }
  
  togglePlayPause() {
    if (this.isPlaying()) {
      this.audio.pause();
      this.isPlaying.set(false);
    } else {
      this.audio.play();
      this.isPlaying.set(true);
    }
  }
  
  seek(time: number) {
    this.audio.currentTime = time;
  }
  
  setVolume(volume: number) {
    this.audio.volume = volume;
    this.volume.set(volume);
  }
  
  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.isPlaying.set(false);
  }
  
  private addToHistory(songId: number) {
    this.http.post(`${this.apiUrl}/history/${songId}`, {}).subscribe({
      next: () => console.log('Added to history'),
      error: (err) => console.error('Failed to add to history:', err)
    });
  }
  
  private incrementPlayCount(songId: number) {
    this.http.put(`${this.apiUrl}/songs/${songId}/play`, {}).subscribe({
      next: () => console.log('Play count incremented'),
      error: (err) => console.error('Failed to increment play count:', err)
    });
  }
}
