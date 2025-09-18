import { PerfilUsuario, StatusUsuario } from '../../enums/user-enums';

export interface DocumentoResponseDto {
  idDocumento: number;
  numero: number;
  dataCadastro: string; // Ou Date se converter
  usuario: UsuarioSimplificadoDTO; // Versão simplificada do usuário
  tipoDocumento: TipoDocumentoDTO;
  cartorio: CartorioDTO;
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
