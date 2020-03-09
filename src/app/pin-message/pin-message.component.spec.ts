import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PinMessageComponent } from './pin-message.component'

describe('PinMessageComponent', () => {
  let component: PinMessageComponent;
  let fixture: ComponentFixture<PinMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PinMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
