import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarsHeaderComponent } from './cars-header.component';

describe('CarsHeaderComponent', () => {
  let component: CarsHeaderComponent;
  let fixture: ComponentFixture<CarsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarsHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
