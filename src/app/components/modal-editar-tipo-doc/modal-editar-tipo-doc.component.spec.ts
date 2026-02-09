import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarTipoDocComponent } from './modal-editar-tipo-doc.component';

describe('ModalEditarTipoDocComponent', () => {
  let component: ModalEditarTipoDocComponent;
  let fixture: ComponentFixture<ModalEditarTipoDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditarTipoDocComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditarTipoDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
