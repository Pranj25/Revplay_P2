import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = 'http://localhost:8081/api/upload';
  private songApiUrl = 'http://localhost:8081/api/songs';
  
  constructor(private http: HttpClient) {}
  
  uploadAudio(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/audio`, formData);
  }
  
  uploadCover(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/cover`, formData);
  }
  
  uploadProfile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/profile`, formData);
  }

  uploadSongWithAlbumArtist(
    audioFile: File,
    title: string,
    albumName: string,
    artistName: string,
    genre: string,
    coverFile?: File | null
  ): Observable<any> {
    console.log('Starting upload...', {
      audioFile: audioFile.name,
      audioType: audioFile.type,
      audioSize: audioFile.size,
      coverFile: coverFile?.name
    });

    return this.uploadAudio(audioFile).pipe(
      switchMap((audioResponse: any) => {
        console.log('Audio uploaded:', audioResponse);
        if (coverFile) {
          return forkJoin({
            audio: of(audioResponse),
            cover: this.uploadCover(coverFile)
          });
        }
        return of({ audio: audioResponse, cover: null });
      }),
      switchMap((uploadResponses: any) => {
        console.log('Files uploaded:', uploadResponses);
        const songData: any = {
          title: title,
          albumName: albumName,
          artistName: artistName,
          genre: genre,
          audioFilePath: uploadResponses.audio.filePath,
          coverImage: uploadResponses.cover?.filePath || null
        };
        
        console.log('Creating song:', songData);
        return this.http.post(this.songApiUrl, songData);
      })
    );
  }

  uploadSong(
    audioFile: File,
    title: string,
    genre: string,
    duration: number,
    coverFile?: File | null,
    albumId?: number,
    artistId?: number
  ): Observable<any> {
    return this.uploadAudio(audioFile).pipe(
      switchMap((audioResponse: any) => {
        if (coverFile) {
          return forkJoin({
            audio: of(audioResponse),
            cover: this.uploadCover(coverFile)
          });
        }
        return of({ audio: audioResponse, cover: null });
      }),
      switchMap((uploadResponses: any) => {
        const songData: any = {
          title: title,
          genre: genre,
          duration: duration,
          audioFilePath: uploadResponses.audio.filePath,
          coverImage: uploadResponses.cover?.filePath || null
        };
        
        if (albumId) {
          songData.albumId = albumId;
        }
        
        if (artistId) {
          songData.artistId = artistId;
        }
        
        return this.http.post(this.songApiUrl, songData);
      })
    );
  }
}
