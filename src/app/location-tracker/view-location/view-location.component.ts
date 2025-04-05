import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../Services/user.service';
import { User, UserBasicInfo } from '../../Models/user.model';
import * as L from 'leaflet';
import { CustomerVisit } from '../../Models/customer.visit.model';
import { CustomerVisitService } from '../../Services/customer.visit.service';
import { CustomerVisitTypeBasicInfo } from '../../Models/common.model';
import { DropdownService } from '../../Services/dropdown.service';
import { LocationTrackerService } from '../../Services/location.tracker.service';
import { LocationTracker } from '../../Models/location.tracker.model';

@Component({
  selector: 'app-view-location',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-location.component.html',
  styleUrl: './view-location.component.css',
})
export class ViewLocationComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  selectedUser: User | null = null;
  filteredUsers: User[] = [];

  userList: User[] = [];
  selectedDate: string = new Date().toISOString().split('T')[0];
  searchTerm: string = '';
  map: any = null;
  markers: any[] = [];
  polylines: any[] = [];
  isDropdownOpen = false;
  isFilterDropdownOpen = false;

  visits: CustomerVisit[] = [];
  locationTrackers: LocationTracker[] = [];
  pageSize: number = 0;
  currentPage: number = 0;
  totalRecords: number = 0;
  sortColumn: string = '';
  sortDirection: string = '';
  isLoading: boolean = false;
  customerVisitTypeList: CustomerVisitTypeBasicInfo[] = [];
  selectedVisitType: CustomerVisitTypeBasicInfo | null = null;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private customerVisitService: CustomerVisitService,
    private locationTrackerService: LocationTrackerService,
    private dropDownService: DropdownService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadDropdownData();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeMap();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.cleanupMap();
  }

  loadDropdownData(): void {
    this.dropDownService
      .getCustomerVisitType()
      .subscribe((data) => (this.customerVisitTypeList = data));
    console.log(this.customerVisitTypeList);
  }

  private initializeMap(): void {
    if (!this.mapContainer?.nativeElement) {
      console.error('Map container not found');
      return;
    }

    this.map = L.map(this.mapContainer.nativeElement).setView(
      [51.505, -0.09],
      13
    );
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    // If we already have employees loaded, show the route
    if (this.selectedUser) {
      this.showEmployeeRoute(this.selectedUser);
    }
  }

  private cleanupMap(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private loadUsers(): void {
    this.userService.getAllUser().subscribe({
      next: (response) => {
        this.userList = response;
        this.filteredUsers = [...this.userList];
        if (this.userList.length > 0) {
          this.selectedUser = this.userList[0];
          console.log(this.selectedUser);

          this.loadVisits();
          this.loadLocationTracker();
          if (this.map) {
            this.showEmployeeRoute(this.selectedUser);
          }
        }
      },
      error: (error) => {
        console.error('Error loading users:', error);
      },
    });
  }

  loadLocationTracker(): void {
    this.isLoading = true;
    const params: any = {
      page: 0,
      pageSize: 0,
      ...(this.selectedUser?.id ? { userId: this.selectedUser?.id } : {}),
      ...(this.selectedDate ? { LcationDate: this.selectedDate } : {}),
    };
    this.locationTrackerService
      .getAllLocationTrackersWithFilter(params)
      .subscribe({
        next: (response) => {
          this.locationTrackers = Array.isArray(response.data.data)
            ? response.data.data
            : [];
          console.log(this.locationTrackers);
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.locationTrackers = [];
        },
      });
  }

  loadVisits(): void {
    this.visits = [];
    this.isLoading = true;
    const params: any = {
      page: this.currentPage.toString(),
      pageSize: this.pageSize.toString(),
      ...(this.selectedUser?.id ? { userId: this.selectedUser?.id } : {}),
      ...(this.selectedVisitType?.id
        ? { customerVisitTypeId: this.selectedVisitType?.id }
        : {}),
      ...(this.selectedDate ? { VisitDate: this.selectedDate } : {}),
    };

    this.customerVisitService.getAllCustomerVisitsWithFilter(params).subscribe({
      next: (response) => {
        this.visits = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        console.log(this.visits);
        this.totalRecords = response.data.totalRecords;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.totalRecords = 0;
        this.visits = [];
      },
    });
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleFilterDropdown(): void {
    this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
  }

  selectEmployee(user: User): void {
    this.selectedUser = user;
    this.isDropdownOpen = false;
    this.loadVisits();
    this.loadLocationTracker();
    this.showEmployeeRoute(user);
  }

  selectDate() {
    this.showEmployeeRoute(this.selectedUser!);
    this.loadVisits();
    this.loadLocationTracker();
  }

  applyFilter(visitType: CustomerVisitTypeBasicInfo): void {
    this.selectedVisitType = visitType;
    this.loadVisits();
    this.loadLocationTracker();
    this.isFilterDropdownOpen = false;
  }

  private showEmployeeRoute(employee: User): void {
    // Clear existing markers and polylines
    this.markers.forEach((marker) => this.map.removeLayer(marker));
    this.polylines.forEach((polyline) => this.map.removeLayer(polyline));
    this.markers = [];
    this.polylines = [];
    // Add markers for each visit
    const visitCoordinates: [number, number][] = [];
    this.visits.forEach((visit, index) => {
      const marker = L.marker([visit.latitude, visit.longitude]).addTo(
        this.map
      );
      this.markers.push(marker);
      marker
        .bindPopup(
          `<div class="font-medium">${visit.user.name}</div>
          <div class="text-sm text-gray-600">${visit.customer.addressLine1},
          ${visit.customer!.city!.name!},
          ${visit.customer!.state!.name!} -
          ${visit.customer.pincode}</div>
          <div class="text-xs text-gray-500 mt-1">${visit.visitDate} 
          </div>
          <div class="text-xs mt-1"><span class="font-medium">Purpose:</span> ${
            visit.reason
          }</div>
        `
        )
        .openPopup();

      marker.setIcon(
        L.divIcon({
          className: '',
          html: `<div class="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold shadow-md">${
            index + 1
          }</div>`,
          iconSize: [24, 24],
        })
      );

      visitCoordinates.push([visit.latitude, visit.latitude]);
    });

    const empTravelRoute: [number, number][] = this.locationTrackers.map(
      (item) => [item.latitude, item.longitude]
    );

    console.log('empTravelRoute : ' + empTravelRoute);
    if (empTravelRoute.length > 1) {
      const polyline = L.polyline(empTravelRoute, {
        color: '#3b82f6',
        weight: 4,
        dashArray: '5, 5',
        opacity: 0.8,
      }).addTo(this.map);
      this.polylines.push(polyline);

      // Fit map to show the entire route
      const bounds = L.latLngBounds(empTravelRoute);
      this.map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15, // Optional: limit maximum zoom level
      });
    }
  }

  filterEmployees(): void {
    if (!this.searchTerm) {
      this.filteredUsers = [...this.userList];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredUsers = this.userList.filter((user) =>
      user.name.toLowerCase().includes(searchLower)
    );
  }
}
