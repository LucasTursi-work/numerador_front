import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../modules/auth/auth.service';
import { LoginRequestDto } from '../../shared/dtos/request/login-request.dto';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './splash.component.html',
  styleUrl: './splash.component.scss',
})
export class SplashComponent {
  // PROPRIEDADES DE ESTADO
  cpf: string = '';
  senha: string = '';
  loginErro: boolean = false; // Para exibir mensagens de erro

  constructor(private router: Router, private authService: AuthService) {}

  // 💡 FUNÇÃO DE LOGIN - Substitui navDashboard()
  fazerLogin() {
    this.loginErro = false;

    // 1. Constrói o DTO
    const credenciais: LoginRequestDto = {
      cpf: this.cpf,
      senha: this.senha,
    };
    // 2. Chama o AuthService
    this.authService.login(credenciais).subscribe({
      next: (resposta) => {
        console.log('Login bem-sucedido. Usuário:', resposta.nome);
        // 3. Navega para o dashboard (sucesso)
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Erro de login:', err);
        // 4. Exibe a mensagem de erro no template
        this.loginErro = true;
        alert('CPF ou senha inválidos. Tente novamente.');
      },
    });
  }
  // Manter para o primeiro acesso, se for uma navegação simples
  navCadastrarNovo() {
    this.router.navigate(['/cadastro-publico']); // Ajuste o caminho conforme necessário
  }
}
