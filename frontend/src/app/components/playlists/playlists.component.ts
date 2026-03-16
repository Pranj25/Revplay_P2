import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Playlist {
  id: number;
  name: string;
  description: string;
  isPublic: boolean;
}

@Component({
  selector: 'app-playlists',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss']
})
export class PlaylistsComponent implements OnInit {
  playlists: Playlist[] = [];
  loading = true;
  showCreateModal = false;
  newPlaylistName = '';
  newPlaylistDescription = '';
  isPublic = false;
  
  constructor(private http: HttpClient) {}
  
  ngOnInit() {
    this.loadPlaylists();
  }
  
  loadPlaylists() {
    this.http.get<Playlist[]>('http://localhost:8081/api/playlists').subscribe({
      next: (data) => {
        this.playlists = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading playlists:', err);
        this.loading = false;
      }
    });
  }
  
  openCreateModal() {
    this.showCreateModal = true;
  }
  
  closeCreateModal() {
    this.showCreateModal = false;
    this.newPlaylistName = '';
    this.newPlaylistDescription = '';
    this.isPublic = false;
  }
  
  createPlaylist() {
    if (!this.newPlaylistName.trim()) return;
    
    const playlist = {
      name: this.newPlaylistName,
      description: this.newPlaylistDescription,
      isPublic: this.isPublic
    };
    
    this.http.post<Playlist>('http://localhost:8081/api/playlists', playlist).subscribe({
      next: (created) => {
        this.playlists.push(created);
        this.closeCreateModal();
      },
      error: (err) => console.error('Error creating playlist:', err)
    });
  }
}
