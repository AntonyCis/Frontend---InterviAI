import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { useFetch } from "../hooks/useFetch"
import { motion } from "framer-motion"
import { Calendar, Award, ChevronRight, BrainCircuit, Trash2, Loader2 } from "lucide-react"
import storeAuth from "../context/storeAuth"

const typeColors = {
    cv: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
    tech_stack: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
    soft_skills: 'text-purple-500 bg-purple-500/10 border-purple-500/30',
    job_link: 'text-amber-500 bg-amber-500/10 border-amber-500/30'
}

const List = () => {
    const [interviews, setInterviews] = useState([])
    const [loading, setLoading] = useState(true)
    const fetchDataBackend = useFetch()
    const navigate = useNavigate()
    const { token } = storeAuth()

    useEffect(() => {
        const getHistory = async () => {
            try {
                const data = await fetchDataBackend(
                    `${import.meta.env.VITE_BACKEND_URL}/interview/history`,
                    null,
                    "GET",
                    { Authorization: `Bearer ${token}` },
                    { silent: true }
                )
                if (data?.interviews) setInterviews(data.interviews)
                else if (Array.isArray(data)) setInterviews(data)
            } catch {
                console.error("Error al cargar historial")
            } finally {
                setLoading(false)
            }
        }
        getHistory()
    }, [token])

    const handleDelete = async (e, interviewId) => {
        e.stopPropagation()
        if (!window.confirm("Estas seguro de eliminar esta entrevista?")) return
        
        try {
            await fetchDataBackend(
                `${import.meta.env.VITE_BACKEND_URL}/interview/${interviewId}`,
                null,
                "DELETE",
                { Authorization: `Bearer ${token}` }
            )
            setInterviews(prev => prev.filter(i => i._id !== interviewId))
        } catch {
            console.error("Error al eliminar")
        }
    }

    if (loading) return (
        <div className="p-10 flex items-center justify-center gap-2 text-on-surface-variant dark:text-slate-400">
            <Loader2 className="animate-spin" size={20} /> Cargando tu progreso...
        </div>
    )

    const cardStyle = "bg-surface-container-low dark:bg-slate-900/70 border border-outline-variant/50 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <header className="mb-6">
                <h1 className="text-3xl font-headline font-bold flex items-center gap-3 text-primary-container dark:text-white">
                    <BrainCircuit className="text-secondary dark:text-cyan-400" size={28} />
                    Mi Historial de Entrevistas
                </h1>
                <p className="text-on-surface-variant dark:text-slate-400 mt-1">Revisa tus puntuaciones y sigue practicando.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {interviews.length > 0 ? (
                    interviews.map((item) => {
                        const colorClass = typeColors[item.type] || typeColors.tech_stack
                        return (
                            <motion.div 
                                key={item._id}
                                whileHover={{ y: -4 }}
                                className={cardStyle}
                                onClick={() => navigate(`/dashboard/details/${item._id}`)}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl ${item.isCompleted ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                        <Award size={22} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border ${colorClass}`}>
                                            {item.type?.replace('_', ' ')}
                                        </span>
                                        <button
                                            onClick={(e) => handleDelete(e, item._id)}
                                            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                                            title="Eliminar entrevista"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="font-bold text-lg mb-1 group-hover:text-secondary dark:group-hover:text-cyan-400 transition-colors text-on-surface dark:text-white">
                                    {item.title}
                                </h3>
                                
                                <div className="flex items-center gap-2 text-on-surface-variant dark:text-slate-400 text-xs mb-6">
                                    <Calendar size={14} />
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-bold">
                                        <span className="text-on-surface-variant dark:text-slate-400">{item.isCompleted ? "Puntuacion IA" : "En progreso"}</span>
                                        <span className="text-on-surface dark:text-white">{item.averageScore}/10</span>
                                    </div>
                                    <div className="w-full h-2 bg-surface-container-high dark:bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.progressPercentage}%` }}
                                            className={`h-full ${item.averageScore >= 7 ? 'bg-emerald-500' : item.averageScore >= 4 ? 'bg-amber-500' : 'bg-red-500'}`}
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-outline-variant/30 dark:border-slate-800 flex justify-between items-center text-sm font-bold text-on-surface-variant dark:text-slate-400">
                                    <span>Ver detalles</span>
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </motion.div>
                        )
                    })
                ) : (
                    <div className="col-span-full py-20 text-center bg-surface-container-low dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-outline-variant/50 dark:border-slate-700">
                        <p className="text-on-surface-variant dark:text-slate-400 font-medium">Aun no has realizado ninguna entrevista.</p>
                        <button 
                            onClick={() => navigate("/dashboard/create")}
                            className="mt-4 text-secondary dark:text-cyan-400 font-bold hover:underline"
                        >
                            Empieza la primera ahora!
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default List