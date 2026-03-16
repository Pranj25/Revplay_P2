import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: number;
  email: string;
  username: string;
  displayName?: string;
  gender?: string;
  profilePicture?: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api/auth';
  currentUser = signal<User | null>(null);
  
  constructor(private http: HttpClient, private router: Router) {
    this.loadUser();
  }
  
  register(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, data);
  }
  
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => this.handleAuth(response))
    );
  }
  
  logout() {
    localStorage.removeItem('token');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
  
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
  
  private handleAuth(response: AuthResponse) {
    localStorage.setItem('token', response.token);
    this.currentUser.set(response.user);
  }
  
  private loadUser() {
    const token = this.getToken();
    if (token) {
      // Load user from profile endpoint
    }
  }
}
