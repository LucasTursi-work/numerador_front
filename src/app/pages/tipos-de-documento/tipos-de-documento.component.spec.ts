import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposDeDocumentoComponent } from './tipos-de-documento.component';

describe('TiposDeDocumentoComponent', () => {
  let component: TiposDeDocumentoComponent;
  let fixture: ComponentFixture<TiposDeDocumentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiposDeDocumentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiposDeDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
