import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEvacuatedComponent } from './view-evacuated.component';

describe('ViewEvacuatedComponent', () => {
  let component: ViewEvacuatedComponent;
  let fixture: ComponentFixture<ViewEvacuatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEvacuatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEvacuatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
