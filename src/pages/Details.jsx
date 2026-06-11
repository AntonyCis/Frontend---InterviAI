import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { motion } from "framer-motion"
import { 
    ArrowLeft, BrainCircuit, Award, MessageSquare, 
    Zap, Clock, XCircle, Star, FileDown, Loader2
} from "lucide-react"
import { useFetch } from "../hooks/useFetch"
import storeAuth from "../context/storeAuth"
import storeProfile from "../context/storeProfile"
import { generateInterviewPDF } from "../helpers/generatePdf"
import { toast } from "react-toastify"

const Details = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const fetchDataBackend = useFetch()
    const { token } = storeAuth()
    const { user } = storeProfile()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [generatingPdf, setGeneratingPdf] = useState(false)

    const handleGeneratePdf = async () => {
        if (!data) return
        setGeneratingPdf(true)
        try {
            const userName = user?.nombre ? `${user.nombre} ${user.apellido || ''}`.trim() : null
            await generateInterviewPDF(data, userName)
            toast.success('PDF generado correctamente')
        } catch (error) {
            console.error('Error generando PDF:', error)
            toast.error('Error al generar el PDF')
        } finally {
            setGeneratingPdf(false)
        }
    }

    useEffect(() => {
        const getDetails = async () => {
            try {
                const res = await fetchDataBackend(
                    `${import.meta.env.VITE_BACKEND_URL}/interview/detail/${id}`,
                    null,
                    "GET",
                    { Authorization: `Bearer ${token}` },
                    { silent: true }
                )
                if (res) setData(res)
            } catch (error) {
                console.error("Error al obtener detalles:", error)
            } finally {
                setLoading(false)
            }
        }
        getDetails()
    }, [id, token])

    if (loading) return (
        <div className="p-10 flex items-center justify-center gap-2 text-on-surface-variant dark:text-slate-400">
            <Zap className="text-secondary dark:text-cyan-400 animate-pulse" size={24} />
            <span className="text-sm font-semibold">Analizando Reporte...</span>
        </div>
    )

    if (!data) return (
        <div className="p-20 text-center text-on-surface-variant dark:text-slate-400">
            No se encontro la entrevista.
        </div>
    )

    const cardStyle = "bg-surface-container-low dark:bg-slate-900/70 border border-outline-variant/50 dark:border-slate-800 rounded-2xl p-6 shadow-sm"

    const getScoreColor = (score) => {
        if (score >= 8) return 'text-emerald-500'
        if (score >= 5) return 'text-amber-500'
        return 'text-red-500'
    }

    const getScoreBg = (score) => {
        if (score >= 8) return 'bg-emerald-500/10 border-emerald-500/30'
        if (score >= 5) return 'bg-amber-500/10 border-amber-500/30'
        return 'bg-red-500/10 border-red-500/30'
    }

    const formatDuration = () => {
        if (!data.startedAt || !data.completedAt) return null
        const diff = new Date(data.completedAt) - new Date(data.startedAt)
        const mins = Math.floor(diff / 60000)
        return `${mins} min`
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <button 
                        onClick={() => navigate('/dashboard/list')}
                        className="flex items-center gap-2 text-on-surface-variant dark:text-slate-400 hover:text-secondary dark:hover:text-cyan-400 transition-colors mb-3 group text-sm"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-semibold">Volver al historial</span>
                    </button>
                    <h1 className="text-3xl font-headline font-bold text-primary-container dark:text-white tracking-tight">
                        Detalle de Entrevista
                    </h1>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="bg-surface-container-low dark:bg-slate-800 px-4 py-2 rounded-xl border border-outline-variant/50 dark:border-slate-700">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-slate-400 block">ID</span>
                        <span className="text-sm font-mono font-bold text-on-surface dark:text-white">
                            #{data._id?.slice(-6).toUpperCase()}
                        </span>
                    </div>
                    {!data.isCompleted && (
                        <motion.button 
                            whileHover={{ scale: 1.03 }}
                            onClick={() => navigate(`/dashboard/chat/${data._id}`)}
                            className="px-5 py-3 bg-secondary dark:bg-cyan-500 text-white rounded-xl font-bold text-sm flex items-center gap-2"
                        >
                            <Zap size={16} />
                            Continuar
                        </motion.button>
                    )}
                </div>
            </div>

            <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className={cardStyle}>
                    <p className="text-[10px] uppercase tracking-widest text-on-surface-variant dark:text-slate-400 font-label">Tipo</p>
                    <p className="text-lg font-bold mt-1 text-on-surface dark:text-white capitalize">{data.type?.replace('_', ' ')}</p>
                </div>
                <div className={cardStyle}>
                    <p className="text-[10px] uppercase tracking-widest text-on-surface-variant dark:text-slate-400 font-label">Fecha</p>
                    <p className="text-lg font-bold mt-1 text-on-surface dark:text-white">
                        {new Date(data.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                </div>
                <div className={cardStyle}>
                    <p className="text-[10px] uppercase tracking-widest text-on-surface-variant dark:text-slate-400 font-label">Estado</p>
                    <div className="flex items-center gap-2 mt-1">
                        <div className={`w-2.5 h-2.5 rounded-full ${data.isCompleted ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                        <p className="text-lg font-bold text-on-surface dark:text-white">
                            {data.isCompleted ? 'Completada' : 'En progreso'}
                        </p>
                    </div>
                </div>
                <div className={cardStyle}>
                    <p className="text-[10px] uppercase tracking-widest text-on-surface-variant dark:text-slate-400 font-label">Duracion</p>
                    <div className="flex items-center gap-2 mt-1">
                        <Clock size={16} className="text-on-surface-variant dark:text-slate-400" />
                        <p className="text-lg font-bold text-on-surface dark:text-white">
                            {formatDuration() || '--'}
                        </p>
                    </div>
                </div>
            </section>

            {data.isCompleted && (
                <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`${cardStyle} md:col-span-1 flex flex-col items-center justify-center`}>
                        <Award className="text-secondary dark:text-cyan-400 mb-2" size={28} />
                        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant dark:text-slate-400 font-label mb-1">Puntuacion Final</p>
                        <p className={`text-5xl font-black ${getScoreColor(data.averageScore)}`}>
                            {data.averageScore}<span className="text-xl text-on-surface-variant dark:text-slate-500">/10</span>
                        </p>
                    </div>
                    
                    <div className={`${cardStyle} md:col-span-2`}>
                        <div className="flex items-center gap-2 mb-3">
                            <MessageSquare className="text-secondary dark:text-cyan-400" size={18} />
                            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant dark:text-slate-400 font-label">Feedback General IA</p>
                        </div>
                        <p className="text-sm text-on-surface dark:text-slate-200 leading-relaxed italic">
                            &ldquo;{data.overallFeedback || "Sin feedback disponible"}&rdquo;
                        </p>
                    </div>
                </section>
            )}

            {data.isCompleted && data.questions?.length > 0 && (
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <BrainCircuit className="text-secondary dark:text-cyan-400" size={20} />
                        <h2 className="text-lg font-headline font-bold text-primary-container dark:text-white">Analisis por Pregunta</h2>
                    </div>

                    <div className="space-y-4">
                        {data.questions.map((q, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className={`${cardStyle} space-y-4`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3 flex-1">
                                        <div className="w-8 h-8 rounded-lg bg-primary-container/10 dark:bg-cyan-500/10 flex items-center justify-center text-primary-container dark:text-cyan-300 font-bold text-sm shrink-0">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-on-surface dark:text-white">{q.questionText}</p>
                                            <span className={`text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded border mt-1 inline-block ${
                                                q.category === 'theoretical' ? 'text-blue-500 bg-blue-500/10 border-blue-500/30' :
                                                q.category === 'practical' ? 'text-purple-500 bg-purple-500/10 border-purple-500/30' :
                                                'text-amber-500 bg-amber-500/10 border-amber-500/30'
                                            }`}>
                                                {q.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${getScoreBg(q.score)}`}>
                                        <Star size={14} className={getScoreColor(q.score)} />
                                        <span className={`text-sm font-black ${getScoreColor(q.score)}`}>{q.score}/10</span>
                                    </div>
                                </div>

                                {q.userAnswer && q.userAnswer !== "No respondido" && (
                                    <div className="pl-11 space-y-1">
                                        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant dark:text-slate-500 font-label">Tu respuesta</p>
                                        <p className="text-sm text-on-surface dark:text-slate-300 bg-surface-container-high dark:bg-slate-800/50 rounded-xl p-3">
                                            {q.userAnswer}
                                        </p>
                                    </div>
                                )}

                                {q.aiFeedback && (
                                    <div className="pl-11 space-y-1">
                                        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant dark:text-slate-500 font-label">Feedback IA</p>
                                        <p className="text-sm text-on-surface dark:text-slate-300 bg-secondary/5 dark:bg-cyan-500/5 border border-secondary/20 dark:border-cyan-500/20 rounded-xl p-3 italic">
                                            {q.aiFeedback}
                                        </p>
                                    </div>
                                )}

                                {(!q.userAnswer || q.userAnswer === "No respondido") && (
                                    <div className="pl-11 flex items-center gap-2 text-amber-500 text-xs font-semibold">
                                        <XCircle size={14} /> Sin respuesta
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {data.isCompleted && (
                <section className={`${cardStyle} flex flex-col items-center justify-center py-8`}>
                    <button 
                        onClick={handleGeneratePdf}
                        disabled={generatingPdf}
                        className="px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold text-sm hover:bg-emerald-600 dark:hover:bg-emerald-500 dark:hover:text-white transition-all shadow-lg flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {generatingPdf ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Generando PDF...
                            </>
                        ) : (
                            <>
                                <FileDown size={18} />
                                Generar Reporte PDF
                            </>
                        )}
                    </button>
                    <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-3">
                        Descarga un reporte completo con todas las preguntas y feedback
                    </p>
                </section>
            )}

            {!data.isCompleted && (
                <section className={`${cardStyle} text-center py-12`}>
                    <BrainCircuit className="mx-auto text-on-surface-variant/30 dark:text-slate-600 mb-4" size={40} />
                    <p className="text-on-surface-variant dark:text-slate-400 text-sm">
                        Completa la entrevista para ver el analisis detallado por pregunta.
                    </p>
                    <button 
                        onClick={() => navigate(`/dashboard/chat/${data._id}`)}
                        className="mt-4 px-6 py-3 bg-secondary dark:bg-cyan-500 text-white rounded-xl font-bold text-sm inline-flex items-center gap-2"
                    >
                        <Zap size={16} />
                        Continuar Entrevista
                    </button>
                </section>
            )}
        </motion.div>
    )
}

export default Details