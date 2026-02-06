
import React, { useState, useEffect } from 'react';
import { ProductType, MovementType, Size, InventoryMovement } from '../types';

interface EntryFormProps {
  onSubmit: (movement: Omit<InventoryMovement, 'id' | 'date'>) => void;
  onCancel: () => void;
  initialData?: InventoryMovement;
}

const EntryForm: React.FC<EntryFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [productType, setProductType] = useState<ProductType>(initialData?.productType || ProductType.CAMISETA);
  const [type, setType] = useState<MovementType>(initialData?.type || MovementType.PEDIDO);
  const [size, setSize] = useState<Size>(initialData?.size || 'M');
  const [quantity, setQuantity] = useState<string>(initialData?.quantity?.toString() || '');
  const [notes, setNotes] = useState<string>(initialData?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) return;

    onSubmit({
      productType,
      type,
      size,
      quantity: qty,
      notes: notes.trim()
    });
  };

  const sizesList: Size[] = ['4', '6', '8', '10', '12', 'P', 'M', 'G', 'GG', 'XG'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Produto</label>
        <select 
          value={productType}
          onChange={(e) => setProductType(e.target.value as ProductType)}
          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
        >
          {Object.values(ProductType).map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Operação</label>
        <select 
          value={type}
          onChange={(e) => setType(e.target.value as MovementType)}
          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
        >
          {Object.values(MovementType).map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <p className="mt-1 text-[10px] text-slate-400 italic">
          {type === MovementType.PEDIDO && "* Define o total do lote solicitado."}
          {type === MovementType.CORTE && "* Registra as peças que saíram do corte."}
          {type === MovementType.PRODUCAO && "* Registra as peças que foram costuradas/finalizadas."}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tamanho</label>
          <select 
            value={size}
            onChange={(e) => setSize(e.target.value as Size)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          >
            {sizesList.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Quantidade</label>
          <input 
            type="number"
            required
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Ex: 50"
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Observações (Opcional)</label>
        <textarea 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-20 resize-none"
          placeholder="Ex: Lote extra, tecido azul..."
        ></textarea>
      </div>

      <div className="pt-4 flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm"
        >
          {initialData ? 'Atualizar' : 'Salvar'}
        </button>
      </div>
    </form>
  );
};

export default EntryForm;
