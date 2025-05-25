import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
import { DateFormatPipe } from '../../shared/pipes/date-format.pipe';
import { UserCheckInService } from '../../Services/user.checkin.service';
import { UserCheckIn } from '../../Models/user.checkin.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-view-location',
  standalone: true,
  imports: [CommonModule, FormsModule, DateFormatPipe],
  providers: [DatePipe, DateFormatPipe],
  templateUrl: './view-location.component.html',
  styleUrl: './view-location.component.css',
})
export class ViewLocationComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  selectedUser: User | null = null;
  filteredUsers: User[] = [];

  userList: User[] = [];
  selectedDate: string = this.getCurrentISTDate();
  searchTerm: string = '';
  map: any = null;
  markers: any[] = [];
  polylines: any[] = [];
  isDropdownOpen = false;
  isFilterDropdownOpen = false;

  visits: CustomerVisit[] = [];
  locationTrackers: LocationTracker[] = [];
  userCheckIns: UserCheckIn[] = [];
  pageSize: number = 0;
  currentPage: number = 0;
  totalRecords: number = 0;
  sortColumn: string = '';
  sortDirection: string = '';
  isLoading: boolean = false;
  customerVisitTypeList: CustomerVisitTypeBasicInfo[] = [];
  selectedVisitType: CustomerVisitTypeBasicInfo | null = null;
  visitMarkers: Map<number, L.Marker<any>> | null = null;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private customerVisitService: CustomerVisitService,
    private locationTrackerService: LocationTrackerService,
    private userCheckInService: UserCheckInService,
    private dropDownService: DropdownService,
    private datePipe: DateFormatPipe
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadDropdownData();
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'leaflet/marker-icon-2x.png',
      iconUrl: 'leaflet/marker-icon.png',
      shadowUrl: 'leaflet/marker-shadow.png',
    });
    this.visitMarkers = new Map<number, L.Marker>(); // Add this in your component
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

  clearFilter() {
    this.selectedVisitType = null; // Reset the selected filter
    this.isFilterDropdownOpen = false; // Close the dropdown
    this.LoadMap();
  }

  private async loadUsers(): Promise<void> {
    this.userService.getAllUser().subscribe({
      next: async (response) => {
        this.userList = response;
        this.filteredUsers = [...this.userList];
        if (this.userList.length > 0) {
          this.selectedUser = this.userList[0];
          console.log(this.selectedUser);

          await this.LoadMap();
        }
      },
      error: (error) => {
        console.error('Error loading users:', error);
      },
    });
  }

  async loadLocationTracker(): Promise<void> {
    this.isLoading = true;
    this.locationTrackers = [];

    const params: any = {
      page: 0,
      pageSize: 0,
      ...(this.selectedUser?.id ? { userId: this.selectedUser?.id } : {}),
      ...(this.selectedDate ? { LcationDate: this.selectedDate } : {}),
    };

    try {
      const response = await firstValueFrom(
        this.locationTrackerService.getAllLocationTrackersWithFilter(params)
      );

      this.locationTrackers = Array.isArray(response.data.data)
        ? response.data.data
        : [];

      console.log(this.locationTrackers);
    } catch (error) {
      console.error('Error loading location trackers:', error);
      this.locationTrackers = [];
    } finally {
      this.isLoading = false;
    }
  }

  async loadUserCheckIns(): Promise<void> {
    this.userCheckIns = [];
    this.isLoading = true;

    const params: any = {
      page: 0,
      pageSize: 0,
      ...(this.selectedUser?.id ? { userId: this.selectedUser?.id } : {}),
      ...(this.selectedDate ? { CheckInDate: this.selectedDate } : {}),
      // ...(this.selectedDate ? { CheckOutDate: this.selectedDate } : {}),
    };

    try {
      const response = await firstValueFrom(
        this.userCheckInService.getAllUserCheckInsWithFilter(params)
      );

      this.userCheckIns = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      console.log(this.userCheckIns);
    } catch (error) {
      console.error('Error loading user check-ins:', error);
      this.userCheckIns = [];
    } finally {
      this.isLoading = false;
    }
  }

  async loadVisits(): Promise<void> {
    this.visits = [];
    this.isLoading = true;

    const selected = new Date(this.selectedDate);
    const params: any = {
      page: this.currentPage.toString(),
      pageSize: this.pageSize.toString(),
      ...(this.selectedUser?.id ? { userId: this.selectedUser?.id } : {}),
      ...(this.selectedVisitType?.id
        ? { customerVisitTypeId: this.selectedVisitType?.id }
        : {}),
      ...(this.selectedDate ? { VisitDate: selected.toISOString() } : {}),
    };

    try {
      const response = await firstValueFrom(
        this.customerVisitService.getAllCustomerVisitsWithFilter(params)
      );

      this.visits = Array.isArray(response.data.data) ? response.data.data : [];
      this.totalRecords = response.data.totalRecords;
    } catch (error) {
      this.totalRecords = 0;
      this.visits = [];
      console.error('Error loading visits:', error);
    } finally {
      this.isLoading = false;
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleFilterDropdown(): void {
    this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
  }

  async selectEmployee(user: User): Promise<void> {
    this.selectedUser = user;
    this.isDropdownOpen = false;
    await this.LoadMap();
  }

  async selectDate() {
    await this.LoadMap();
  }

  async applyFilter(visitType: CustomerVisitTypeBasicInfo): Promise<void> {
    this.selectedVisitType = visitType;
    this.isFilterDropdownOpen = false;
    await this.LoadMap();
  }

  async LoadMap() {
    const bounds = L.latLngBounds([]);
    this.visits = [];
    this.locationTrackers = [];
    this.userCheckIns = [];
    await this.loadVisits();
    await this.loadLocationTracker();
    await this.loadUserCheckIns();
    this.showEmployeeRoute(this.selectedUser!);
  }
  private showEmployeeRoute(employee: User): void {
    // Clear existing markers and polylines

    this.markers.forEach((marker) => this.map.removeLayer(marker));
    this.polylines.forEach((polyline) => this.map.removeLayer(polyline));
    this.markers = [];
    this.polylines = [];

    // Add markers for check-ins
    this.userCheckIns.forEach((checkIn, index) => {
      // Add check-in marker

      // Add check-out marker if available
      if (checkIn.checkOutLatitude && checkIn.checkOutLongitude) {
        const checkOutMarker = L.marker([
          checkIn.checkOutLatitude,
          checkIn.checkOutLongitude,
        ]).addTo(this.map);
        const checkInMarker = L.marker([
          checkIn.checkInLatitude,
          checkIn.checkInLongitude,
        ]).addTo(this.map);
        this.markers.push(checkInMarker);
        var chekindate =
          this.datePipe.transform(checkIn.checkInDateTime, 'DEFAULT') || '';
        checkInMarker.bindPopup(
          `<h6><b>Check-In</b></h6>
          <div class="text-sm text-gray-600">${checkIn.route}</div>
          <div class="text-xs text-gray-500 mt-1">${chekindate}</div>
          <div class="text-xs mt-1"><span class="font-medium">KM Reading:</span> ${checkIn.checkInKmReading}</div>
          <div class="text-xs mt-1"><span class="font-medium">Travelled By:</span> ${checkIn.travelledBy}</div>
        `
        );
        this.markers.push(checkOutMarker);
        var checkOutDateTime =
          this.datePipe.transform(checkIn.checkOutDateTime, 'DEFAULT') || '';
        checkOutMarker.bindPopup(
          `<h6><b>Check-Out</b></h6>
            <div class="text-sm text-gray-600">${checkIn.route}</div>
            <div class="text-xs text-gray-500 mt-1">${checkOutDateTime}</div>
            <div class="text-xs mt-1"><span class="font-medium">KM Reading:</span> ${checkIn.checkOutKmReading}</div>
            <div class="text-xs mt-1"><span class="font-medium">Travelled By:</span> ${checkIn.travelledBy}</div>
          `
        );
      }

      // Add polyline between check-in and check-out if both are available
      if (checkIn.checkOutLatitude && checkIn.checkOutLongitude) {
        const polyline = L.polyline(
          [
            [checkIn.checkInLatitude, checkIn.checkInLongitude],
            [checkIn.checkOutLatitude, checkIn.checkOutLongitude],
          ],
          {
            color: '#3b82f6',
            weight: 4,
            dashArray: '5, 5',
            opacity: 0.8,
          }
        ).addTo(this.map);
        this.polylines.push(polyline);
      }
    });

    // Add markers for visits
    this.visits.forEach((visit, index) => {
      const icon = this.getCustomIcon(visit.customerVisitType.name);
      const marker = L.marker([visit.latitude, visit.longitude], {
        icon,
      }).addTo(this.map);
      this.markers.push(marker);
      this.visitMarkers!.set(visit.id, marker); // 🔑 store by visit ID
      var visitDate = this.datePipe.transform(visit.visitDate, 'DEFAULT') || '';
      marker.bindPopup(
        `<h6><b>Visit</b></h6>
        <div class="font-medium">${visit.customer.name}</div>
          <div class="text-sm text-gray-600">${visit.customer.addressLine1},
          ${visit.customer!.city!.name!},
          ${visit.customer!.state!.name!} -
          ${visit.customer.pincode}</div>
          <div class="text-xs text-gray-500 mt-1">${visitDate} 
          </div>
          <div class="text-xs mt-1"><span class="font-medium">Purpose:</span> ${
            visit.reason
          }</div>
        `
      );
    });

    // Add location tracker route
    const empTravelRoute: [number, number][] = this.locationTrackers.map(
      (item) => [item.latitude, item.longitude]
    );

    if (empTravelRoute.length > 1) {
      const polyline = L.polyline(empTravelRoute, {
        color: '#3b82f6',
        weight: 4,
        //  dashArray: '5, 5',
        opacity: 0.8,
      }).addTo(this.map);
      this.polylines.push(polyline);
    }
    // 3. Show time at each point with invisible circle markers
    this.locationTrackers.forEach((item) => {
      const time = this.datePipe.transform(item.timestamp, 'TIME_ONLY') || '';
      const pointMarker = L.circleMarker([item.latitude, item.longitude], {
        radius: 6,
        color: 'transparent', // hide stroke
        fillColor: 'transparent', // hide fill
        fillOpacity: 0,
      }).addTo(this.map);

      pointMarker.bindTooltip(`Time: ${time}`, {
        direction: 'top',
        offset: [0, -10],
        opacity: 0.9,
      });
    });

    // Fit map to show all markers and routes
    const allPoints = [
      ...this.markers.map((m) => m.getLatLng()),
      ...this.polylines.flatMap((p) => p.getLatLngs()),
    ];

    if (allPoints.length > 0) {
      const bounds = L.latLngBounds(allPoints);
      this.map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15,
      });
    }
  }

  openVisitPopup(visitId: number) {
    const marker = this.visitMarkers!.get(visitId);
    if (marker) {
      this.map.setView(marker.getLatLng(), 14); // 👈 optional: zoom to it
      marker.openPopup();
    }
  }

  // Function to generate different icons based on visit reason
  getCustomIcon(reason: string): L.Icon {
    switch (reason.toLowerCase()) {
      case 'sale':
        return L.icon({
          iconUrl: 'leaflet/sales-icon.png', // Replace with your icon image URL
          iconSize: [32, 32], // Icon size (width, height)
          iconAnchor: [16, 32], // Anchor point of the icon
          popupAnchor: [0, -32], // Where the popup appears
        });

      case 'marketing':
        return L.icon({
          iconUrl: 'leaflet/service-icon.png',
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        });

      case 'order':
        return L.icon({
          iconUrl: 'leaflet/order-icon.png',
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        });

      default:
        return L.icon({
          iconUrl: 'leaflet/default.png',
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
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

  private getCurrentISTDate(): string {
    debugger;
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const istDate = new Date(now.getTime() + istOffset);
    return istDate.toISOString().split('T')[0];
  }
}
