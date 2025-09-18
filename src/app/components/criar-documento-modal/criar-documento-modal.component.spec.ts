import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarDocumentoModalComponent } from './criar-documento-modal.component';

describe('CriarDocumentoModalComponent', () => {
  let component: CriarDocumentoModalComponent;
  let fixture: ComponentFixture<CriarDocumentoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriarDocumentoModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriarDocumentoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
