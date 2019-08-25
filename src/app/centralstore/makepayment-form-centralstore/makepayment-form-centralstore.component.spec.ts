import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakepaymentFormCentralStoreComponent } from './makepayment-form-centralstore.component'

describe('MakepaymentFormCentralStoreComponent', () => {
  let component: MakepaymentFormCentralStoreComponent;
  let fixture: ComponentFixture<MakepaymentFormCentralStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakepaymentFormCentralStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakepaymentFormCentralStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
