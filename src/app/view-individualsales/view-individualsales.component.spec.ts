import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewIndividualsalesComponent } from './view-individualsales.component';

describe('ViewIndividualsalesComponent', () => {
  let component: ViewIndividualsalesComponent;
  let fixture: ComponentFixture<ViewIndividualsalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewIndividualsalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewIndividualsalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
