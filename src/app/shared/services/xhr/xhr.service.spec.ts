import { TestBed } from '@angular/core/testing';

import { XhrService } from './xhr.service';

describe('XhrService', () => {
  let service: XhrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XhrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
