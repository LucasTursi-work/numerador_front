import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';
import { RelatoriosOutputComponent } from '../../components/relatorios/relatorios-output/relatorios-output.component';
import { FiltrosRelatorioComponent } from '../../components/relatorios/filtros-relatorios/filtros-relatorios.component';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [
    RelatoriosOutputComponent,
    HeaderComponent,
    MenuLateralComponent,
    FiltrosRelatorioComponent,
    FiltrosRelatorioComponent,
  ],
  templateUrl: './relatorios.component.html',
  styleUrl: './relatorios.component.scss',
})
export class RelatoriosComponent {}
