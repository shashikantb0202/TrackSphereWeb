import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPackagingFormComponent } from './product-packaging-form.component';

describe('ProductPackagingFormComponent', () => {
  let component: ProductPackagingFormComponent;
  let fixture: ComponentFixture<ProductPackagingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductPackagingFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductPackagingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
