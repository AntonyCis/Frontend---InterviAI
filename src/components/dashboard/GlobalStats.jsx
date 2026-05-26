import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Crown, Activity, ArrowUpRight, Zap } from 'lucide-react';
import axios from 'axios';
import storeAuth from '../../context/storeAuth';

const GlobalStats = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = storeAuth();
  const URL_BACK = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${URL_BACK}/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(response.data);
      } catch (error) {
        console.error("Error en stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token, URL_BACK]);

  // Cálculo de proporción para una barra de progreso simple
  const total = (data?.stats?.usuarios || 0) + (data?.stats?.administradores || 0);
  const userPerc = total > 0 ? ((data?.stats?.usuarios / total) * 100).toFixed(0) : 0;

  return (
    <div className="space-y-6">
      {/* Header de la sección */}
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-headline font-bold text-primary-container dark:text-white tracking-tight">Métricas Globales</h2>
        <p className="text-on-surface-variant dark:text-slate-400 text-xs font-label tracking-widest uppercase">Análisis de rendimiento del sistema</p>
      </div>

      {/* Grid de KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Usuarios Totales */}
          <motion.div whileHover={{ y: -5 }} className="p-6 rounded-2xl bg-surface-container-low dark:bg-slate-900/70 border border-outline-variant/50 dark:border-slate-800 relative overflow-hidden group">
           <Zap className="absolute -right-4 -top-4 w-24 h-24 text-emerald-500/5 group-hover:text-emerald-500/10 transition-colors" />
           <div className="flex justify-between items-center mb-4">
              <div className="p-3 bg-secondary-container dark:bg-cyan-500/20 rounded-xl text-secondary dark:text-cyan-300"><Users size={20} /></div>
              <span className="flex items-center text-secondary dark:text-cyan-300 text-[10px] font-semibold bg-secondary-container/70 dark:bg-cyan-500/15 px-2 py-1 rounded-lg">
                <ArrowUpRight size={12}/> +12%
              </span>
           </div>
            <p className="text-on-surface-variant dark:text-slate-400 text-[10px] font-label uppercase tracking-widest">Audiencia Total</p>
            <h3 className="text-5xl font-bold text-on-surface dark:text-white mt-1">{data?.stats?.usuarios}</h3>
        </motion.div>

        {/* Card 2: Conversión (Simulada por ahora) */}
          <motion.div whileHover={{ y: -5 }} transition={{ delay: 0.1 }} className="p-6 rounded-2xl bg-surface-container-low dark:bg-slate-900/70 border border-outline-variant/50 dark:border-slate-800 relative overflow-hidden group">
           <Activity className="absolute -right-4 -top-4 w-24 h-24 text-blue-500/5 group-hover:text-blue-500/10 transition-colors" />
           <div className="flex justify-between items-center mb-4">
              <div className="p-3 bg-blue-500/15 rounded-xl text-blue-500"><Crown size={20} /></div>
              <span className="flex items-center text-blue-500 text-[10px] font-semibold bg-blue-500/10 px-2 py-1 rounded-lg">
                ESTABLE
              </span>
           </div>
            <p className="text-on-surface-variant dark:text-slate-400 text-[10px] font-label uppercase tracking-widest">Tasa de Retención</p>
            <h3 className="text-5xl font-bold text-on-surface dark:text-white mt-1">94<span className="text-2xl text-blue-500">%</span></h3>
        </motion.div>

        {/* Card 3: Admins */}
          <motion.div whileHover={{ y: -5 }} transition={{ delay: 0.2 }} className="p-6 rounded-2xl bg-surface-container-low dark:bg-slate-900/70 border border-outline-variant/50 dark:border-slate-800 relative overflow-hidden group">
           <BarChart3 className="absolute -right-4 -top-4 w-24 h-24 text-amber-500/5 group-hover:text-amber-500/10 transition-colors" />
           <div className="flex justify-between items-center mb-4">
              <div className="p-3 bg-amber-500/15 rounded-xl text-amber-500"><BarChart3 size={20} /></div>
           </div>
            <p className="text-on-surface-variant dark:text-slate-400 text-[10px] font-label uppercase tracking-widest">Staff Activo</p>
            <h3 className="text-5xl font-bold text-on-surface dark:text-white mt-1">{data?.stats?.administradores}</h3>
        </motion.div>
      </div>

      {/* Gráfico de Distribución Visual */}
        <div className="p-8 rounded-2xl bg-surface-container-low dark:bg-slate-900/70 border border-outline-variant/50 dark:border-slate-800">
        <div className="flex justify-between items-end mb-8">
            <div>
            <h4 className="text-xl font-headline font-bold text-primary-container dark:text-white">Distribución de Roles</h4>
            <p className="text-on-surface-variant dark:text-slate-400 text-[10px] font-label uppercase tracking-widest">Balance de cuentas en el sistema</p>
            </div>
            <div className="text-right">
            <span className="text-4xl font-bold text-secondary dark:text-cyan-400">{userPerc}%</span>
            <p className="text-[10px] font-label text-on-surface-variant dark:text-slate-400 uppercase">Son Usuarios Reales</p>
            </div>
        </div>

        {/* Barra de progreso estilizada */}
        <div className="w-full h-4 bg-surface dark:bg-slate-800 rounded-full overflow-hidden flex border border-outline-variant/40 dark:border-slate-700">
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${userPerc}%` }} 
              transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-secondary to-secondary-fixed dark:from-cyan-600 dark:to-cyan-400" 
            />
        </div>
        
        <div className="grid grid-cols-2 mt-6 gap-4">
          <div className="flex items-center gap-2 text-[10px] font-label text-on-surface-variant dark:text-slate-400 uppercase">
            <div className="w-2 h-2 rounded-full bg-secondary dark:bg-cyan-400" /> Usuarios ({data?.stats?.usuarios})
            </div>
          <div className="flex items-center gap-2 text-[10px] font-label text-on-surface-variant dark:text-slate-400 uppercase">
            <div className="w-2 h-2 rounded-full bg-amber-500" /> Admins ({data?.stats?.administradores})
            </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalStats;