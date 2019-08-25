import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPharmacyStoreCategoryComponent } from './add-pharmacystorecategory.component'

describe('AddPharmacyStoreCategoryComponent', () => {
  let component: AddPharmacyStoreCategoryComponent;
  let fixture: ComponentFixture<AddPharmacyStoreCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPharmacyStoreCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPharmacyStoreCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
