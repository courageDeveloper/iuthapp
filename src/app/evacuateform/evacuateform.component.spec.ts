import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvacuateformComponent } from './evacuateform.component';

describe('EvacuateformComponent', () => {
  let component: EvacuateformComponent;
  let fixture: ComponentFixture<EvacuateformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvacuateformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvacuateformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
