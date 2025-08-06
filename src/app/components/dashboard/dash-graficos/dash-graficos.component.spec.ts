import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashGraficosComponent } from './dash-graficos.component';

describe('DashGraficosComponent', () => {
  let component: DashGraficosComponent;
  let fixture: ComponentFixture<DashGraficosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashGraficosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashGraficosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
