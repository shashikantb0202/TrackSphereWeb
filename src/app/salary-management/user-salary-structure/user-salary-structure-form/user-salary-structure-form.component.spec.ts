import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { UserSalaryStructureFormComponent } from './user-salary-structure-form.component';
import { SalaryManagementService } from '../../../Services/salary-management.service';
import { UserService } from '../../../Services/user.service';
import { UserBasicInfo } from '../../../Models/user.model';
import { of } from 'rxjs';

describe('UserSalaryStructureFormComponent', () => {
  let component: UserSalaryStructureFormComponent;
  let fixture: ComponentFixture<UserSalaryStructureFormComponent>;
  let salaryServiceSpy: jasmine.SpyObj<SalaryManagementService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const salarySpy = jasmine.createSpyObj('SalaryManagementService', [
      'getSalaryStructureById',
      'createSalaryStructure',
      'updateSalaryStructure',
    ]);
    const userSpy = jasmine.createSpyObj('UserService', ['getAllUser']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        ToastrModule.forRoot(),
      ],
      declarations: [UserSalaryStructureFormComponent],
      providers: [
        { provide: SalaryManagementService, useValue: salarySpy },
        { provide: UserService, useValue: userSpy },
      ],
    }).compileComponents();

    salaryServiceSpy = TestBed.inject(
      SalaryManagementService
    ) as jasmine.SpyObj<SalaryManagementService>;
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSalaryStructureFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.salaryStructureForm.get('userId')?.value).toBe('');
    expect(component.salaryStructureForm.get('basicSalary')?.value).toBe('');
    expect(component.salaryStructureForm.get('hra')?.value).toBe('');
    expect(component.salaryStructureForm.get('allowances')?.value).toBe('');
    expect(component.salaryStructureForm.get('deductions')?.value).toBe('');
    expect(component.salaryStructureForm.get('effectiveFrom')?.value).toBe('');
  });

  it('should load users on init', () => {
    const mockUsers: UserBasicInfo[] = [
      { id: 1, username: 'user1', name: 'User 1' },
      { id: 2, username: 'user2', name: 'User 2' },
    ];
    userServiceSpy.getAllUser.and.returnValue(of(mockUsers));

    component.ngOnInit();
    fixture.detectChanges();

    expect(userServiceSpy.getAllUser).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsers);
  });

  it('should calculate net salary correctly', () => {
    component.salaryStructureForm.patchValue({
      basicSalary: 10000,
      hra: 5000,
      allowances: 2000,
      deductions: 1000,
    });

    expect(component.calculateNetSalary()).toBe(16000);
  });

  it('should validate required fields', () => {
    const form = component.salaryStructureForm;
    expect(form.valid).toBeFalsy();

    form.patchValue({
      userId: 1,
      basicSalary: 10000,
      hra: 5000,
      allowances: 2000,
      deductions: 1000,
      effectiveFrom: '2024-01-01',
    });

    expect(form.valid).toBeTruthy();
  });

  it('should validate minimum values for salary fields', () => {
    const form = component.salaryStructureForm;

    form.patchValue({
      basicSalary: -1000,
      hra: -500,
      allowances: -200,
      deductions: -100,
    });

    expect(form.get('basicSalary')?.valid).toBeFalsy();
    expect(form.get('hra')?.valid).toBeFalsy();
    expect(form.get('allowances')?.valid).toBeFalsy();
    expect(form.get('deductions')?.valid).toBeFalsy();
  });
});
