import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosRelatorioComponent } from './filtros-relatorios.component';

describe('FiltrosRelatorioComponent', () => {
  let component: FiltrosRelatorioComponent;
  let fixture: ComponentFixture<FiltrosRelatorioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltrosRelatorioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FiltrosRelatorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
