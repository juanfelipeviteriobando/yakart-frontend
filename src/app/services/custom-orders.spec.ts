import { TestBed } from '@angular/core/testing';

import { CustomOrders } from './custom-orders';

describe('CustomOrders', () => {
  let service: CustomOrders;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomOrders);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
