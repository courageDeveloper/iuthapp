import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchFormCentralStoreComponent } from './dispatch-form-centralstore.component'

describe('DispatchFormCentralStoreComponent', () => {
  let component: DispatchFormCentralStoreComponent;
  let fixture: ComponentFixture<DispatchFormCentralStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DispatchFormCentralStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchFormCentralStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
