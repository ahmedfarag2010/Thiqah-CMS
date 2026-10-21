import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleTopicComponent } from './single-topic.component';

describe('SingleTopicComponent', () => {
  let component: SingleTopicComponent;
  let fixture: ComponentFixture<SingleTopicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleTopicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
