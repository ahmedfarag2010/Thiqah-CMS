import { TestBed } from '@angular/core/testing';

import { IsSavedDataGuard } from './is-saved-data.guard';

describe('IsSavedDataGuard', () => {
  let guard: IsSavedDataGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsSavedDataGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
