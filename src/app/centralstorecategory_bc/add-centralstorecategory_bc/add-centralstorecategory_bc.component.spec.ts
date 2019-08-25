import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCentralStoreCategoryBcComponent } from './add-centralstorecategory_bc.component'

describe('AddCentralStoreCategoryBcComponent', () => {
  let component: AddCentralStoreCategoryBcComponent;
  let fixture: ComponentFixture<AddCentralStoreCategoryBcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCentralStoreCategoryBcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCentralStoreCategoryBcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
