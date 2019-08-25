import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDispatchCentralStoreComponent } from './view-dispatch-centralstore.component';

describe('ViewDispatchComponent', () => {
  let component: ViewDispatchCentralStoreComponent;
  let fixture: ComponentFixture<ViewDispatchCentralStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDispatchCentralStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDispatchCentralStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
