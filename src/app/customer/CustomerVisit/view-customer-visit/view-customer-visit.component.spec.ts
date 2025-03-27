import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCustomerVisitComponent } from './view-customer-visit.component';

describe('ViewCustomerVisitComponent', () => {
  let component: ViewCustomerVisitComponent;
  let fixture: ComponentFixture<ViewCustomerVisitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCustomerVisitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCustomerVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
