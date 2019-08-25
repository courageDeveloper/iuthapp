import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCentralStoreBcComponent } from './view-centralstore_bc.component';

describe('ViewCentralStoreBcComponent', () => {
  let component: ViewCentralStoreBcComponent;
  let fixture: ComponentFixture<ViewCentralStoreBcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCentralStoreBcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCentralStoreBcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
