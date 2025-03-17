import { Component, HostListener } from '@angular/core';
import { User } from '../Models/user.model';
import { AuthService } from '../auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { UserPermissionService } from '../Services/user-permission.service';
import { Module } from '../Models/user-permission.model';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { GlobalStateService } from '../Services/global-state.service';
@Component({
  selector: 'app-main',
  imports: [
     FormsModule,
     CommonModule,
     SidebarComponent,
     HeaderComponent,
     RouterOutlet
   ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  isCollapsed: boolean=false;

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }
  constructor(private globalStateService: GlobalStateService) {
    this.globalStateService.isCollapsed$.subscribe(
      (state) => this.isCollapsed = state
    );
}
}
