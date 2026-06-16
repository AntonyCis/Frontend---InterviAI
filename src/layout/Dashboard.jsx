import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router'
import storeAuth from '../context/storeAuth'
import storeProfile from '../context/storeProfile'
import storeTheme from '../context/storeTheme'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutGrid,
  User,
  Layers,
  Plus,
  Code2,
  Crown,
  LogOut,
  Sparkles,
  ShieldCheck,
  BarChart3,
  Users,
  Moon,
  Sun,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  BookOpen
} from 'lucide-react'
import logo from '../assets/logo.png'

const Dashboard = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { clearToken } = storeAuth()
  const { user } = storeProfile()
  const { isDark, toggleTheme } = storeTheme()
  const [isCompact, setIsCompact] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const isAdmin = user?.rol?.toLowerCase() === 'administrador' || user?.rol?.toLowerCase() === 'admin'

  const text = {
    ES: {
      dash: 'Dashboard', profile: 'Mi Perfil', jobs: 'Entrevistas', interview: 'Entrevista', plans: 'Planes Pro',
      exit: 'Desconectarse', online: 'SISTEMA ONLINE', role: 'ADMINISTRADOR',
      adminPanel: 'Gestion Usuarios', stats: 'Metricas Globales', exercises: 'Ejercicios', exercisesAdmin: 'Gestionar Ejercicios'
    },
    EN: {
      dash: 'Dashboard', profile: 'My Profile', jobs: 'Jobs', interview: 'Interview', plans: 'Pricing Plans',
      exit: 'Sign Out', online: 'SYSTEM ONLINE', role: 'ADMINISTRATOR',
      adminPanel: 'Manage Users', stats: 'Global Stats', exercises: 'Exercises', exercisesAdmin: 'Manage Exercises'
    }
  }.ES

  const handleLogout = () => { clearToken(); navigate('/') }

  const menuLinks = [
    { path: '/dashboard', name: text.dash, icon: LayoutGrid },
    { path: '/dashboard/profile', name: text.profile, icon: User },
    ...(!isAdmin ? [
      { path: '/dashboard/list', name: text.jobs, icon: Layers },
      { path: '/dashboard/exercises', name: text.exercises, icon: Code2 },
      { path: '/dashboard/create', name: text.interview, icon: Plus },
    ] : [
      { path: '/dashboard/users', name: text.adminPanel, icon: Users },
      { path: '/dashboard/stats', name: text.stats, icon: BarChart3 },
      { path: '/dashboard/exercises-admin', name: text.exercisesAdmin, icon: BookOpen },
    ]),
    { path: '/dashboard/plans', name: text.plans, icon: Crown },
  ]

  // eslint-disable-next-line react/prop-types
  const SidebarContent = ({ compact = false }) => {
    return (<>
      <div className="h-20 px-6 flex items-center justify-between border-b border-outline-variant/30 dark:border-slate-800">
        <Link to="/" className="flex items-center gap-3" onClick={() => setIsMobileOpen(false)}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isAdmin ? 'bg-amber-500/20 text-amber-500' : 'bg-cyan-500/20 text-cyan-500'}`}>
            <img src={logo} alt="InterviAI" className="w-6 h-6" />
          </div>
          {!compact && <span className="font-headline font-bold tracking-tight text-xl text-primary-container dark:text-white">InterviAI</span>}
        </Link>

        {!compact && (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 rounded-lg hover:bg-surface-container-low dark:hover:bg-slate-800 transition-colors md:hidden"
          >
            <X size={18} />
          </button>
        )}

        {compact && (
          <button
            onClick={() => setIsCompact((v) => !v)}
            className="p-2 rounded-lg hover:bg-surface-container-low dark:hover:bg-slate-800 transition-colors hidden md:block"
          >
            <PanelLeftOpen size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuLinks.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all border ${isActive ? 'bg-primary-container text-white border-primary-container dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/30' : 'border-transparent hover:bg-surface-container-low dark:hover:bg-slate-800/70 text-on-surface dark:text-slate-300'}`}
            >
              <item.icon size={18} />
              {!compact && <span className="text-sm font-semibold">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-outline-variant/30 dark:border-slate-800 space-y-3">
        <div className="flex items-center gap-3 px-2 py-2">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="avatar" className="w-10 h-10 rounded-full object-cover border border-outline-variant/50 dark:border-slate-700" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-surface-container-high dark:bg-slate-800 border border-outline-variant/50 dark:border-slate-700 flex items-center justify-center text-xs font-bold">
              {user?.nombre?.slice(0, 2)?.toUpperCase() || 'AI'}
            </div>
          )}
          {!compact && (
            <div>
              <p className="text-sm font-semibold text-on-surface dark:text-white">{user?.nombre || 'Usuario'}</p>
              <p className={`text-[10px] uppercase tracking-widest flex items-center gap-1 ${isAdmin ? 'text-amber-500' : 'text-cyan-500'}`}>
                {isAdmin && <ShieldCheck size={10} />} {user?.rol || text.role}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="w-11 h-11 flex items-center justify-center rounded-lg bg-surface-container-low dark:bg-slate-800 hover:bg-surface-container-high dark:hover:bg-slate-700 transition-colors"
            aria-label="Cambiar tema"
            title="Cambiar tema"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            onClick={handleLogout}
            className="flex-1 min-h-11 px-4 flex items-center justify-center gap-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors text-sm font-medium"
          >
            <LogOut size={16} />
            {!compact && text.exit}
          </button>
        </div>
      </div>
    </>)
  }

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <div className="min-h-screen bg-background dark:bg-slate-950 text-on-background dark:text-slate-100 relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-[-15%] right-[-5%] w-96 h-96 bg-secondary-container/30 dark:bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-primary-fixed/40 dark:bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex h-screen">
          <aside className={`${isCompact ? 'w-24' : 'w-72'} border-r border-outline-variant/40 dark:border-slate-800 bg-surface/80 dark:bg-slate-900/80 backdrop-blur-xl transition-all duration-300 flex-col hidden md:flex`}>
            <button
              onClick={() => setIsCompact((v) => !v)}
              className="absolute top-6 right-[-12px] z-50 p-1 rounded-full bg-surface-container-low dark:bg-slate-800 border border-outline-variant/50 dark:border-slate-700 hover:bg-surface-container-high dark:hover:bg-slate-700 transition-colors"
            >
              <PanelLeftClose size={14} />
            </button>
            <SidebarContent compact={isCompact} />
          </aside>

          <AnimatePresence>
            {isMobileOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-40 md:hidden"
                  onClick={() => setIsMobileOpen(false)}
                />
                <motion.aside
                  initial={{ x: -280 }}
                  animate={{ x: 0 }}
                  exit={{ x: -280 }}
                  transition={{ type: 'spring', damping: 25 }}
                  className="fixed left-0 top-0 bottom-0 w-72 z-50 bg-surface dark:bg-slate-900 border-r border-outline-variant/40 dark:border-slate-800 flex flex-col md:hidden"
                >
                  <SidebarContent compact={false} />
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          <main className="flex-1 flex flex-col min-w-0">
            <header className="h-20 px-8 border-b border-outline-variant/40 dark:border-slate-800 bg-surface/60 dark:bg-slate-900/50 backdrop-blur-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMobileOpen(true)}
                  className="p-2 rounded-lg hover:bg-surface-container-low dark:hover:bg-slate-800 transition-colors md:hidden"
                >
                  <Menu size={20} />
                </button>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant dark:text-slate-400 font-label">{isAdmin ? 'Administrador' : 'Usuario'}</p>
                  <h1 className="font-headline text-2xl font-bold text-primary-container dark:text-white tracking-tight capitalize">
                    {location.pathname.split('/').pop() || 'dashboard'}
                  </h1>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-outline-variant/50 dark:border-slate-700 bg-surface-container-low dark:bg-slate-800 text-[10px] uppercase tracking-widest font-bold text-secondary dark:text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-secondary dark:bg-cyan-400 animate-pulse" />
                {text.online}
              </div>
            </header>

            <section className="flex-1 overflow-y-auto p-6 md:p-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="max-w-7xl mx-auto"
              >
                <div className="mb-6 rounded-2xl border border-outline-variant/40 dark:border-slate-800 bg-surface-container-low/70 dark:bg-slate-900/70 p-4 flex items-center gap-3">
                  <Sparkles size={16} className={isAdmin ? 'text-amber-500' : 'text-cyan-400'} />
                  <p className="text-sm text-on-surface-variant dark:text-slate-300">
                    Bienvenido {user?.nombre || 'a InterviAI'} · Estas en el panel de {isAdmin ? 'administracion' : 'usuario'}.
                  </p>
                </div>
                <Outlet context={{ isAdmin }} />
              </motion.div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Dashboard