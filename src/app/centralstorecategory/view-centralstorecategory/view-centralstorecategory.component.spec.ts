import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCentralStoreCategoryComponent } from './view-centralstorecategory.component';

describe('ViewCentralStoreCategoryComponent', () => {
  let component: ViewCentralStoreCategoryComponent;
  let fixture: ComponentFixture<ViewCentralStoreCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCentralStoreCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCentralStoreCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
