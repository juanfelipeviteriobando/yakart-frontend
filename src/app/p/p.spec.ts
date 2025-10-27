import { ComponentFixture, TestBed } from '@angular/core/testing';

import { P } from './p';

describe('P', () => {
  let component: P;
  let fixture: ComponentFixture<P>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [P]
    })
    .compileComponents();

    fixture = TestBed.createComponent(P);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
