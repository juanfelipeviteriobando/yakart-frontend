import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuProducts } from './menu-products';

describe('MenuProducts', () => {
  let component: MenuProducts;
  let fixture: ComponentFixture<MenuProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuProducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
