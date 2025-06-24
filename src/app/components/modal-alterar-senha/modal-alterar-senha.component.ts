import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { UsuarioService } from '../../modules/user/services/user.service';
import { CommonModule } from '@angular/common';
import { AlterarSenhaRequestDTO } from '../../shared/dtos/request/alterar-senha.dto';

@Component({
  selector: 'app-modal-alterar-senha',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-alterar-senha.component.html',
  styleUrl: './modal-alterar-senha.component.scss',
})
export class ModalAlterarSenhaComponent {
  form: FormGroup;
  erro: string = '';
  sucesso: string = '';

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService) {
    this.form = this.fb.group({
      senhaAtual: ['', Validators.required],
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required],
    });
  }

  onSubmit(): void {
    this.erro = '';
    this.sucesso = '';

    const { senhaAtual, novaSenha, confirmarSenha } = this.form.value;

    if (novaSenha !== confirmarSenha) {
      this.erro = 'As senhas novas não coincidem.';
      return;
    }

    const dto: AlterarSenhaRequestDTO = {
      senhaAtual,
      novaSenha,
      confirmarSenha,
    };

    this.usuarioService.alterarSenha(dto).subscribe({
      next: (resposta) => {
        this.sucesso = 'Senha alterada com sucesso!';
        this.form.reset();
      },
      error: (err) => {
        console.error(err);
        this.erro = 'Erro ao alterar senha. Verifique os dados.';
      },
    });
  }
}
