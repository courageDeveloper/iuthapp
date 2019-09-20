import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensedialogmessageComponent } from './expensedialogmessage.component';

describe('ExpensedialogmessageComponent', () => {
  let component: ExpensedialogmessageComponent;
  let fixture: ComponentFixture<ExpensedialogmessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpensedialogmessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpensedialogmessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
