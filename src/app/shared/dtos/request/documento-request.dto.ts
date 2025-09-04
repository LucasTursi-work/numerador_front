export interface UsuarioRequestDto {
  id?: number;
  nome?: string;
  // Adicione outros campos de usuário aqui conforme a necessidade
}

export interface TipoDocumentoRequestDto {
  id: number;
  nome?: string;
  status?: string;
}

export interface CartorioRequestDto {
  id: number;
  nome?: string;
  cartorioAtivo?: boolean;
}

export interface DocumentoUpdateRequestDto {
  idDocumento?: number;
  numero?: number;
  dataCadastro?: string;
  usuario?: UsuarioRequestDto;
  tipoDocumento?: TipoDocumentoRequestDto;
  cartorio?: CartorioRequestDto;
}
