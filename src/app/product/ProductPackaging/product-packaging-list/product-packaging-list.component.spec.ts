import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPackagingListComponent } from './product-packaging-list.component';

describe('ProductPackagingListComponent', () => {
  let component: ProductPackagingListComponent;
  let fixture: ComponentFixture<ProductPackagingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductPackagingListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductPackagingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
