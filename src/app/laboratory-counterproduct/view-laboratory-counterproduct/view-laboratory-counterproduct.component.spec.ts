import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLaboratoryCounterProductComponent } from './view-laboratory-counterproduct.component';

describe('ViewLaboratoryCounterProductComponent', () => {
  let component: ViewLaboratoryCounterProductComponent;
  let fixture: ComponentFixture<ViewLaboratoryCounterProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewLaboratoryCounterProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLaboratoryCounterProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
