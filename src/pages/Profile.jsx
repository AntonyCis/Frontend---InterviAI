import { motion } from 'framer-motion'
import CardPassword from '../components/profile/CardPassword' 
import { CardProfile } from '../components/profile/CardProfile' 
import FormularioPerfil from '../components/profile/FormProfile' 
import { Settings2, LayoutDashboard, ShieldCheck, UserCog, Crown } from 'lucide-react'
import { useEffect } from 'react'
import storeProfile from '../context/storeProfile'

const Profile = () => { 
  const subTitleStyle = "text-[11px] font-label uppercase tracking-[0.22em] text-on-surface-variant dark:text-slate-400";
  const { profile, user } = storeProfile()

  const isAdmin = user?.rol?.toLowerCase() === 'administrador' || user?.rol?.toLowerCase() === 'admin'

  useEffect(() => {
    if (!user) {
      profile()
    }
  }, [])
  

  return ( 
    <motion.div 
      initial={{ opacity: 0, y: -10 }} 
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen" 
    > 
      <div className="rounded-3xl border border-outline-variant/40 dark:border-slate-800 bg-surface-container-low/70 dark:bg-slate-900/70 backdrop-blur-xl p-6 md:p-8 mb-8">
        <header className="relative"> 
          <div className="absolute -top-8 -right-6 w-36 h-36 bg-secondary-container/30 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${isAdmin ? 'bg-amber-500/20 text-amber-500' : 'bg-secondary-container text-secondary dark:bg-cyan-500/20 dark:text-cyan-300'}`}>
                <Settings2 className="w-7 h-7" strokeWidth={2.3} />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-primary-container dark:text-white leading-none"> 
                  Mi Perfil
                </h1> 
                <p className="text-on-surface-variant dark:text-slate-300 text-sm md:text-base mt-2 max-w-xl">
                  Administra tu información, personaliza tu cuenta y fortalece la seguridad de acceso.
                </p>
              </div>
            </div>

            <div className={`w-fit px-4 py-2 rounded-full border text-[10px] uppercase tracking-widest font-semibold flex items-center gap-2 ${isAdmin ? 'border-amber-500/30 text-amber-500 bg-amber-500/10' : 'border-secondary/20 dark:border-cyan-500/30 text-secondary dark:text-cyan-300 bg-secondary-container/40 dark:bg-cyan-500/10'}`}>
              {isAdmin ? <Crown size={12} /> : <ShieldCheck size={12} />}
              {isAdmin ? 'Cuenta Administrador' : 'Cuenta Usuario'}
            </div>
          </div>
        </header>
      </div>

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start"> 
        {/* COLUMNA 1: VISTA PREVIA */}
        <div className="xl:col-span-4 flex flex-col gap-4">
          <div className="flex items-center gap-3 ml-1">
            <LayoutDashboard size={18} className="text-secondary dark:text-cyan-400" strokeWidth={2.2} />
            <h2 className={subTitleStyle}>Vista Previa</h2>
          </div>
          <div className="h-px w-full bg-outline-variant/70 dark:bg-slate-800 mb-1" />
          <div className="w-full">
            <CardProfile /> 
          </div>
        </div>

        {/* COLUMNA 2: DATOS PERSONALES */}
        <div className="xl:col-span-5 flex flex-col gap-4">
          <div className="flex items-center gap-3 ml-1">
            <UserCog size={18} className="text-secondary dark:text-cyan-400" strokeWidth={2.2} />
            <h2 className={subTitleStyle}>Datos Personales</h2>
          </div>
          <div className="h-px w-full bg-outline-variant/70 dark:bg-slate-800 mb-1" />
          <div className="w-full">
            <FormularioPerfil /> 
          </div>
        </div>

        {/* COLUMNA 3: SEGURIDAD */}
        <div className="xl:col-span-3 flex flex-col gap-4">
          <div className="flex items-center gap-3 ml-1">
            <ShieldCheck size={18} className="text-secondary dark:text-cyan-400" strokeWidth={2.2} />
            <h2 className={subTitleStyle}>Acceso y Seguridad</h2>
          </div>
          <div className="h-px w-full bg-outline-variant/70 dark:bg-slate-800 mb-1" />
          <div className="w-full">
            <CardPassword /> 
          </div>
        </div> 
      </div> 
    </motion.div> 
  ) 
} 

export default Profile