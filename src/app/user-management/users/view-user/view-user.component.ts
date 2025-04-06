import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../Services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { User } from '../../../Models/user.model';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';

@Component({
  selector: 'app-view-user',
  standalone: true,
  imports: [CommonModule, DateFormatPipe],
  providers: [DatePipe],
  templateUrl: './view-user.component.html',
  styleUrl: './view-user.component.css',
})
export class ViewUserComponent implements OnInit {
  userId: number = 0;
  isLoading: boolean = false;
  user: User | any = {};

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    public router: Router
  ) {}
  ngOnInit(): void {
    this.GetUserDetails();
  }
  private GetUserDetails(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.isLoading = true;
    this.userService.getUserById(this.userId).subscribe({
      next: (userData) => {
        this.user = userData;
        this.user.createdOn = new Date(userData.createdOn);
        this.user.updatedOn = userData.updatedOn
          ? new Date(userData.updatedOn)
          : null;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      },
    });
  }

  editUser(): void {
    this.router.navigate(['main/user-management/edit-user', this.user.id]);
  }
}
