import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountPosComponent } from './account-pos.component';

describe('AccountPosComponent', () => {
  let component: AccountPosComponent;
  let fixture: ComponentFixture<AccountPosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountPosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
