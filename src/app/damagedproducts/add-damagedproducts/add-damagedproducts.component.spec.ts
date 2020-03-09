import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDamagedproductsComponent } from './add-damagedproducts.component'

describe('AddDamagedproductsComponent', () => {
  let component: AddDamagedproductsComponent;
  let fixture: ComponentFixture<AddDamagedproductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDamagedproductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDamagedproductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
