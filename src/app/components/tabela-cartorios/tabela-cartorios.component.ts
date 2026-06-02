import {
  Component,
  OnInit,
  inject,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../modules/auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CartorioService } from '../../modules/cartorio/cartorio.service';
//import { BotaoComponent } from '../../components/botao/botao.component';
import { CartorioDTO } from '../../shared/dtos/response/cartorio-response.dto';

@Component({
  selector: 'app-tabela-cartorios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabela-cartorios.component.html',
  styleUrl: './tabela-cartorios.component.scss',
})
export class TabelaCartoriosComponent implements OnInit {
  // Mantemos o @Input caso a lista venha de um componente pai (Smart Component)
  @Input() dados: CartorioDTO[] = [];
  @Output() aoEditar = new EventEmitter<CartorioDTO>();
  @Output() aoExcluir = new EventEmitter<number>();
  @Output() aoMudarStatus = new EventEmitter<CartorioDTO>();

  private modalService = inject(NgbModal);
  // 1. Correção do nome da propriedade injetada
  public cartorioService = inject(CartorioService);
  private authService = inject(AuthService);
  public ehAdmin: boolean = false;

  ngOnInit(): void {
    // Se o componente pai não passou dados via @Input, usamos o estado do serviço
    if (!this.dados || this.dados.length === 0) {
      this.escutarEstadoServico();
      this.ehAdmin = this.authService.isAdmin();
      /* tentar carregar a lista na inicialização do componente e não mais da aplicação, 
        para que a requisição entre depois de já ter armazenado o token*/
      this.cartorioService.carregarCartorios();
    }
  }

  carregarCartorios() {
    this.cartorioService.cartorios$.subscribe({
      next: (res: any) => {
        // Trata o retorno se for a estrutura Page do Spring Boot
        this.dados = res.content || (Array.isArray(res) ? res : []);
        //this.dados = this.listaCartorios;
      },
    });
  }
  /**
   * Padrão Reativo: Se inscreve no BehaviorSubject do serviço.
   * Assim, qualquer alteração (excluir/mudar status) atualiza a tela automaticamente.
   */
  private escutarEstadoServico(): void {
    this.cartorioService.cartorios$.subscribe({
      next: (lista) => {
        // Trata caso o backend devolva uma paginação (Page do Spring) ou array direto
        const res: any = lista;
        this.dados = res.content || (Array.isArray(res) ? res : []);
        console.log('Cartórios renderizados na tabela:', this.dados);
      },
    });
  }

  /**
   * Altera o status usando o padrão booleano 'cartorioAtivo' do seu DTO
   */
  toggleStatus(cartorio: CartorioDTO): void {
    if (!this.ehAdmin) return; //só muda status se for admin
    // O backend Java espera apenas o ID para dar o PATCH e inverter o booleano
    this.cartorioService.alternarStatus(cartorio.id).subscribe({
      next: () => {
        // Como o serviço dá um 'tap' chamando 'carregarCartorios()',
        // a lista global mudará e o nosso 'subscribe' no OnInit atualizará a tela!
        this.aoMudarStatus.emit(cartorio);
      },
      error: (err) => console.error('Erro ao mudar status do cartório:', err),
    });
  }

  /**
   * Solicita a exclusão ao serviço
   */
  excluir(id: number) {
    if (!this.ehAdmin) return; //só exclui se for admin
    if (confirm('Tem certeza que deseja excluir este cartório?')) {
      this.cartorioService.deletarCartorio(id).subscribe({
        next: () => {
          this.aoExcluir.emit(id);
          // O próprio serviço poderia recarregar, ou removemos localmente se preferir:
          this.dados = this.dados.filter((c) => c.id !== id);
        },
        error: (err) => console.error('Erro ao deletar cartório:', err),
      });
    }
  }

  // O método de editar descomentaremos assim que você criar o ModalEditarCartorio!
}
