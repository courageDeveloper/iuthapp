import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDamagedproductsComponent } from './view-damagedproducts.component';

describe('ViewGeneralServiceComponent', () => {
  let component: ViewDamagedproductsComponent;
  let fixture: ComponentFixture<ViewDamagedproductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDamagedproductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDamagedproductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
