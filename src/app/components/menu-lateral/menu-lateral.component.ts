import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../modules/auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsuarioService } from '../../modules/user/services/user.service';
import { CriarCartorioComponent } from '../criar-cartorio/criar-cartorio.component';
import { CriarTipoDocumentoComponent } from '../criar-tipo-documento/criar-tipo-documento.component';
import {
  ModalComunicacaoService,
  TipoModal,
} from '../../modules/navigation/navigation.service';

@Component({
  selector: 'app-menu-lateral',
  standalone: true,
  imports: [],
  templateUrl: './menu-lateral.component.html',
  styleUrl: './menu-lateral.component.scss',
})
export class MenuLateralComponent implements OnInit {
  constructor(
    private router: Router,
    private modalComService: ModalComunicacaoService,
    private authService: AuthService,
    private UsuarioService: UsuarioService,
  ) {}

  public ehAdmin: boolean = false;
  public nomeUsuario: string = '';

  ngOnInit(): void {
    this.ehAdmin = this.authService.isAdmin();
    this.obterNomeDoUsuario();
  }
  navDashboard() {
    this.router.navigate(['/dashboard']);
  }
  navListaUsuarios() {
    this.router.navigate(['/listaUsuarios']);
  }
  navTiposDocumentos() {
    this.router.navigate(['/tiposDocumentos']);
  }
  navCartCad() {
    this.router.navigate(['/cartoriosCadastrados']);
  }
  navModalDocumento() {
    this.modalComService.abrirModal('documento');
  }
  navModalCartorio() {
    this.modalComService.abrirModal('cartorio');
  }
  navLogOut() {
    this.authService.logout();
    this.router.navigate(['']);
  }

  private obterNomeDoUsuario(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.nomeUsuario = 'Usuário';
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const cpfUsuario = payload.sub;

      if (!cpfUsuario) {
        this.nomeUsuario = 'Usuário';
        return;
      }

      this.UsuarioService.buscarUsuario(cpfUsuario, 'cpf').subscribe({
        next: (usuario: any) => {
          console.log('Usuário direto do Java:', usuario);

          // Como o endpoint retorna o objeto direto, basta ler a propriedade .nome
          if (usuario && usuario.nome) {
            this.nomeUsuario = usuario.nome;
          } else {
            this.nomeUsuario = 'Usuário';
          }
        },
        error: (err: any) => {
          console.error('Erro ao buscar o nome do usuário pelo CPF:', err);
          this.nomeUsuario = 'Usuário';
        },
      });
    } catch (e) {
      console.error('Erro ao descriptografar token:', e);
      this.nomeUsuario = 'Usuário';
    }
  }
}
