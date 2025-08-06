import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashNumeradorComponent } from './dash-numerador.component';

describe('DashNumeradorComponent', () => {
  let component: DashNumeradorComponent;
  let fixture: ComponentFixture<DashNumeradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashNumeradorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashNumeradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
