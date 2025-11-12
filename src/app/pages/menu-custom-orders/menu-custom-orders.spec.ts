import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuCustomOrders } from './menu-custom-orders';

describe('MenuCustomOrders', () => {
  let component: MenuCustomOrders;
  let fixture: ComponentFixture<MenuCustomOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuCustomOrders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuCustomOrders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
