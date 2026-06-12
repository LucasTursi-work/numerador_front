import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatoriosOutputComponent } from './relatorios-output.component';

describe('RelatoriosOutputComponent', () => {
  let component: RelatoriosOutputComponent;
  let fixture: ComponentFixture<RelatoriosOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatoriosOutputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatoriosOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
