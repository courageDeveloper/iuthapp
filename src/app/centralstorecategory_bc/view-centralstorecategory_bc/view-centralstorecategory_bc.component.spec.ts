import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCentralStoreCategoryBcComponent } from './view-centralstorecategory_bc.component';

describe('ViewCentralStoreCategoryBcComponent', () => {
  let component: ViewCentralStoreCategoryBcComponent;
  let fixture: ComponentFixture<ViewCentralStoreCategoryBcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCentralStoreCategoryBcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCentralStoreCategoryBcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
