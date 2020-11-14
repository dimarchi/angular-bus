import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BusStopComponent } from './bus-stop.component';

describe('BusStopComponent', () => {
  let component: BusStopComponent;
  let fixture: ComponentFixture<BusStopComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BusStopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusStopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
