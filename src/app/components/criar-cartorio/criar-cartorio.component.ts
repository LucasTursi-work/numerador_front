import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { DocumentoService, CreateCartorioRequestDto } from '../../modules/documents/services/documents.service'; 
import { AuthService } from '../../modules/auth/auth.service';

@Component({
  selector: 'app-criar-cartorio',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './criar-cartorio.component.html',
  styleUrl: './criar-cartorio.component.scss',
})
export class CriarCartorioComponent implements OnInit {
  nomeCartorio: string = '';
  usuarioIdLogado: number | null = null;

  constructor(public activeModal: NgbActiveModal,private documentoService: DocumentoService,
    private authService: AuthService) {}

    ngOnInit(): void{
      this.authService.getUsuarioLogadoId().subscribe(id => { // <--- CORREÇÃO: Chamando o método do AuthService
      this.usuarioIdLogado = id;
    }
  salvarECadastrar() {}

  cancelar() {
    this.activeModal.dismiss('cancel');
  }
}
}
