import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCentralStoreComponent } from './view-centralstore.component';

describe('ViewCentralStoreComponent', () => {
  let component: ViewCentralStoreComponent;
  let fixture: ComponentFixture<ViewCentralStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCentralStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCentralStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
