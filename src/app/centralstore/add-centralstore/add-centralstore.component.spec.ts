import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCentralStoreComponent } from './add-centralstore.component'

describe('AddCentralStoreComponent', () => {
  let component: AddCentralStoreComponent;
  let fixture: ComponentFixture<AddCentralStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCentralStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCentralStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
