import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCentralStoreBcComponent} from './add-centralstore_bc.component'

describe('AddCentralStoreBcComponent', () => {
  let component: AddCentralStoreBcComponent;
  let fixture: ComponentFixture<AddCentralStoreBcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCentralStoreBcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCentralStoreBcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
