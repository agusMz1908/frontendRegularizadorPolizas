export interface ClientDto {
  id: number;
  clinom: string;
  cliruc: string;
  clidir: string;
  clitel?: string;
  cliemail?: string;
}

export interface ClientSearchParams {
  filtro: string;
  page?: number;
  limit?: number;
}

export interface ClientSearchResponse {
  clients: ClientDto[];
  total: number;
  page: number;
  totalPages: number;
}