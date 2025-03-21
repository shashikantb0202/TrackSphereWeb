import { Component, OnInit } from '@angular/core';
import { Role, User, UserResponse } from '../../../Models/user.model';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UserService } from '../../../Services/user.service';
import { Router } from '@angular/router';
import { RoleService } from '../../../Services/role.service';
import { StatusEnum } from '../../../enums/status.enum';
import { enumToStringArray } from '../../../utils/common.utils';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule,
              FormsModule,
              ReactiveFormsModule,NgxDatatableModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
roleList: Role|any;
selectedRole: any=0;
selectedStatus: any="";
statusList: string[]=enumToStringArray(StatusEnum); ;
  users: User[] = [];


  searchTerm: string = '';
  pageSize: number = 10;
  currentPage: number = 1;
  totalRecords: number = 0;
  sortColumn: string = '';
  sortDirection: string = '';

  constructor(private http: HttpClient,
    private userService:UserService,
    private router: Router,
    private roleService:RoleService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.getRoles();
  }

  navigateToAddUser(): void {
    this.router.navigate(['main/user-management/add-user']);
  }
  onSearch() {
    this.currentPage = 1; // ngx-datatable starts at 0
      this.loadUsers();
  }
  loadUsers(): void {
    const params = {
      page: this.currentPage.toString(),
      pageSize: this.pageSize.toString(),
      search: this.searchTerm,
      sortColumn: this.sortColumn,
      sortDirection: this.sortDirection,
      roleId:this.selectedRole,
      ...(this.selectedStatus ? { status: this.selectedStatus } : {})
    };

    this.userService.getAllUsers(params).subscribe((response) => {
      this.users = Array.isArray(response.data.data) ? response.data.data : []; // ✅ Ensure `data.data` is an array
      this.totalRecords = response.data.totalRecords; // ✅ Access `totalRecords` directly
    });
  }
  getRoles(){
    this.roleService.getAllRoles().subscribe((response) => {
      this.roleList = Array.isArray(response) ? response : []; 
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
  editUser(user: User): void {
    this.router.navigate(['main/user-management/edit-user', user.id]);
  }
  
  viewUser(user: User): void {
    this.router.navigate(['main/user-management/view-user', user.id]);
  }
}