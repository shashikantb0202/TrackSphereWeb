import { Component, OnInit } from '@angular/core';
import { User, UserResponse } from '../../../Models/user.model';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UserService } from '../../../Services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule,
              FormsModule,
              ReactiveFormsModule,NgxDatatableModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  columns = [
    { name: 'ID', prop: 'id' },
    { name: 'Username', prop: 'username' },
    { name: 'Name', prop: 'name' },
    { name: 'Email', prop: 'email' },
    { name: 'Contact No', prop: 'contactNo' },
    { name: 'Role', prop: 'role.name' },
    { name: 'Created On', prop: 'createdOn' },
    { name: 'Created By', prop: 'createdBy.name' }
  ];

  searchTerm: string = '';
  pageSize: number = 10;
  currentPage: number = 1;
  totalRecords: number = 0;
  sortColumn: string = '';
  sortDirection: string = '';

  constructor(private http: HttpClient,private userService:UserService,private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  navigateToAddUser(): void {
    this.router.navigate(['main/user-management/add-user']);
  }

  loadUsers(): void {
    const params = {
      page: this.currentPage.toString(),
      pageSize: this.pageSize.toString(),
      search: this.searchTerm,
      sortColumn: this.sortColumn,
      sortDirection: this.sortDirection
    };

    this.userService.getAllUsers(params).subscribe((response) => {
      this.users = Array.isArray(response.data.data) ? response.data.data : []; // ✅ Ensure `data.data` is an array
      this.totalRecords = response.data.totalRecords; // ✅ Access `totalRecords` directly
    });
  }

   // Load Users with Search Logic
   searchUsers(): void {
    const trimmedText = this.searchTerm.trim();
    // Trigger only if 3+ characters entered or empty string
    if (trimmedText.length >= 3 || trimmedText === '') {
      this.loadUsers();
    }
}

  onPage(event: any): void {
    this.currentPage = event.offset + 1; // ngx-datatable starts at 0
    this.loadUsers();
  }

  onSort(event: any): void {
    const sort = event.sorts[0];
    this.sortColumn = sort.prop;
    this.sortDirection = sort.dir;
    this.loadUsers();
  }
}