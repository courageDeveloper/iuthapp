import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCentralStoreCategoryComponent } from './add-centralstorecategory.component'

describe('AddCentralStoreCategoryComponent', () => {
  let component: AddCentralStoreCategoryComponent;
  let fixture: ComponentFixture<AddCentralStoreCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCentralStoreCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCentralStoreCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
