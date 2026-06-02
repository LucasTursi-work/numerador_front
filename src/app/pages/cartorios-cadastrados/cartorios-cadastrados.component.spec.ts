import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartoriosCadastradosComponent } from './cartorios-cadastrados.component';

describe('CartoriosCadastradosComponent', () => {
  let component: CartoriosCadastradosComponent;
  let fixture: ComponentFixture<CartoriosCadastradosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartoriosCadastradosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartoriosCadastradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
