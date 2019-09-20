import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayevacuatedComponent } from './displayevacuated.component'

describe('DisplayevacuatedComponent', () => {
  let component: DisplayevacuatedComponent;
  let fixture: ComponentFixture<DisplayevacuatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayevacuatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayevacuatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
