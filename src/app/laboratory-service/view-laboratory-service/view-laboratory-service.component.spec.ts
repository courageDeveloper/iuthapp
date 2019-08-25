import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLaboratoryServiceComponent } from './view-laboratory-service.component';

describe('ViewLaboratoryServiceComponent', () => {
  let component: ViewLaboratoryServiceComponent;
  let fixture: ComponentFixture<ViewLaboratoryServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewLaboratoryServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLaboratoryServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
