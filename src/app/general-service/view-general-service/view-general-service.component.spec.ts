import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGeneralServiceComponent } from './view-general-service.component';

describe('ViewGeneralServiceComponent', () => {
  let component: ViewGeneralServiceComponent;
  let fixture: ComponentFixture<ViewGeneralServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewGeneralServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGeneralServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
