import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPackagingComponent } from './view-packaging.component';

describe('ViewPackagingComponent', () => {
  let component: ViewPackagingComponent;
  let fixture: ComponentFixture<ViewPackagingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPackagingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPackagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
