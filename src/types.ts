export enum ProductType {
  BERMUDA = 'Bermuda',
  CAMISETA = 'Camiseta'
}

export enum MovementType {
  PEDIDO = 'Pedido (Meta)',
  CORTE = 'Corte (Matéria-prima)',
  PRODUCAO = 'Produção (Finalizado)'
}

export type Size = '4' | '6' | '8' | '10' | '12' | 'M' | 'G' | 'GG' ;

export interface InventoryMovement {
  id: string;
  date: string;
  productType: ProductType;
  size: Size;
  type: MovementType;
  quantity: number;
  notes?: string;
}

export interface SummaryRow {
  productType: ProductType;
  size: Size;
  totalPedido: number;
  totalCortado: number;
  totalProduzido: number;
  saldoEmCorte: number;
  quantidadeFalta: number;
  quantidadeFaltaCortar: number;
}
