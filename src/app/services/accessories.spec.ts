import { TestBed } from '@angular/core/testing';

import { Accessories } from './accessories';

describe('Accessories', () => {
  let service: Accessories;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Accessories);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
