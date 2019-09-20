import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageviewerCounterProductComponent } from './image-viewer-counterproduct.component';

describe('ImageviewerCounterProductComponent', () => {
  let component: ImageviewerCounterProductComponent;
  let fixture: ComponentFixture<ImageviewerCounterProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageviewerCounterProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageviewerCounterProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
