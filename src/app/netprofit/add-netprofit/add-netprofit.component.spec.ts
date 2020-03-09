import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNetProfitComponent } from './add-netprofit.component'

describe('AddNetProfitComponent', () => {
  let component: AddNetProfitComponent;
  let fixture: ComponentFixture<AddNetProfitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNetProfitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNetProfitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
