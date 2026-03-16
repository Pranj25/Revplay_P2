import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-upload-song',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-song.component.html',
  styleUrls: ['./upload-song.component.scss']
})
export class UploadSongComponent {
  title = '';
  albumName = '';
  artistName = '';
  selectedGenres: string[] = [];
  audioFile: File | null = null;
  coverFile: File | null = null;
  uploading = false;
  successMessage = '';
  errorMessage = '';
  
  availableGenres = [
    'Action', 'Bollywood', 'Chill', 'Classical',
    'Comedy', 'Country', 'Devotional', 'Drama',
    'Electronic', 'Fantasy', 'Fiction', 'Hip Hop',
    'Horror', 'Indie', 'Jazz', 'Party',
    'Pop', 'R&B', 'Rock', 'Romantic',
    'Sad', 'Workout', 'Other'
  ];

  constructor(
    public authService: AuthService,
    private uploadService: UploadService,
    private http: HttpClient,
    private router: Router
  ) {
    if (!this.isArtist()) {
      this.router.navigate(['/']);
    }
  }

  isArtist(): boolean {
    const user = this.authService.currentUser();
    return user?.role === 'ARTIST';
  }

  toggleGenre(genre: string) {
    const index = this.selectedGenres.indexOf(genre);
    if (index > -1) {
      this.selectedGenres.splice(index, 1);
    } else {
      this.selectedGenres.push(genre);
    }
  }

  isGenreSelected(genre: string): boolean {
    return this.selectedGenres.includes(genre);
  }

  removeGenre(genre: string) {
    const index = this.selectedGenres.indexOf(genre);
    if (index > -1) {
      this.selectedGenres.splice(index, 1);
    }
  }

  onAudioFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'audio/mpeg') {
      this.audioFile = file;
      this.errorMessage = '';
    } else {
      this.errorMessage = 'Please select a valid MP3 file';
    }
  }

  onCoverFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.coverFile = file;
    } else {
      this.errorMessage = 'Please select a valid image file';
    }
  }

  cancel() {
    this.router.navigate(['/songs']);
  }

  onSubmit() {
    if (!this.audioFile) {
      this.errorMessage = 'Please select an audio file';
      return;
    }

    if (this.selectedGenres.length === 0) {
      this.errorMessage = 'Please select at least one genre';
      return;
    }

    console.log('Form submitted:', {
      title: this.title,
      albumName: this.albumName,
      artistName: this.artistName,
      genres: this.selectedGenres,
      audioFile: this.audioFile.name,
      audioType: this.audioFile.type,
      audioSize: this.audioFile.size,
      coverFile: this.coverFile?.name
    });

    this.uploading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const genreString = this.selectedGenres.join(', ');

    this.uploadService.uploadSongWithAlbumArtist(
      this.audioFile,
      this.title,
      this.albumName,
      this.artistName,
      genreString,
      this.coverFile
    ).subscribe({
      next: (response) => {
        console.log('Upload successful:', response);
        this.successMessage = 'Song uploaded successfully!';
        this.uploading = false;
        setTimeout(() => {
          this.router.navigate(['/songs']);
        }, 2000);
      },
      error: (err) => {
        console.error('Upload error:', err);
        console.error('Error details:', {
          status: err.status,
          statusText: err.statusText,
          error: err.error,
          message: err.message
        });
        this.errorMessage = err.error?.error || err.error?.message || err.message || 'Upload failed. Please try again.';
        this.uploading = false;
      }
    });
  }
}
