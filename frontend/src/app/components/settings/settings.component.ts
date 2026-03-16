import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  selectedTheme = 'purple';
  
  themes = [
    { id: 'purple', name: 'Purple', class: 'purple' },
    { id: 'blue', name: 'Blue', class: 'blue' },
    { id: 'green', name: 'Green', class: 'green' },
    { id: 'dark', name: 'Dark', class: 'dark' }
  ];
  
  selectTheme(themeId: string) {
    this.selectedTheme = themeId;
  }
}
