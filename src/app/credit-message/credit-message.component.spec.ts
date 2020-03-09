import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditMessageComponent } from './credit-message.component'

describe('CreditMessageComponent', () => {
  let component: CreditMessageComponent;
  let fixture: ComponentFixture<CreditMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
