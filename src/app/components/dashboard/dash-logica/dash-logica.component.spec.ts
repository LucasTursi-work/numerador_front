import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashLogicaComponent } from './dash-logica.component';

describe('DashLogicaComponent', () => {
  let component: DashLogicaComponent;
  let fixture: ComponentFixture<DashLogicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashLogicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashLogicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
