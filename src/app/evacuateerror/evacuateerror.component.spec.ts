import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvacuateerrorComponent } from './evacuateerror.component';

describe('EvacuateerrorComponent', () => {
  let component: EvacuateerrorComponent;
  let fixture: ComponentFixture<EvacuateerrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvacuateerrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvacuateerrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
