import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakepaymentFormCentralStoreBcComponent } from './makepayment-form-centralstore_bc.component'

describe('MakepaymentFormCentralStoreBcComponent', () => {
  let component: MakepaymentFormCentralStoreBcComponent;
  let fixture: ComponentFixture<MakepaymentFormCentralStoreBcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakepaymentFormCentralStoreBcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakepaymentFormCentralStoreBcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
