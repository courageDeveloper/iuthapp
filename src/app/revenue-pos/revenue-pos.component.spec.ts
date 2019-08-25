import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenuePosComponent } from './revenue-pos.component';

describe('RevenuePosComponent ', () => {
  let component: RevenuePosComponent;
  let fixture: ComponentFixture<RevenuePosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevenuePosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenuePosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
