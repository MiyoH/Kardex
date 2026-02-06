
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  PlusCircle, 
  LayoutDashboard, 
  History, 
  Shirt, 
  Scissors, 
  ClipboardList,
  Package
} from 'lucide-react';
import { ProductType, MovementType, Size, InventoryMovement, SummaryRow } from './types';
import EntryForm from './components/EntryForm';
import SyntheticView from './components/SyntheticView';
import AnalyticView from './components/AnalyticView';

const App: React.FC = () => {
  // Inicializa o estado a partir do localStorage para não perder dados ao atualizar
  const [movements, setMovements] = useState<InventoryMovement[]>(() => {
    const saved = localStorage.getItem('kardex_movements');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeTab, setActiveTab] = useState<'synthetic' | 'analytic'>('synthetic');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMovement, setEditingMovement] = useState<InventoryMovement | null>(null);

  // Salva no localStorage sempre que houver mudança
  useEffect(() => {
    localStorage.setItem('kardex_movements', JSON.stringify(movements));
  }, [movements]);

  const generateId = () => {
    return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleAddMovement = useCallback((newMovement: Omit<InventoryMovement, 'id' | 'date'>) => {
    const movement: InventoryMovement = {
      ...newMovement,
      id: generateId(),
      date: new Date().toISOString(),
    };
    setMovements(prev => [movement, ...prev]);
    setIsFormOpen(false);
  }, []);

  const handleUpdateMovement = useCallback((id: string, updatedData: Omit<InventoryMovement, 'id' | 'date'>) => {
    setMovements(prev => prev.map(m => m.id === id ? { ...m, ...updatedData } : m));
    setEditingMovement(null);
    setIsFormOpen(false);
  }, []);

  // FUNÇÃO DE EXCLUSÃO SIMPLIFICADA (Sem confirmação conforme solicitado)
  const handleDeleteMovement = useCallback((id: string) => {
    setMovements(prevMovements => {
      const updated = prevMovements.filter(m => String(m.id) !== String(id));
      return [...updated];
    });
  }, []);

  const handleEditClick = useCallback((movement: InventoryMovement) => {
    setEditingMovement(movement);
    setIsFormOpen(true);
  }, []);

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingMovement(null);
  };

  const summaryData = useMemo(() => {
    const products = [ProductType.BERMUDA, ProductType.CAMISETA];
    const sizes: Size[] = ['4', '6', '8', '10', '12', 'P', 'M', 'G', 'GG', 'XG'];
    
    const rows: SummaryRow[] = [];

    products.forEach(product => {
      sizes.forEach(size => {
        const productMovements = movements.filter(m => m.productType === product && m.size === size);
        
        const totalPedido = productMovements
          .filter(m => m.type === MovementType.PEDIDO)
          .reduce((acc, curr) => acc + curr.quantity, 0);
          
        const totalCortado = productMovements
          .filter(m => m.type === MovementType.CORTE)
          .reduce((acc, curr) => acc + curr.quantity, 0);
          
        const totalProduzido = productMovements
          .filter(m => m.type === MovementType.PRODUCAO)
          .reduce((acc, curr) => acc + curr.quantity, 0);

        const saldoEmCorte = totalCortado - totalProduzido;
        const quantidadeFalta = Math.max(0, totalPedido - totalProduzido);
        const quantidadeFaltaCortar = Math.max(0, totalPedido - totalCortado);

        if (totalPedido > 0 || totalCortado > 0 || totalProduzido > 0) {
          rows.push({
            productType: product,
            size: size,
            totalPedido,
            totalCortado,
            totalProduzido,
            saldoEmCorte,
            quantidadeFalta,
            quantidadeFaltaCortar
          });
        }
      });
    });

    return rows;
  }, [movements]);

  const globalTotals = useMemo(() => {
    return movements.reduce((acc, m) => {
      if (m.type === MovementType.PEDIDO) acc.pedido += m.quantity;
      if (m.type === MovementType.CORTE) acc.corte += m.quantity;
      if (m.type === MovementType.PRODUCAO) acc.producao += m.quantity;
      return acc;
    }, { pedido: 0, corte: 0, producao: 0 });
  }, [movements]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-indigo-200 shadow-lg">
              <Shirt className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Kardex Têxtil</h1>
          </div>
          
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95"
          >
            <PlusCircle className="w-5 h-5" />
            Lançar Produção
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
            <div className="bg-blue-100 p-4 rounded-2xl text-blue-600">
              <ClipboardList className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Pedidos</p>
              <p className="text-3xl font-black text-slate-900">{globalTotals.pedido}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
            <div className="bg-amber-100 p-4 rounded-2xl text-amber-600">
              <Scissors className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Cortado</p>
              <p className="text-3xl font-black text-slate-900">{globalTotals.corte}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
            <div className="bg-emerald-100 p-4 rounded-2xl text-emerald-600">
              <Package className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Produzido</p>
              <p className="text-3xl font-black text-slate-900">{globalTotals.producao}</p>
            </div>
          </div>
        </div>

        <div className="flex border-b border-slate-200 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('synthetic')}
            className={`flex items-center gap-2 px-8 py-4 font-bold text-sm transition-all border-b-2 whitespace-nowrap -mb-[2px] ${
              activeTab === 'synthetic' 
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' 
              : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Resumo por Tamanho
          </button>
          <button
            onClick={() => setActiveTab('analytic')}
            className={`flex items-center gap-2 px-8 py-4 font-bold text-sm transition-all border-b-2 whitespace-nowrap -mb-[2px] ${
              activeTab === 'analytic' 
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' 
              : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'
            }`}
          >
            <History className="w-4 h-4" />
            Histórico Detalhado
          </button>
        </div>

        <div>
          {activeTab === 'synthetic' ? (
            <SyntheticView data={summaryData} />
          ) : (
            <AnalyticView 
              data={movements} 
              onDelete={handleDeleteMovement} 
              onEdit={handleEditClick}
            />
          )}
        </div>
      </main>

      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-300">
            <div className="px-6 py-5 border-b flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                {editingMovement ? '📝 Editar Registro' : '➕ Novo Registro'}
              </h2>
              <button 
                onClick={handleCloseForm}
                className="bg-slate-100 p-2 rounded-full text-slate-400 hover:text-slate-900 transition-all hover:bg-slate-200"
              >
                <PlusCircle className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <div className="p-8">
              <EntryForm 
                onSubmit={editingMovement 
                  ? (data) => handleUpdateMovement(editingMovement.id, data) 
                  : handleAddMovement
                } 
                onCancel={handleCloseForm}
                initialData={editingMovement || undefined}
              />
            </div>
          </div>
        </div>
      )}

      <footer className="max-w-7xl mx-auto px-4 py-8 mt-12 border-t text-center">
        <p className="text-slate-400 font-medium text-sm">Kardex de Produção • v1.12 (Exclusão Direta)</p>
      </footer>
    </div>
  );
};

export default App;
