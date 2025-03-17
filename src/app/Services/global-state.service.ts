import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'  // Service is available globally
})
export class GlobalStateService {
  private isSidebarCollapsedSubject = new BehaviorSubject<boolean>(false);  // Default state
  isCollapsed$ = this.isSidebarCollapsedSubject.asObservable();

 

  // Set sidebar state directly
  setSidebarState(isCollapsed: boolean): void {
    this.isSidebarCollapsedSubject.next(isCollapsed);
  }
  toggleSidebar(): void {
    this.isSidebarCollapsedSubject.next(!this.isSidebarCollapsedSubject.value);
  }
}
