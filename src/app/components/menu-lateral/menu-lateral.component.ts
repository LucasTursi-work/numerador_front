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
      // 1. Extrai o CPF (sub) do Token JWT
      const payload = JSON.parse(atob(token.split('.')[1]));
      const cpfUsuario = payload.sub;

      if (cpfUsuario) {
        // 2. Chama o método buscarUsuario que você postou, passando o tipo 'cpf'
        this.UsuarioService.buscarUsuario(cpfUsuario, 'cpf', 0, 1).subscribe({
          next: (res: any) => {
            console.log('Resposta do Java:', res);
            // Como o endpoint de CPF retorna paginação ou array (UsuarioResponseDTO[]),
            // pegamos a primeira posição ou o conteúdo do Page
            const lista = res?.content || (Array.isArray(res) ? res : [res]);

            const usuario = res.content
              ? res.content[0]
              : Array.isArray(res)
                ? res[0]
                : res;

            if (lista && lista.length > 0 && lista[0]?.nome) {
              this.nomeUsuario = lista[0].nome;
            } else {
              this.nomeUsuario = 'Usuário';
            }
          },
          error: (err: any) => {
            console.error('Erro ao buscar o nome do usuário pelo CPF:', err);
            this.nomeUsuario = 'Usuário';
          },
        });
      }
    } catch (e) {
      console.error('Erro ao descriptografar token:', e);
      this.nomeUsuario = 'Usuário';
    }
  }
}
