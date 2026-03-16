import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  constructor(public authService: AuthService) {}
  
  getMemberSince(): string {
    return new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  }
}
