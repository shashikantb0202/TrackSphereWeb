import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProductPackagingComponent } from './view-product-packaging.component';

describe('ViewProductPackagingComponent', () => {
  let component: ViewProductPackagingComponent;
  let fixture: ComponentFixture<ViewProductPackagingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewProductPackagingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewProductPackagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
