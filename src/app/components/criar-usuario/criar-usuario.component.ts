import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { UsuarioService } from '../../modules/user/services/user.service';
import { CreateUsuarioRequestDTO } from '../../shared/dtos/request/create-user.dto';
import { PerfilUsuario } from '../../shared/enums/user-enums';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-criar-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // 👈 ReactiveFormsModule aqui
  templateUrl: './criar-usuario.component.html',
  styleUrl: './criar-usuario.component.scss',
})
export class CriarUsuarioComponent {
  perfis = Object.values(PerfilUsuario);
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    public activeModal: NgbActiveModal
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      cpf: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(\d{3}\.?\d{3}\.?\d{3}-?\d{2}|\d{11})$/),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      perfil: [PerfilUsuario.USUARIO, Validators.required],
      codigoValidador: [''],
    });
  }

  formatarCpf(event: any) {
    let valor = event.target.value.replace(/\D/g, ''); // Remove tudo que não é número

    if (valor.length <= 11) {
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
      valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }

    // Atualiza o valor no formulário com a máscara
    this.form.get('cpf')?.setValue(valor, { emitEvent: false });
  }

  onSubmit() {
    if (this.form.valid) {
      const dto: CreateUsuarioRequestDTO = this.form.value;
      const dadosParaEnviar = {
        ...this.form.value,
        cpf: this.form.value.cpf.replace(/\D/g, ''),
      };
      this.usuarioService.criarUsuario(dto).subscribe({
        next: (response) => {
          console.log('Usuário criado com sucesso!', response);
          this.activeModal.close('salvo'); // 3. ESSA LINHA fecha o modal
        },
        error: (err) => {
          console.error('Erro ao criar usuário:', err);
        },
      });
    } else {
      console.error('Formulário inválido!', this.form.errors);
      // Dica: Se o botão está habilitado mas não entra no subscribe,
      // é porque o formulário caiu aqui no else.
    }
  }
}
