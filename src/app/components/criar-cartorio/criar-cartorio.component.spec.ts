import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarCartorioComponent } from './criar-cartorio.component';

describe('CriarCartorioComponent', () => {
  let component: CriarCartorioComponent;
  let fixture: ComponentFixture<CriarCartorioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriarCartorioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriarCartorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
