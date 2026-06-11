import { useState } from "react"
import { useFetch } from "../../hooks/useFetch" 
import { useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { toast, ToastContainer } from "react-toastify"
import { Sparkles, UploadCloud, Loader2, BrainCircuit, Code2, Users, FileText, Briefcase } from "lucide-react" 
import { motion, AnimatePresence } from "framer-motion"
import storeAuth from "../../context/storeAuth"

const interviewTypes = [
    { 
        value: "cv", 
        label: "Basada en mi CV", 
        description: "La IA analiza tu CV y genera preguntas personalizadas",
        icon: FileText,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10"
    },
    { 
        value: "tech_stack", 
        label: "Enfoque Tecnico", 
        description: "Practica tecnologias especificas (React, Python, etc.)",
        icon: Code2,
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    },
    { 
        value: "soft_skills", 
        label: "Habilidades Blandas", 
        description: "Entrevista conductual con metodo STAR",
        icon: Users,
        color: "text-purple-500",
        bg: "bg-purple-500/10"
    },
    { 
        value: "job_link", 
        label: "Oferta Laboral", 
        description: "Simula una entrevista para un puesto especifico",
        icon: Briefcase,
        color: "text-amber-500",
        bg: "bg-amber-500/10"
    }
]

export const Form = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()
    const fetchDataBackend = useFetch()
    const { token } = storeAuth()

    const { register, handleSubmit, watch } = useForm({
        defaultValues: {
            type: "cv",
        }
    })

    const selectedType = watch("type")

    const onSubmit = async (dataForm) => {
        setIsSubmitting(true)
        try {
            if (!token) {
                toast.error("Debes iniciar sesion")
                return navigate("/login")
            }

            const headers = { Authorization: `Bearer ${token}` }
            const baseURL = import.meta.env.VITE_BACKEND_URL

            let simulationBody = {
                type: dataForm.type,
                data: dataForm.contextoExtra || ""
            }

            if (dataForm.type === 'cv') {
                if (!dataForm.cvFile || !dataForm.cvFile[0]) {
                    toast.error("El archivo PDF es obligatorio para entrevistas basadas en CV")
                    setIsSubmitting(false)
                    return
                }

                const cvFormData = new FormData()
                cvFormData.append("cv", dataForm.cvFile[0])

                const uploadRes = await fetchDataBackend(`${baseURL}/interview/upload-cv`, cvFormData, "POST", headers)
                
                if (!uploadRes?.cvId) {
                    throw new Error(uploadRes?.msg || "Error al procesar el CV")
                }

                simulationBody.cvId = uploadRes.cvId
            }

            if (dataForm.type === 'tech_stack' && !dataForm.contextoExtra?.trim()) {
                toast.error("Debes especificar las tecnologias a practicar")
                setIsSubmitting(false)
                return
            }

            if (dataForm.type === 'job_link' && !dataForm.contextoExtra?.trim()) {
                toast.error("Debes ingresar la descripcion de la oferta laboral")
                setIsSubmitting(false)
                return
            }

            const startRes = await fetchDataBackend(`${baseURL}/interview/start`, simulationBody, "POST", headers)

            if (startRes?.interviewId) {
                toast.success("Simulacion preparada!")
                setTimeout(() => navigate(`/dashboard/chat/${startRes.interviewId}`), 1500)
            }

        } catch (error) {
            const msgError = error.response?.data?.msg || error.message || "Error en el servidor"
            toast.error(msgError)
        } finally {
            setIsSubmitting(false)
        }
    }

    const inputStyle = "w-full py-3 px-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 outline-none focus:border-emerald-500 transition-all text-sm"
    const labelStyle = "text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 block"

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto p-6">
            <ToastContainer theme="dark" />
            
            <div className="text-center mb-10">
                <h1 className="text-3xl font-black text-zinc-800 dark:text-white flex items-center justify-center gap-3">
                    <BrainCircuit className="text-emerald-500" size={32} />
                    Configura tu Entrevista con IA
                </h1>
                <p className="text-zinc-500 mt-2">Selecciona el tipo de entrevista y personaliza tu experiencia</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] shadow-xl border border-zinc-100 dark:border-zinc-800 space-y-8">
                    
                    <div>
                        <label className={labelStyle}>Tipo de Entrevista</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {interviewTypes.map((type) => {
                                const Icon = type.icon
                                const isSelected = selectedType === type.value
                                return (
                                    <label 
                                        key={type.value}
                                        className={`relative flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                            isSelected 
                                                ? 'border-emerald-500 bg-emerald-500/5' 
                                                : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                                        }`}
                                    >
                                        <input 
                                            type="radio" 
                                            value={type.value} 
                                            {...register("type")}
                                            className="sr-only"
                                        />
                                        <div className={`p-2 rounded-lg ${type.bg}`}>
                                            <Icon size={18} className={type.color} />
                                        </div>
                                        <div>
                                            <span className="text-sm font-bold text-zinc-800 dark:text-white block">{type.label}</span>
                                            <span className="text-xs text-zinc-500 mt-0.5">{type.description}</span>
                                        </div>
                                        {isSelected && (
                                            <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </label>
                                )
                            })}
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {selectedType === 'cv' && (
                            <motion.div 
                                key="cv-upload"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <label className={labelStyle}>Tu CV (PDF Obligatorio)</label>
                                <div className="relative">
                                    <input 
                                        type="file" 
                                        accept=".pdf" 
                                        {...register("cvFile", { required: selectedType === 'cv' })}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="flex items-center gap-3 p-4 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                                        <UploadCloud className="text-emerald-500" size={20} />
                                        <span className="text-sm text-zinc-500">
                                            {watch("cvFile")?.[0]?.name || "Seleccionar archivo PDF..."}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div>
                        <label className={labelStyle}>
                            {selectedType === 'tech_stack' && 'Tecnologias a practicar (ej: React, Node.js, Python)'}
                            {selectedType === 'job_link' && 'Descripcion de la oferta laboral'}
                            {selectedType === 'cv' && 'Instrucciones adicionales (Opcional)'}
                            {selectedType === 'soft_skills' && 'Contexto adicional (Opcional)'}
                        </label>
                        <textarea 
                            {...register("contextoExtra")}
                            placeholder={
                                selectedType === 'tech_stack' 
                                    ? 'Ej: React, TypeScript, PostgreSQL, Docker...' 
                                    : selectedType === 'job_link'
                                    ? 'Pega aqui la descripcion del puesto al que aplicas...'
                                    : selectedType === 'soft_skills'
                                    ? 'Ej: Entrevista para lider de equipo, enfoque en resolucion de conflictos...'
                                    : 'Ej: Enfoque en experiencia backend, ingles avanzado...'
                            }
                            className={`${inputStyle} h-28 resize-none`}
                        />
                    </div>
                </div>

                <div className="flex justify-center">
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="group relative flex items-center gap-3 px-12 py-4 bg-emerald-600 text-white rounded-full font-bold text-lg hover:bg-emerald-700 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {isSubmitting ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <Sparkles className="group-hover:rotate-12 transition-transform" />
                        )}
                        {isSubmitting ? "Analizando Perfil..." : "Generar Entrevista"}
                    </button>
                </div>
            </form>
        </motion.div>
    )
}
