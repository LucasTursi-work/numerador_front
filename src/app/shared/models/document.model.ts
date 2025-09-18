import { DocumentoResponseDto } from '../../shared/dtos/response/documento-response.dto';

export interface DocumentoNumerador {
  nome: string;
  contador: 0;
}
export interface Documento {
  id: number;
  nome: string; // Mapeia para tipoDocumento.nome
  contador: number; // Mapeia para numero
  status: string; // Mapeia para tipoDocumento.status
  // Apenas campos usados no componente
}
export class Documento {
  constructor(
    public id: number,
    public nome: string,
    public contador: number,
    public dataCriacao: Date // Já convertido de string
  ) {}

  // Método de instância (exemplo)
  public incrementarContador(): void {
    this.contador++;
  }

  // Método estático para conversão
  public static fromDTO(dto: DocumentoResponseDto): Documento {
    return new Documento(
      dto.idDocumento,
      dto.tipoDocumento.nome,
      dto.numero,
      new Date(dto.dataCadastro) // Conversão de tipos
    );
  }
}
