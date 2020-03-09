import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPayborrowComponent } from './pay-borrow.component'

describe('AddPayborrowComponent', () => {
  let component: AddPayborrowComponent;
  let fixture: ComponentFixture<AddPayborrowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPayborrowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPayborrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
