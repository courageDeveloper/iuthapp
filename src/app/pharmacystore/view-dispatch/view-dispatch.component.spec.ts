import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDispatchComponent } from './view-dispatch.component';

describe('ViewDispatchComponent', () => {
  let component: ViewDispatchComponent;
  let fixture: ComponentFixture<ViewDispatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDispatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
