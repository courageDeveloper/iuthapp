import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGrossProfitComponent } from './add-grossprofit.component'

describe('AddGrossProfitComponent', () => {
  let component: AddGrossProfitComponent;
  let fixture: ComponentFixture<AddGrossProfitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGrossProfitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGrossProfitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
