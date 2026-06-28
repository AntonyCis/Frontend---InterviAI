import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Users, Crown, DollarSign, BookOpen, MessageSquare, UserCheck, TrendingUp, Activity, ArrowUpRight } from 'lucide-react'
import axios from 'axios'
import storeAuth from '../../context/storeAuth'

const GlobalStats = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { token } = storeAuth()
  const URL_BACK = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${URL_BACK}/admin/metricas`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setData(response.data)
      } catch (error) {
        console.error("Error en stats:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [token, URL_BACK])

  if (loading) return (
    <div className="p-10 flex items-center justify-center gap-3 text-secondary dark:text-cyan-400">
      <Activity className="animate-pulse" size={18} />
      <p className="text-sm font-medium">Cargando métricas...</p>
    </div>
  )

  const d = data || {}
  const totalEntrevistas = Object.values(d.entrevistas?.porStatus || {}).reduce((a, b) => a + b, 0)
  const totalRoles = (d.usuarios?.total || 0) + (d.administradores?.total || 0)
  const userPerc = totalRoles > 0 ? ((d.usuarios?.total / totalRoles) * 100).toFixed(0) : 0

  const StatCard = ({ icon: Icon, label, value, color, subtitle, delay = 0 }) => (
    <motion.div whileHover={{ y: -5 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="p-6 rounded-2xl bg-surface-container-low dark:bg-slate-900/70 border border-outline-variant/50 dark:border-slate-800 relative overflow-hidden group">
      <Icon className="absolute -right-4 -top-4 w-24 h-24 text-current opacity-5 group-hover:opacity-10 transition-colors" style={{ color }} />
      <div className="flex justify-between items-center mb-4">
        <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}20`, color }}><Icon size={20} /></div>
      </div>
      <p className="text-on-surface-variant dark:text-slate-400 text-[10px] font-label uppercase tracking-widest">{label}</p>
      <h3 className="text-4xl font-bold text-on-surface dark:text-white mt-1">{value}</h3>
      {subtitle && <p className="text-[10px] text-on-surface-variant dark:text-slate-400 mt-1">{subtitle}</p>}
    </motion.div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-headline font-bold text-primary-container dark:text-white tracking-tight">Métricas Globales</h2>
        <p className="text-on-surface-variant dark:text-slate-400 text-xs font-label tracking-widest uppercase">
          Análisis completo del sistema · {new Date().toLocaleDateString('es-EC')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={Users} label="Usuarios Totales" value={d.usuarios?.total || 0}
          color="#06b6d4" subtitle={`+${d.usuarios?.nuevoUltimoMes || 0} este mes`} />
        <StatCard icon={TrendingUp} label="Usuarios Activos" value={d.usuariosActivos || 0}
          color="#10b981" subtitle="Con entrevistas completadas" />
        <StatCard icon={BarChart3} label="Total Entrevistas" value={totalEntrevistas}
          color="#f59e0b" subtitle={`${d.entrevistas?.completadasUltimoMes || 0} completadas este mes`} />
        <StatCard icon={DollarSign} label="Pagos de Planes" value={`$${d.donaciones?.montoTotal || 0}`}
          color="#8b5cf6" subtitle={`${d.donaciones?.total || 0} pagos recibidos`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-surface-container-low dark:bg-slate-900/70 border border-outline-variant/50 dark:border-slate-800">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-lg font-headline font-bold text-primary-container dark:text-white">Entrevistas por Estado</h4>
              <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant dark:text-slate-400">Pipeline de simulación</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Completadas', count: d.entrevistas?.porStatus?.completed || 0, color: '#10b981', pct: totalEntrevistas > 0 ? ((d.entrevistas?.porStatus?.completed || 0) / totalEntrevistas * 100).toFixed(0) : 0 },
              { label: 'En Progreso', count: d.entrevistas?.porStatus?.in_progress || 0, color: '#f59e0b', pct: totalEntrevistas > 0 ? ((d.entrevistas?.porStatus?.in_progress || 0) / totalEntrevistas * 100).toFixed(0) : 0 },
              { label: 'Pendientes', count: d.entrevistas?.porStatus?.pending || 0, color: '#6b7280', pct: totalEntrevistas > 0 ? ((d.entrevistas?.porStatus?.pending || 0) / totalEntrevistas * 100).toFixed(0) : 0 },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-on-surface dark:text-white">{item.label}</span>
                  <span className="text-xs text-on-surface-variant dark:text-slate-400">{item.count} ({item.pct}%)</span>
                </div>
                <div className="w-full h-2 bg-surface dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${item.pct}%` }} transition={{ duration: 0.8, delay: 0.2 }}
                    className="h-full rounded-full" style={{ backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-surface-container-low dark:bg-slate-900/70 border border-outline-variant/50 dark:border-slate-800">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-lg font-headline font-bold text-primary-container dark:text-white">Entrevistas por Tipo</h4>
              <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant dark:text-slate-400">Categorías de simulación</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { label: 'CV', count: d.entrevistas?.porTipo?.cv || 0, color: '#06b6d4' },
              { label: 'Tech Stack', count: d.entrevistas?.porTipo?.tech_stack || 0, color: '#8b5cf6' },
              { label: 'Job Link', count: d.entrevistas?.porTipo?.job_link || 0, color: '#f59e0b' },
              { label: 'Soft Skills', count: d.entrevistas?.porTipo?.soft_skills || 0, color: '#10b981' },
            ].sort((a, b) => b.count - a.count).map(item => {
              const max = Math.max(...Object.values(d.entrevistas?.porTipo || {}), 1)
              const pct = ((item.count / max) * 100).toFixed(0)
              return (
                <div key={item.label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-on-surface dark:text-white">{item.label}</span>
                    <span className="text-xs text-on-surface-variant dark:text-slate-400">{item.count}</span>
                  </div>
                  <div className="w-full h-2 bg-surface dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.3 }}
                      className="h-full rounded-full" style={{ backgroundColor: item.color }} />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div whileHover={{ y: -3 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl bg-surface-container-low dark:bg-slate-900/70 border border-outline-variant/50 dark:border-slate-800">
          <BookOpen size={20} className="text-cyan-400 mb-3" />
          <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant dark:text-slate-400">Ejercicios Disponibles</p>
          <h3 className="text-3xl font-bold text-on-surface dark:text-white mt-1">{d.ejercicios?.total || 0}</h3>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl bg-surface-container-low dark:bg-slate-900/70 border border-outline-variant/50 dark:border-slate-800">
          <Crown size={20} className="text-amber-400 mb-3" />
          <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant dark:text-slate-400">Administradores</p>
          <h3 className="text-3xl font-bold text-on-surface dark:text-white mt-1">{d.administradores?.total || 0}</h3>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl bg-surface-container-low dark:bg-slate-900/70 border border-outline-variant/50 dark:border-slate-800">
          <UserCheck size={20} className="text-emerald-400 mb-3" />
          <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant dark:text-slate-400">Distribución Usuarios</p>
          <h3 className="text-3xl font-bold text-on-surface dark:text-white mt-1">{userPerc}%</h3>
          <div className="w-full h-1.5 bg-surface dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${userPerc}%` }} transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full" />
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="p-6 rounded-2xl bg-surface-container-low dark:bg-slate-900/70 border border-outline-variant/50 dark:border-slate-800">
          <MessageSquare size={20} className="text-violet-400 mb-3" />
          <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant dark:text-slate-400">Tasa Retención</p>
          <h3 className="text-3xl font-bold text-on-surface dark:text-white mt-1">
            {d.usuarios?.total > 0 ? ((d.usuariosActivos / d.usuarios.total) * 100).toFixed(0) : 0}<span className="text-lg text-violet-400">%</span>
          </h3>
          <p className="text-[10px] text-on-surface-variant dark:text-slate-400 mt-1">Usuarios activos vs totales</p>
        </motion.div>
      </div>
    </div>
  )
}

export default GlobalStats