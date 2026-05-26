import { useForm } from "react-hook-form"
import storeProfile from "../../context/storeProfile"
import storeAuth from "../../context/storeAuth"
import { motion } from "framer-motion"
import { Lock, KeyRound, ShieldCheck, AlertCircle } from "lucide-react"

const CardPassword = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
    const { user, updatePasswordProfile } = storeProfile()
    const { clearToken } = storeAuth()

    const updatePassword = async (dataForm) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/actualizarpassword/${user._id}`
        if (await updatePasswordProfile(url, dataForm)) clearToken()
    }

    const labelBase = "text-[10px] font-label uppercase flex items-center gap-2 tracking-widest text-on-surface-variant dark:text-slate-400";
    const inputBase = "w-full px-4 py-3 rounded-xl bg-surface dark:bg-slate-800/70 border border-outline-variant/70 dark:border-slate-700 text-sm text-on-surface dark:text-white focus:border-secondary dark:focus:border-cyan-400 focus:ring-2 focus:ring-secondary/10 dark:focus:ring-cyan-400/10 outline-none transition-all placeholder:text-on-surface-variant/70 dark:placeholder:text-slate-500";

    return (
        <motion.div 
            className="bg-surface-container-low dark:bg-slate-900/80 border border-outline-variant/70 dark:border-slate-700 p-6 md:p-7 rounded-3xl shadow-sm w-full transition-all min-h-[430px] flex flex-col justify-center"
        >
            <div className="flex flex-col items-center mb-7">
                <div className="w-14 h-14 bg-surface dark:bg-slate-800 border border-outline-variant/70 dark:border-slate-700 rounded-2xl flex items-center justify-center text-secondary dark:text-cyan-400 mb-4">
                    {user?.googleId ? <ShieldCheck size={24} /> : <Lock size={24} />}
                </div>
                <h2 className="text-sm font-headline font-bold uppercase tracking-[0.16em] text-primary-container dark:text-white">
                    Seguridad
                </h2>
            </div>

            {/* VALIDACIÓN DE GOOGLE */}
            {user?.googleId ? (
                <div className="text-center space-y-4 py-4">
                    <p className="text-[11px] font-semibold text-on-surface-variant dark:text-slate-400 leading-relaxed uppercase tracking-widest">
                        Tu cuenta está vinculada a <span className="text-secondary dark:text-cyan-400">Google</span>
                    </p>
                    <div className="p-4 rounded-xl border border-dashed border-outline-variant/70 dark:border-slate-700 bg-surface dark:bg-slate-800/60">
                        <p className="text-[11px] text-on-surface-variant dark:text-slate-400 font-medium leading-relaxed">
                            La seguridad y contraseña son gestionadas directamente por Google. No es necesario realizar cambios aquí.
                        </p>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit(updatePassword)} className="space-y-5">
                    <div className="flex items-center gap-2 p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs">
                        <AlertCircle size={14} />
                        <span>Al actualizar contraseña se cerrará tu sesión por seguridad.</span>
                    </div>

                    <div className="space-y-2">
                        <label className={labelBase}>
                            <KeyRound size={14} className="text-secondary dark:text-cyan-400"/> Contraseña Actual
                        </label>
                        <input 
                            type="password" 
                            {...register("passwordactual", { required: true })} 
                            placeholder="••••••••"
                            className={inputBase}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className={labelBase}>
                            <Lock size={14} className="text-secondary dark:text-cyan-400"/> Nueva Contraseña
                        </label>
                        <input 
                            type="password" 
                            {...register("passwordnuevo", { required: true, minLength: 8 })} 
                            placeholder="Mínimo 8 caracteres"
                            className={inputBase}
                        />
                    </div>

                    <motion.button
                        type="submit"
                        className="w-full py-3.5 rounded-xl bg-primary-container hover:bg-on-primary-fixed-variant dark:bg-cyan-500/90 dark:hover:bg-cyan-500 text-white font-semibold uppercase text-[11px] tracking-[0.18em] flex items-center justify-center gap-2 mt-6 border border-primary-container dark:border-cyan-400/30 shadow-sm transition-all"
                        whileTap={{ scale: 0.97 }}
                    >
                        {isSubmitting ? (
                            <span className="flex gap-1">
                                <span className="animate-bounce">.</span>
                                <span className="animate-bounce [animation-delay:-0.15s]">.</span>
                                <span className="animate-bounce [animation-delay:-0.3s]">.</span>
                            </span>
                        ) : 'Actualizar Clave'}
                    </motion.button>
                </form>
            )}
        </motion.div>
    )
}

export default CardPassword