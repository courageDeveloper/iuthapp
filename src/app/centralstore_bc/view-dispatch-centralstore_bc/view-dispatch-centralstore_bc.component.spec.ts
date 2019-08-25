import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDispatchCentralStoreBcComponent } from './view-dispatch-centralstore_bc.component';

describe('ViewDispatchCentralStoreBcComponent', () => {
  let component: ViewDispatchCentralStoreBcComponent;
  let fixture: ComponentFixture<ViewDispatchCentralStoreBcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDispatchCentralStoreBcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDispatchCentralStoreBcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
