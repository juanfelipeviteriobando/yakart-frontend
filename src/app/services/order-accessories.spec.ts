import { TestBed } from '@angular/core/testing';

import { OrderAccessories } from './order-accessories';

describe('OrderAccessories', () => {
  let service: OrderAccessories;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderAccessories);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
