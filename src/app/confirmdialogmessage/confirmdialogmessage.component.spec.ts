import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmdialogmessageComponent } from './confirmdialogmessage.component';

describe('ConfirmdialogmessageComponent', () => {
  let component: ConfirmdialogmessageComponent;
  let fixture: ComponentFixture<ConfirmdialogmessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmdialogmessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmdialogmessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
