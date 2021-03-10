import { TestBed } from '@angular/core/testing';

import { HousePricePreditionService } from './house-price-predition.service';

describe('HousePricePreditionService', () => {
  let service: HousePricePreditionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HousePricePreditionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
