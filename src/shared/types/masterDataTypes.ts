export interface CategoriaDto {
  id: number;
  catdsc: string;
}

export interface DestinoDto {
  id: number;
  desnom: string;
}

export interface CalidadDto {
  id: number;
  caldsc: string;
}

export interface CombustibleDto {
  id: string;
  name: string;
}

export interface MonedaDto {
  id: number;
  nombre: string;
  simbolo?: string;
}

export interface DepartamentoDto {
  id: number;
  nombre: string;
}

export interface TarifaDto {
  id: number;
  companiaId: number;
  nombre: string;
  descripcion?: string;
  activa: boolean;
}

export interface MasterDataDto {
  categorias: CategoriaDto[];
  destinos: DestinoDto[];
  calidades: CalidadDto[];
  combustibles: CombustibleDto[];
  monedas: MonedaDto[];
  departamentos: DepartamentoDto[];
  tarifas: TarifaDto[];
}