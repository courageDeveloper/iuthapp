import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGeneralCounterProductComponent } from './view-general-counterproduct.component'

describe('ViewGeneralCounterProductComponent', () => {
  let component: ViewGeneralCounterProductComponent;
  let fixture: ComponentFixture<ViewGeneralCounterProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewGeneralCounterProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGeneralCounterProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
