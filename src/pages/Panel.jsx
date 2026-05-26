import { useState, useEffect } from 'react';
import axios from 'axios'; // O usa fetch si prefieres
import { Zap, Loader2, Users, Activity, ShieldCheck, ArrowUpRight } from 'lucide-react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Link } from 'react-router';
import storeAuth from '../context/storeAuth';
import storeProfile from '../context/storeProfile';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

export default function Panel() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminStats, setAdminStats] = useState(null);
  const { token, rol } = storeAuth();
  const { user } = storeProfile();
  const isAdmin = rol?.toLowerCase() === 'administrador' || user?.rol?.toLowerCase() === 'administrador';

  const cardStyle = "bg-surface-container-low dark:bg-slate-900/70 border border-outline-variant/50 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300";
  
  // 1. Cargar datos reales de tu API
  useEffect(() => {
    const getStats = async () => {
      try {
        if (isAdmin) {
          const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/dashboard`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setAdminStats(data);
        } else {
          const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/interview/history`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setInterviews(data.filter(i => i.isCompleted).reverse());
        }
      } catch (error) {
        console.error("Error al obtener historial:", error);
      } finally {
        setLoading(false);
      }
    };
    getStats();
  }, [isAdmin, token]);

  // 2. Configuración de datos para Chart.js basada en tu backend
  const lineData = {
    labels: interviews.map(i => new Date(i.createdAt).toLocaleDateString()),
    datasets: [{
      fill: true,
      label: 'Score de IA',
      data: interviews.map(i => i.progressPercentage), // Usamos el % que ya calculas
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { min: 0, max: 100, ticks: { color: '#71717a' }, grid: { color: 'rgba(113, 113, 122, 0.05)' } },
      x: { ticks: { color: '#71717a' }, grid: { display: false } }
    },
    plugins: { legend: { display: false } }
  };

  // 3. Métricas calculadas en tiempo real
  const avgPerformance = interviews.length > 0
    ? (interviews.reduce((acc, curr) => acc + curr.progressPercentage, 0) / interviews.length).toFixed(0)
    : 0;

  if (loading) {
    return (
      <div className="rounded-2xl border border-outline-variant/50 dark:border-slate-800 bg-surface-container-low dark:bg-slate-900/70 p-10 flex items-center justify-center gap-2 text-secondary dark:text-cyan-400 font-semibold">
        <Loader2 className="animate-spin" size={18} /> Cargando dashboard...
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant dark:text-slate-400 font-label">Vista rápida</p>
            <h2 className="text-3xl font-headline font-bold text-primary-container dark:text-white tracking-tight">Panel Administrativo</h2>
          </div>
          <ShieldCheck className="text-amber-500" />
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={cardStyle}>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant dark:text-slate-400 font-label">Administradores</p>
            <p className="text-4xl font-bold mt-2 text-on-surface dark:text-white">{adminStats?.stats?.administradores || 0}</p>
          </div>
          <div className={cardStyle}>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant dark:text-slate-400 font-label">Usuarios</p>
            <p className="text-4xl font-bold mt-2 text-on-surface dark:text-white">{adminStats?.stats?.usuarios || 0}</p>
          </div>
          <div className={cardStyle}>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant dark:text-slate-400 font-label">Registros recientes</p>
            <p className="text-4xl font-bold mt-2 text-on-surface dark:text-white">{adminStats?.dataReciente?.ultimosRegistros?.length || 0}</p>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/dashboard/users" className="rounded-2xl border border-outline-variant/50 dark:border-slate-800 bg-surface-container-low dark:bg-slate-900/70 p-6 hover:border-secondary dark:hover:border-cyan-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-on-surface dark:text-white">Gestión de usuarios</h3>
                <p className="text-sm text-on-surface-variant dark:text-slate-400 mt-1">Revisa los últimos registros y estado de cuentas.</p>
              </div>
              <Users className="text-secondary dark:text-cyan-400" />
            </div>
          </Link>

          <Link to="/dashboard/stats" className="rounded-2xl border border-outline-variant/50 dark:border-slate-800 bg-surface-container-low dark:bg-slate-900/70 p-6 hover:border-secondary dark:hover:border-cyan-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-on-surface dark:text-white">Métricas globales</h3>
                <p className="text-sm text-on-surface-variant dark:text-slate-400 mt-1">Analiza distribución y salud general de la plataforma.</p>
              </div>
              <Activity className="text-secondary dark:text-cyan-400" />
            </div>
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header Dinámico */}
      <div className="flex justify-between items-center">
        <h1 className='font-headline text-3xl tracking-tight font-bold text-primary-container dark:text-white'>
          Mi progreso <span className="text-secondary dark:text-cyan-400">InterviAI</span>
        </h1>
        <div className="bg-secondary-container text-on-secondary-fixed dark:bg-cyan-500/20 dark:text-cyan-300 px-4 py-1 rounded-full font-semibold text-xs uppercase tracking-widest">
          {interviews.length} Sesiones Realizadas
        </div>
      </div>

      {/* Grid de Métricas Reales */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={cardStyle}>
          <p className="text-[10px] font-label text-on-surface-variant dark:text-slate-400 uppercase tracking-widest mb-2">Puntaje Promedio</p>
          <p className="text-4xl font-bold text-on-surface dark:text-white">{avgPerformance}%</p>
        </div>
        <div className={cardStyle}>
          <p className="text-[10px] font-label text-on-surface-variant dark:text-slate-400 uppercase tracking-widest mb-2">Última Sesión</p>
          <p className="text-2xl font-semibold text-on-surface dark:text-white truncate">{interviews[interviews.length - 1]?.title || 'Sin datos'}</p>
        </div>
        <div className={cardStyle}>
          <p className="text-[10px] font-label text-on-surface-variant dark:text-slate-400 uppercase tracking-widest mb-2">Estado de Entrenamiento</p>
          <p className="text-xl font-semibold text-on-surface dark:text-white">{avgPerformance > 70 ? 'Listo para entrevista' : 'Sigue practicando'}</p>
        </div>
      </section>

      {/* Gráfico Evolutivo */}
      <section className={cardStyle}>
        <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold uppercase tracking-widest text-on-surface-variant dark:text-slate-400 text-xs">Evolución de rendimiento por sesión</h2>
            <Zap size={18} className="text-secondary dark:text-cyan-400" />
        </div>
        <div className="h-[300px]">
          <Line options={chartOptions} data={lineData} />
        </div>
      </section>

    </div>
  );
}