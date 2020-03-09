import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGrossProfitComponent } from './view-grossprofit.component';

describe('ViewGrossProfitComponent', () => {
  let component: ViewGrossProfitComponent;
  let fixture: ComponentFixture<ViewGrossProfitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewGrossProfitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGrossProfitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
