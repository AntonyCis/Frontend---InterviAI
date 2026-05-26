import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, Loader2, Mail } from 'lucide-react';
import axios from 'axios';
import storeAuth from '../../context/storeAuth';

const UserTable = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = storeAuth();

  // Usamos tu variable de entorno
  const URL_BACK = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const getDashData = async () => {
      try {
        // Concatenamos con el endpoint de admin/dashboard que ya tienes
        const response = await axios.get(`${URL_BACK}/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(response.data);
      } catch (error) {
        console.error("Error al obtener datos del dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    getDashData();
  }, [token, URL_BACK]);

  if (loading) return (
    <div className="rounded-2xl border border-outline-variant/50 dark:border-slate-800 bg-surface-container-low dark:bg-slate-900/70 p-10 flex items-center justify-center gap-3 text-secondary dark:text-cyan-400">
      <Loader2 className="animate-spin" size={18} />
      <p className="text-sm font-medium">Cargando base de datos...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Tarjetas de Estadísticas Reales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="p-6 rounded-2xl bg-surface-container-low dark:bg-slate-900/70 border border-outline-variant/50 dark:border-slate-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant dark:text-slate-400">Total Usuarios</p>
              <h3 className="text-4xl font-bold text-on-surface dark:text-white mt-1">{data?.stats?.usuarios || 0}</h3>
            </div>
            <div className="p-4 bg-secondary-container dark:bg-cyan-500/20 rounded-xl text-secondary dark:text-cyan-300"><Users size={24}/></div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-surface-container-low dark:bg-slate-900/70 border border-outline-variant/50 dark:border-slate-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant dark:text-slate-400">Staff Admin</p>
              <h3 className="text-4xl font-bold text-on-surface dark:text-white mt-1">{data?.stats?.administradores || 0}</h3>
            </div>
            <div className="p-4 bg-amber-500/10 rounded-xl text-amber-500"><Shield size={24}/></div>
          </div>
        </motion.div>
      </div>

      {/* Tabla de Usuarios Recientes */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-surface-container-low dark:bg-slate-900/70 border border-outline-variant/50 dark:border-slate-800 rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-outline-variant/30 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-headline font-bold tracking-tight text-primary-container dark:text-white">Últimos Registros</h2>
            <p className="text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant dark:text-slate-400">Datos obtenidos de {URL_BACK}</p>
          </div>
          <button className="text-[10px] font-semibold bg-surface dark:bg-slate-800 hover:bg-surface-container-high dark:hover:bg-slate-700 px-4 py-2 rounded-xl border border-outline-variant/40 dark:border-slate-700 transition-all">
            VER TODOS
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant dark:text-slate-400 border-b border-outline-variant/30 dark:border-slate-800">
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Contacto</th>
                <th className="px-6 py-4 text-right">Rol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 dark:divide-slate-800">
              {data?.dataReciente?.ultimosRegistros?.length > 0 ? (
                data.dataReciente.ultimosRegistros.map((u) => (
                  <tr key={u._id} className="group hover:bg-surface dark:hover:bg-slate-800/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-surface-container-high dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-on-surface dark:text-white border border-outline-variant/40 dark:border-slate-700">
                          {u.nombre?.substring(0,2).toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold text-on-surface dark:text-white tracking-tight">{u.nombre} {u.apellido}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-on-surface-variant dark:text-slate-400 flex items-center gap-1.5"><Mail size={12}/> {u.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-[9px] font-semibold bg-secondary-container dark:bg-cyan-500/20 text-secondary dark:text-cyan-300 px-3 py-1 rounded-full border border-secondary/20 dark:border-cyan-400/20">
                        {u.rol || 'USUARIO'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-8 py-10 text-center text-on-surface-variant dark:text-slate-400 text-sm">No se encontraron registros recientes</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default UserTable;