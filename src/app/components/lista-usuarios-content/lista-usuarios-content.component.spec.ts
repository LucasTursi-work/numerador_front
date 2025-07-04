import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaUsuariosContentComponent } from './lista-usuarios-content.component';

describe('ListaUsuariosContentComponent', () => {
  let component: ListaUsuariosContentComponent;
  let fixture: ComponentFixture<ListaUsuariosContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaUsuariosContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaUsuariosContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
