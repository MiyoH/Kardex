
import React, { useState } from 'react';
import { InventoryMovement, MovementType } from './types';
import { 
  Calendar, 
  Trash2, 
  Search,
  Edit3
} from 'lucide-react';

interface AnalyticViewProps {
  data: InventoryMovement[];
  onDelete: (id: string) => void;
  onEdit: (movement: InventoryMovement) => void;
}

const AnalyticView: React.FC<AnalyticViewProps> = ({ data, onDelete, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(m => 
    m.productType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBadgeStyles = (type: MovementType) => {
    switch (type) {
      case MovementType.PEDIDO:
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case MovementType.CORTE:
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case MovementType.PRODUCAO:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
        <input 
          type="text" 
          placeholder="Pesquisar no histórico..." 
          className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm text-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black">
                <th className="px-6 py-5 border-b">Data / Hora</th>
                <th className="px-6 py-5 border-b">Produto</th>
                <th className="px-6 py-5 border-b">Operação</th>
                <th className="px-6 py-5 border-b">Tam.</th>
                <th className="px-6 py-5 border-b text-right">Qtd.</th>
                <th className="px-6 py-5 border-b">Observações</th>
                <th className="px-6 py-5 border-b text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length > 0 ? (
                filteredData.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(m.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">
                      {m.productType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border tracking-widest ${getBadgeStyles(m.type)}`}>
                        {m.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-slate-900 text-white px-2 py-1 rounded-md text-xs font-black">
                        {m.size}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-black text-slate-800 text-base">
                      {m.quantity}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-500 italic max-w-[180px] truncate" title={m.notes}>
                        {m.notes || '—'}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button 
                          type="button"
                          onClick={() => onEdit(m)}
                          className="bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-600 p-2.5 rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center group"
                          title="Editar"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => onDelete(m.id)}
                          className="bg-red-50 hover:bg-red-600 hover:text-white text-red-600 p-2.5 rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center group"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Search className="w-8 h-8 opacity-20" />
                      <p className="font-medium italic">Nenhum registro encontrado.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticView;
