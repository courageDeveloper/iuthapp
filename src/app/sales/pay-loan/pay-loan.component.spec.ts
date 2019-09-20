import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPayloanComponent } from './pay-loan.component'

describe('AddPayloanComponent', () => {
  let component: AddPayloanComponent;
  let fixture: ComponentFixture<AddPayloanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPayloanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPayloanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
