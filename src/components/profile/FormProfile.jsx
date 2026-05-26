import { useEffect } from "react"
import storeProfile from "../../context/storeProfile"
import { useForm } from "react-hook-form"
import { ToastContainer } from 'react-toastify'
import { motion } from "framer-motion"
import { User, Mail, MapPin, Phone, Save } from "lucide-react"

const FormularioPerfil = () => {
    const { user, updateProfile } = storeProfile()
    const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm()

    const updateUser = (dataForm) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/actualizarperfil/${user._id}`
        updateProfile(url, dataForm)
    }

    useEffect(() => {
        if (user) reset({
            nombre: user?.nombre,
            apellido: user?.apellido,
            direccion: user?.direccion,
            celular: user?.celular,
            email: user?.email,
        })
    }, [user, reset])

    const containerBase = "bg-surface-container-low dark:bg-slate-900/80 border border-outline-variant/70 dark:border-slate-700 p-6 md:p-7 rounded-3xl shadow-sm flex-1 flex flex-col justify-between transition-colors duration-300";
    const inputBase = "w-full bg-surface dark:bg-slate-800/70 text-sm text-on-surface dark:text-white border border-outline-variant/70 dark:border-slate-700 rounded-xl py-3 px-4 outline-none focus:border-secondary dark:focus:border-cyan-400 focus:ring-2 focus:ring-secondary/10 dark:focus:ring-cyan-400/10 transition-all placeholder:text-on-surface-variant/70 dark:placeholder:text-slate-500";
    const labelBase = "text-[10px] font-label uppercase tracking-widest ml-1 flex items-center gap-2 text-on-surface-variant dark:text-slate-400";

    return ( 
        <div className="w-full h-full flex flex-col">
            <ToastContainer />
            
            <form onSubmit={handleSubmit(updateUser)} className={containerBase}>
                <div className="space-y-5">
                    <div className="flex items-center justify-between gap-3 pb-2 border-b border-outline-variant/40 dark:border-slate-700">
                        <p className="text-sm font-headline font-bold text-primary-container dark:text-white">Información de la cuenta</p>
                        <span className="text-[10px] uppercase tracking-widest text-on-surface-variant dark:text-slate-400">Editable</span>
                    </div>

                    {/* FILA: NOMBRE Y APELLIDO */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className={labelBase}> <User size={12} /> NOMBRE </label> 
                            <input {...register("nombre")} className={inputBase} placeholder="Tu nombre" />
                        </div>
                        <div className="space-y-2">
                            <label className={labelBase}> <User size={12} /> APELLIDO </label> 
                            <input {...register("apellido")} className={inputBase} placeholder="Tu apellido" />
                        </div>
                    </div>

                    {/* DIRECCIÓN */}
                    <div className="space-y-2">
                        <label className={labelBase}> <MapPin size={12} /> DIRECCIÓN </label> 
                        <input {...register("direccion")} className={inputBase} placeholder="Tu dirección" />
                    </div>

                    {/* CELULAR */}
                    <div className="space-y-2">
                        <label className={labelBase}> <Phone size={12} /> CELULAR </label> 
                        <input {...register("celular")} className={inputBase} placeholder="Tu número" />
                    </div>

                    {/* EMAIL */}
                    <div className="space-y-2">
                        <label className={labelBase}> <Mail size={12} /> EMAIL </label> 
                        <input {...register("email")} className={inputBase} placeholder="tu@email.com" />
                    </div>
                </div> 

                {/* BOTÓN DE ACCIÓN */}
                <div className="mt-7">
                    <motion.button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full py-3.5 rounded-xl bg-primary-container hover:bg-on-primary-fixed-variant dark:bg-cyan-500/90 dark:hover:bg-cyan-500 text-white font-semibold uppercase text-[11px] tracking-[0.2em] border border-primary-container dark:border-cyan-400/30 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
                        whileTap={{ scale: 0.98 }}
                    >
                        <Save size={16} />
                        {isSubmitting ? '...' : 'ACTUALIZAR PERFIL'}
                    </motion.button>
                </div> 
            </form> 
        </div> 
    ) 
} 

export default FormularioPerfil