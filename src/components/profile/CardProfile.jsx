import storeProfile from "../../context/storeProfile";
import { motion } from "framer-motion";
import { Camera, User, Mail, Phone, MapPin, BadgeCheck, ShieldCheck, Crown } from "lucide-react";

export const CardProfile = () => {
  const { user } = storeProfile();

  const isAdmin = user?.rol?.toLowerCase() === "administrador" || user?.rol?.toLowerCase() === "admin";
  const fullName = [user?.nombre, user?.apellido].filter(Boolean).join(" ") || "Usuario InterviAI";

  const infoFields = [
    { label: "NOMBRE", value: user?.nombre, icon: User },
    { label: "DIRECCIÓN", value: user?.direccion, icon: MapPin },
    { label: "TELÉFONO", value: user?.celular, icon: Phone },
    { label: "CORREO", value: user?.email, icon: Mail },
  ];

  const cardBg = "bg-surface-container-low dark:bg-slate-900/80";
  const itemBg = "bg-surface dark:bg-slate-800/70";
  const borderStyle = "border border-outline-variant/70 dark:border-slate-700";
  const textPrimary = "text-on-surface dark:text-white";
  const textSecondary = "text-on-surface-variant dark:text-slate-400";

  return (
    <motion.div 
      className={`${cardBg} ${borderStyle} rounded-3xl p-6 md:p-7 w-full h-full relative overflow-hidden flex flex-col shadow-sm`}
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
    >
      <div className="absolute -top-10 -right-8 w-36 h-36 rounded-full bg-secondary-container/30 dark:bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="relative flex flex-col items-center mb-6 z-10">
        <div className="relative group/avatar">
          <img  
            src="https://cdn-icons-png.flaticon.com/512/4715/4715329.png"  
            alt="img-client"  
            className={`w-24 h-24 rounded-full ${borderStyle} p-1 bg-white dark:bg-slate-950 object-cover`} 
          />
          <label className={`absolute bottom-0 right-0 bg-secondary dark:bg-cyan-500 text-white rounded-full p-2 cursor-pointer border-2 border-surface-container-low dark:border-slate-900`}>
            <Camera size={16} strokeWidth={3} />
            <input type="file" accept="image/*" className="hidden" />
          </label>
        </div>

        <div className="mt-4 text-center">
          <div className="flex items-center justify-center gap-1.5">
            <h2 className={`text-xl font-headline font-bold tracking-tight ${textPrimary}`}>
              {fullName}
            </h2>
            <BadgeCheck size={18} className="text-secondary dark:text-cyan-400" />
          </div>
          <p className={`text-[10px] font-label tracking-[0.2em] uppercase mt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${isAdmin ? 'text-amber-500 border-amber-500/30 bg-amber-500/10' : 'text-secondary dark:text-cyan-400 border-secondary/20 dark:border-cyan-500/30 bg-secondary-container/40 dark:bg-cyan-500/10'}`}>
            {isAdmin ? <Crown size={10} /> : <ShieldCheck size={10} />} {user?.rol || "USUARIO"}
          </p>
        </div>
      </div>

      <div className="space-y-3 flex-1 z-10">
        {infoFields.map((field) => ( 
          <div 
            key={field.label} 
            className={`flex flex-col ${itemBg} ${borderStyle} p-3.5 rounded-2xl`}
          >
            <span className={`text-[9px] font-label uppercase tracking-widest mb-1.5 flex items-center gap-2 ${textSecondary}`}>
              <field.icon size={12} className="text-secondary dark:text-cyan-400" /> {field.label}
            </span>
            <span className={`text-sm font-semibold truncate ${textPrimary}`}>
                {field.value || "---"}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-outline-variant/60 dark:border-slate-700 flex items-center justify-between text-xs">
        <span className="text-on-surface-variant dark:text-slate-400">Cuenta activa</span>
        <span className="inline-flex items-center gap-2 text-secondary dark:text-cyan-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-secondary dark:bg-cyan-400 animate-pulse" /> Online
        </span>
      </div>
    </motion.div> 
  )
}