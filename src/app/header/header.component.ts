import { Component } from '@angular/core';
import { User } from '../Models/user.model';
import { AuthService } from '../auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GlobalStateService } from '../Services/global-state.service';

@Component({
  selector: 'app-header',
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {
  loggedInUser: User | null = null; // Store logged-in user's name
  isCollapsed: boolean=false;

 
  constructor(private authService: AuthService, private globalStateService:GlobalStateService) {}
  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    this.globalStateService.setSidebarState(this.isCollapsed); 
  }
  ngOnInit() {
    this.loggedInUser = this.authService.getUserData(); // Get user name from AuthService
  }

}

