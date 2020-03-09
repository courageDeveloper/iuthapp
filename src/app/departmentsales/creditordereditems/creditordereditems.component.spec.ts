import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditOrderedItemsComponent } from './creditordereditems.component';

describe('CreditOrderedItemsComponent', () => {
  let component: CreditOrderedItemsComponent;
  let fixture: ComponentFixture<CreditOrderedItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditOrderedItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditOrderedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
