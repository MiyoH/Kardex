
import React from 'react';
import { SummaryRow } from '../types';
import { 
  ClipboardList, 
  AlertTriangle, 
  ArrowRight
} from 'lucide-react';

interface SyntheticViewProps {
  data: SummaryRow[];
}

const SyntheticView: React.FC<SyntheticViewProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 bg-white border-2 border-dashed border-slate-200 rounded-3xl">
        <div className="bg-slate-50 p-4 rounded-full mb-4 text-slate-300">
          <ClipboardList className="w-12 h-12" />
        </div>
        <h3 className="text-lg font-medium text-slate-900">Nenhum dado disponível</h3>
        <p className="text-slate-500 text-sm text-center max-w-xs mt-1">
          Clique em "Novo Registro" para começar a alimentar o sistema de produção.
        </p>
      </div>
    );
  }

  const grouped = data.reduce((acc, row) => {
    const key = row.productType as string;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(row);
    return acc;
  }, {} as Record<string, SummaryRow[]>);

  return (
    <div className="space-y-12">
      {Object.entries(grouped).map(([productType, rows]) => {
        const totalPedidoProduct = rows.reduce((acc, curr) => acc + curr.totalPedido, 0);
        const totalFaltaCorteProduct = rows.reduce((acc, curr) => acc + curr.quantidadeFaltaCortar, 0);
        const totalCorteProduct = rows.reduce((acc, curr) => acc + curr.totalCortado, 0);
        const totalProduzidoProduct = rows.reduce((acc, curr) => acc + curr.totalProduzido, 0);
        const totalFaltaProduct = rows.reduce((acc, curr) => acc + curr.quantidadeFalta, 0);
        const totalSaldoCorteProduct = rows.reduce((acc, curr) => acc + curr.saldoEmCorte, 0);

        return (
          <section key={productType} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-slate-900">{productType}s</h3>
                <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                  Tabela Resumo
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
                    <th className="px-6 py-4 border-b">Tamanho</th>
                    <th className="px-6 py-4 border-b">Qtd. Pedido</th>
                    <th className="px-6 py-4 border-b text-red-600 font-black">Falta Cortar</th>
                    <th className="px-6 py-4 border-b">Saldo em Corte</th>
                    <th className="px-6 py-4 border-b">Qtd. Produzida</th>
                    <th className="px-6 py-4 border-b text-red-600 font-black">Falta Produzir</th>
                    <th className="px-6 py-4 border-b text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {rows.map((row, idx) => {
                    const progress = row.totalPedido > 0 
                      ? Math.round((row.totalProduzido / row.totalPedido) * 100) 
                      : 0;

                    return (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded text-xs">
                            {row.size}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-700">{row.totalPedido}</td>
                        <td className="px-6 py-4">
                          <span className={`font-black text-sm ${row.quantidadeFaltaCortar > 0 ? 'text-red-600' : 'text-emerald-500'}`}>
                            {row.quantidadeFaltaCortar === 0 ? 'OK' : row.quantidadeFaltaCortar}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-semibold ${row.saldoEmCorte > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
                            {row.saldoEmCorte}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-emerald-600">{row.totalProduzido}</span>
                            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-emerald-500 transition-all duration-500" 
                                style={{ width: `${Math.min(100, progress)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-black text-sm text-red-600">
                          {row.quantidadeFalta === 0 ? (
                            <span className="text-emerald-500 font-bold text-xs">CONCLUÍDO</span>
                          ) : (
                            row.quantidadeFalta
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            {row.quantidadeFalta === 0 ? (
                              <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                <ArrowRight className="w-4 h-4" />
                              </div>
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                                <AlertTriangle className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-blue-600 text-white font-bold border-t-2 border-blue-700 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
                  <tr>
                    <td className="px-6 py-4 uppercase text-[10px] tracking-widest text-blue-50">Total {productType}</td>
                    <td className="px-6 py-4 text-white">{totalPedidoProduct}</td>
                    <td className="px-6 py-4 text-white font-black">{totalFaltaCorteProduct}</td>
                    <td className="px-6 py-4 text-amber-100">{totalSaldoCorteProduct}</td>
                    <td className="px-6 py-4 text-emerald-100">{totalProduzidoProduct}</td>
                    <td className="px-6 py-4 text-white font-black">{totalFaltaProduct}</td>
                    <td className="px-6 py-4"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default SyntheticView;
