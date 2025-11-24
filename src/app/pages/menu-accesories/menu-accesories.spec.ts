import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuAccesories } from './menu-accesories';

describe('MenuAccesories', () => {
  let component: MenuAccesories;
  let fixture: ComponentFixture<MenuAccesories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuAccesories]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuAccesories);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
