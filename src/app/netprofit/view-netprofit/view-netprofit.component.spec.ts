import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNetProfitComponent } from './view-netprofit.component';

describe('ViewNetProfitComponent', () => {
  let component: ViewNetProfitComponent;
  let fixture: ComponentFixture<ViewNetProfitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewNetProfitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewNetProfitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
