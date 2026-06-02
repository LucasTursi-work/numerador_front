import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabelaCartoriosComponent } from './tabela-cartorios.component';

describe('TabelaCartoriosComponent', () => {
  let component: TabelaCartoriosComponent;
  let fixture: ComponentFixture<TabelaCartoriosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabelaCartoriosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabelaCartoriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
