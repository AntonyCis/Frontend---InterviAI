import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { Code2, Braces, Database, ArrowRight, Flame, CheckCircle2 } from 'lucide-react'
import { useFetch } from '../hooks/useFetch'
import storeAuth from '../context/storeAuth'

const difficultyMap = {
    muy_facil: { label: 'Muy fácil', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' },
    facil: { label: 'Fácil', color: 'text-sky-500 bg-sky-500/10 border-sky-500/30' },
    medio: { label: 'Medio', color: 'text-amber-500 bg-amber-500/10 border-amber-500/30' },
    dificil: { label: 'Difícil', color: 'text-red-500 bg-red-500/10 border-red-500/30' }
}

const Exercises = () => {
    const [exercises, setExercises] = useState([])
    const [language, setLanguage] = useState('python')
    const [loading, setLoading] = useState(true)
    const fetchDataBackend = useFetch()
    const navigate = useNavigate()
    const { token } = storeAuth()

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const data = await fetchDataBackend(
                    `${import.meta.env.VITE_BACKEND_URL}/exercise?language=${language}`,
                    null,
                    'GET',
                    { Authorization: `Bearer ${token}` }
                )
                if (data) setExercises(data)
            } catch (error) {
                console.error('Error al cargar ejercicios:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchExercises()
    }, [language])

    const filtered = exercises

    const langMeta = {
        python: {
            icon: Code2,
            accent: 'from-sky-500/20 to-cyan-500/10',
            badge: 'bg-sky-500/20 text-sky-500 border-sky-500/30',
            label: 'Python'
        },
        javascript: {
            icon: Braces,
            accent: 'from-amber-500/20 to-orange-500/10',
            badge: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
            label: 'JavaScript'
        },
        sql: {
            icon: Database,
            accent: 'from-purple-500/20 to-pink-500/10',
            badge: 'bg-purple-500/20 text-purple-500 border-purple-500/30',
            label: 'SQL'
        }
    }

    const current = langMeta[language]
    const LangIcon = current.icon

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
            <header className="relative overflow-hidden rounded-[2rem] border border-outline-variant/40 dark:border-slate-800 bg-surface-container-low/80 dark:bg-slate-900/70 p-6 md:p-8">
                <div className={`absolute inset-0 bg-gradient-to-br ${current.accent}`} />
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary-container/30 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-primary-container text-white shadow-lg">
                            <LangIcon size={26} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.35em] text-on-surface-variant dark:text-slate-400 font-semibold">
                                Ruta de aprendizaje
                            </p>
                            <h1 className="text-3xl md:text-4xl font-headline font-black text-primary-container dark:text-white tracking-tight">
                                Ejercicios de {current.label}
                            </h1>
                        </div>
                    </div>
                    <p className="max-w-3xl text-on-surface-variant dark:text-slate-400 text-base md:text-lg leading-relaxed">
                        Selecciona un ejercicio para practicar. Escribe tu solución, ejecuta el código y verifica si pasas todas las pruebas.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {Object.entries(langMeta).map(([key, meta]) => {
                            const Icon = meta.icon
                            return (
                                <button
                                    key={key}
                                    onClick={() => setLanguage(key)}
                                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-semibold transition-all ${language === key
                                        ? 'bg-primary-container text-white border-primary-container'
                                        : 'bg-transparent border-outline-variant/50 text-on-surface-variant dark:text-slate-400 hover:bg-surface-container-high'
                                    }`}
                                >
                                    <Icon size={16} />
                                    {meta.label}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </header>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="rounded-3xl border border-outline-variant/40 dark:border-slate-800 bg-surface-container-low/80 dark:bg-slate-900/70 p-6 animate-pulse">
                            <div className="h-4 bg-surface-container-high dark:bg-slate-800 rounded w-1/3 mb-4" />
                            <div className="h-6 bg-surface-container-high dark:bg-slate-800 rounded w-2/3 mb-3" />
                            <div className="h-3 bg-surface-container-high dark:bg-slate-800 rounded w-full mb-2" />
                            <div className="h-3 bg-surface-container-high dark:bg-slate-800 rounded w-4/5" />
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16">
                    <Flame size={48} className="mx-auto text-on-surface-variant/30 dark:text-slate-600 mb-4" />
                    <p className="text-on-surface-variant dark:text-slate-400">No hay ejercicios disponibles para este lenguaje.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filtered.map((exercise, index) => {
                        const diff = difficultyMap[exercise.difficulty] || difficultyMap.facil
                        return (
                            <motion.div
                                key={exercise._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.06 }}
                                className="group rounded-3xl border border-outline-variant/40 dark:border-slate-800 bg-surface-container-low/80 dark:bg-slate-900/70 p-6 hover:border-secondary/50 dark:hover:border-cyan-500/40 transition-all cursor-pointer shadow-sm hover:shadow-md"
                                onClick={() => navigate(`/dashboard/exercises/${exercise._id}`)}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`text-[10px] uppercase tracking-[0.3em] font-bold px-2.5 py-1 rounded-full border ${current.badge}`}>
                                        {current.label}
                                    </span>
                                    <span className={`text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full border ${diff.color}`}>
                                        {diff.label}
                                    </span>
                                </div>

                                <div className="flex items-start gap-3 mb-3">
                                    <div className="w-8 h-8 rounded-xl bg-primary-container/10 dark:bg-cyan-500/10 flex items-center justify-center text-primary-container dark:text-cyan-300 shrink-0 font-bold text-sm">
                                        {exercise.order || index + 1}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-primary-container dark:text-white tracking-tight leading-tight">
                                            {exercise.title}
                                        </h3>
                                    </div>
                                </div>

                                <p className="text-sm text-on-surface-variant dark:text-slate-400 line-clamp-2 mb-5">
                                    {exercise.description}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30 dark:border-slate-800">
                                    <div className="flex items-center gap-1.5 text-xs text-on-surface-variant dark:text-slate-400">
                                        <CheckCircle2 size={14} />
                                        <span>{exercise.tests?.length || 0} pruebas</span>
                                    </div>
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-secondary dark:text-cyan-400 group-hover:gap-2 transition-all">
                                        Comenzar <ArrowRight size={14} />
                                    </span>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default Exercises