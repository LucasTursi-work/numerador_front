import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatoriosLogicaComponent } from './relatorios-logica.component';

describe('RelatoriosLogicaComponent', () => {
  let component: RelatoriosLogicaComponent;
  let fixture: ComponentFixture<RelatoriosLogicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatoriosLogicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatoriosLogicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
