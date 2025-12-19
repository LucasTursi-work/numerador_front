import { PerfilUsuario, StatusUsuario } from '../../enums/user-enums';

export interface UsuarioResponseDTO {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  perfil: PerfilUsuario;
  status: StatusUsuario;
  dataCadastro: string; // Ou Date se converter
  dataLogin?: string;
  codigoValidador: string;
} //checar coerência do DTO na aplicação da edição do patch de usuário

export interface PageableResponse {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

export interface UsuariosPaginadosResponse {
  content: UsuarioResponseDTO[];
  pageable: PageableResponse;
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
