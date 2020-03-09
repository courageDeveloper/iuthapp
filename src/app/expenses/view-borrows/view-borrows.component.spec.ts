import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBorrowsComponent } from './view-borrows.component';

describe('ViewBorrowsComponent', () => {
  let component: ViewBorrowsComponent;
  let fixture: ComponentFixture<ViewBorrowsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBorrowsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBorrowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
