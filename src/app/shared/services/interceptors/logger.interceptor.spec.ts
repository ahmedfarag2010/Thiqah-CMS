import { TestBed } from '@angular/core/testing';
import { LoggerInterceptor } from './logger.interceptor';




describe('LoggerInterceptor', () => {
  let intercetptor: LoggerInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    intercetptor = TestBed.inject(LoggerInterceptor);
  });

  it('should be created', () => {
    expect(intercetptor).toBeTruthy();
  });
});
