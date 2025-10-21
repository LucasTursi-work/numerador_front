import { PerfilUsuario, StatusUsuario } from '../../enums/user-enums';

export interface DocumentoResponseDto {
  id: number;
  numero: number;
  dataCadastro: string; // Ou Date se converter
  usuarioId: number;
  nomeUsuario: string;
  tipoDocumentoId: number;
  nomeTipoDocumento: string; // O CAMPO CRÍTICO PARA O NOME
  cartorioId: number;
  nomeCartorio: string;
}

// Versão simplificada do usuário (ajustada ao que você já tem)
export interface UsuarioSimplificadoDTO {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  perfil: PerfilUsuario;
  status: StatusUsuario;
}

export interface TipoDocumentoDTO {
  id: number;
  nome: string;
  status: PerfilUsuario; // Ou use um enum se existir
}

export interface CartorioDTO {
  id: number;
  nome: string;
  cartorioAtivo: boolean;
}
