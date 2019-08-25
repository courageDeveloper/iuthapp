import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRadiologyServiceComponent } from './view-radiology-service.component';

describe('ViewRadiologyServiceComponent', () => {
  let component: ViewRadiologyServiceComponent;
  let fixture: ComponentFixture<ViewRadiologyServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRadiologyServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRadiologyServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
