import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextScrollComponent } from './text-scroll.component';

describe('TextScrollComponent', () => {
  let component: TextScrollComponent;
  let fixture: ComponentFixture<TextScrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextScrollComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
