import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  email = '';
  username = '';
  password = '';
  gender = '';
  role = 'USER';
  successMessage = '';
  errorMessage = '';
  
  constructor(private authService: AuthService, private router: Router) {}
  
  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';
    
    this.authService.register({
      email: this.email,
      username: this.username,
      password: this.password,
      gender: this.gender,
      role: this.role
    }).subscribe({
      next: () => {
        this.successMessage = 'Registration successful! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        console.error('Registration error:', err);
        this.errorMessage = err.error?.message || err.error || 'Registration failed. Please try again.';
      }
    });
  }
}
