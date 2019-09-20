import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRadiologyCounterProductComponent } from './view-radiology-counterproduct.component';

describe('ViewRadiologyCounterProductComponent', () => {
  let component: ViewRadiologyCounterProductComponent;
  let fixture: ComponentFixture<ViewRadiologyCounterProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRadiologyCounterProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRadiologyCounterProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
