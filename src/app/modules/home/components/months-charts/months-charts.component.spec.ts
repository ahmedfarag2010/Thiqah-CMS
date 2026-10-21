import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthsChartsComponent } from './months-charts.component';

describe('MonthsChartsComponent', () => {
  let component: MonthsChartsComponent;
  let fixture: ComponentFixture<MonthsChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonthsChartsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthsChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
