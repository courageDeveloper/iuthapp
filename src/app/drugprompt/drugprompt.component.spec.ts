import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugpromptComponent } from './drugprompt.component';

describe('DrugpromptComponent', () => {
  let component: DrugpromptComponent;
  let fixture: ComponentFixture<DrugpromptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugpromptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugpromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
