import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BacktotopComponent } from './backtotop.component';

describe('BacktotopComponent', () => {
  let component: BacktotopComponent;
  let fixture: ComponentFixture<BacktotopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BacktotopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BacktotopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
