import { DocumentoResponseDto } from '../../shared/dtos/response/documento-response.dto';

export class DocumentoModel {
  constructor(
    public id: number,
    public nome: string,
    public contador: number,
    public dataCriacao: Date // Já convertido de string
  ) {}

  // Método de instância (exemplo)
  /*public incrementarContador(): void {
    this.contador++;
  }
*/
  // Método estático para conversão
  public static fromDTO(dto: DocumentoResponseDto): DocumentoModel {
    return new DocumentoModel(
      dto.id,
      dto.nomeTipoDocumento,
      dto.numero,
      new Date(dto.dataCadastro) // Conversão de tipos
    );
  }
}
