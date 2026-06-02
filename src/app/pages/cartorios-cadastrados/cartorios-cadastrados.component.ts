import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';
import { HeaderComponent } from '../../components/header/header.component';
import { TabelaCartoriosComponent } from '../../components/tabela-cartorios/tabela-cartorios.component';

@Component({
  selector: 'app-cartorios-cadastrados',
  standalone: true,
  imports: [
    CommonModule,
    TabelaCartoriosComponent,
    MenuLateralComponent,
    HeaderComponent,
  ],
  templateUrl: './cartorios-cadastrados.component.html',
  styleUrl: './cartorios-cadastrados.component.scss',
})
export class CartoriosCadastradosComponent {}
