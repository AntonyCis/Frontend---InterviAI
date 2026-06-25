import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { ArrowLeft, PlayCircle, RotateCcw, CheckCircle2, XCircle, Lightbulb, Trophy, Code2, Braces, Database } from 'lucide-react'
import Editor from '@monaco-editor/react'
import { useFetch } from '../hooks/useFetch'
import storeAuth from '../context/storeAuth'
import { toast } from 'react-toastify'

const difficultyMap = {
    muy_facil: { label: 'Muy fácil', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' },
    facil: { label: 'Fácil', color: 'text-sky-500 bg-sky-500/10 border-sky-500/30' },
    medio: { label: 'Medio', color: 'text-amber-500 bg-amber-500/10 border-amber-500/30' },
    dificil: { label: 'Difícil', color: 'text-red-500 bg-red-500/10 border-red-500/30' }
}

const langMeta = {
    python: { icon: Code2, badge: 'bg-sky-500/20 text-sky-500 border-sky-500/30', label: 'Python', accent: 'from-sky-500/20 to-cyan-500/10' },
    javascript: { icon: Braces, badge: 'bg-amber-500/20 text-amber-500 border-amber-500/30', label: 'JavaScript', accent: 'from-amber-500/20 to-orange-500/10' },
    sql: { icon: Database, badge: 'bg-purple-500/20 text-purple-500 border-purple-500/30', label: 'SQL', accent: 'from-purple-500/20 to-pink-500/10' }
}

const ExerciseSolve = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const fetchDataBackend = useFetch()
    const { token } = storeAuth()
    const editorRef = useRef(null)

    const [exercise, setExercise] = useState(null)
    const [loading, setLoading] = useState(true)
    const [code, setCode] = useState('')
    const [results, setResults] = useState(null)
    const [running, setRunning] = useState(false)
    const [showResults, setShowResults] = useState(false)

    const handleEditorDidMount = (editor) => {
        editorRef.current = editor
    }

    const loadExercise = useCallback(async () => {
        try {
            const data = await fetchDataBackend(
                `${import.meta.env.VITE_BACKEND_URL}/exercise/${id}`,
                null,
                'GET',
                { Authorization: `Bearer ${token}` }
            )
            if (data) {
                setExercise(data)
                setCode(data.starterCode || '')
            }
        } catch {
            toast.error('No se pudo cargar el ejercicio')
            navigate('/dashboard/exercises')
        } finally {
            setLoading(false)
        }
    }, [id, token, fetchDataBackend, navigate])

    useEffect(() => {
        loadExercise()
    }, [loadExercise])

    const handleRun = async () => {
        const currentCode = editorRef.current?.getValue() || code
        if (!currentCode.trim()) {
            toast.warning('Escribe tu solución antes de ejecutar')
            return
        }
        setCode(currentCode)
        setRunning(true)
        setShowResults(true)
        setResults(null)

        try {
            const data = await fetchDataBackend(
                `${import.meta.env.VITE_BACKEND_URL}/exercise/run`,
                { id, code: currentCode },
                'POST',
                { Authorization: `Bearer ${token}` }
            )
            if (data) {
                setResults(data)
                if (data.allPassed) {
                    toast.success('Todas las pruebas pasaron correctamente')
                } else {
                    toast.error('Algunas pruebas no pasaron. Revisa los resultados.')
                }
            }
        } catch (error) {
            console.error('Error:', error)
            toast.error('Error al ejecutar el código')
        } finally {
            setRunning(false)
        }
    }

    const handleReset = () => {
        if (exercise) {
            const starterCode = exercise.starterCode || ''
            setCode(starterCode)
            if (editorRef.current) {
                editorRef.current.setValue(starterCode)
            }
            setResults(null)
            setShowResults(false)
        }
    }

    if (loading) {
        return (
            <div className="p-6 md:p-10 max-w-7xl mx-auto">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-surface-container-high dark:bg-slate-800 rounded w-1/3" />
                    <div className="h-40 bg-surface-container-high dark:bg-slate-800 rounded-2xl" />
                    <div className="h-80 bg-surface-container-high dark:bg-slate-800 rounded-2xl" />
                </div>
            </div>
        )
    }

    if (!exercise) return null

    const diff = difficultyMap[exercise.difficulty] || difficultyMap.facil
    const lang = langMeta[exercise.language]
    const passedCount = results ? results.results.filter(r => r.passed).length : 0
    const totalCount = results ? results.results.length : 0

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/dashboard/exercises')}
                    className="p-2.5 rounded-xl border border-outline-variant/50 dark:border-slate-700 bg-surface dark:bg-slate-800 hover:bg-surface-container-high dark:hover:bg-slate-700 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex items-center gap-3">
                    <span className={`text-[10px] uppercase tracking-[0.3em] font-bold px-2.5 py-1 rounded-full border ${lang.badge}`}>
                        {lang.label}
                    </span>
                    <span className={`text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full border ${diff.color}`}>
                        {diff.label}
                    </span>
                </div>
            </div>

            {/* Exercise Info */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-outline-variant/40 dark:border-slate-800 bg-surface-container-low/80 dark:bg-slate-900/70 p-6 md:p-8 relative overflow-hidden"
            >
                <div className={`absolute inset-0 bg-gradient-to-br ${lang.accent}`} />
                <div className="relative z-10">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-headline font-black text-primary-container dark:text-white tracking-tight">
                                {exercise.title}
                            </h1>
                            <p className="mt-2 text-on-surface-variant dark:text-slate-300">
                                <span className="font-semibold text-on-surface dark:text-white">Objetivo:</span> {exercise.goal}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-surface-container-low dark:bg-slate-950/70 border border-outline-variant/30 dark:border-slate-800 p-4 mb-4">
                        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-on-surface-variant dark:text-slate-400 mb-2">Enunciado</p>
                        <p className="text-sm md:text-base text-on-surface dark:text-slate-100 leading-relaxed">{exercise.description}</p>
                    </div>

                    {exercise.hint && (
                        <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20">
                            <Lightbulb size={18} className="text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-on-surface-variant dark:text-slate-300">{exercise.hint}</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Editor + Results */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Code Editor */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
                    <div className="rounded-2xl overflow-hidden border border-outline-variant/30 dark:border-slate-800 bg-[#0b1020] shadow-inner">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 text-white/80 text-xs uppercase tracking-[0.3em] font-semibold">
                            <span>Editor de codigo</span>
                            <span>{lang.label}</span>
                        </div>
                        <Editor
                            height="400px"
                            defaultLanguage={exercise.language}
                            defaultValue={code}
                            onMount={handleEditorDidMount}
                            theme="vs-dark"
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                lineNumbers: 'on',
                                roundedSelection: false,
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                wordWrap: 'on',
                                padding: { top: 16, bottom: 16 },
                                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
                                tabSize: 4,
                                insertSpaces: true,
                            }}
                            loading={<div className="p-4 text-cyan-100">Cargando editor...</div>}
                        />
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={handleRun}
                            disabled={running}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-container text-white font-semibold hover:opacity-95 transition-opacity disabled:opacity-50"
                        >
                            <PlayCircle size={16} />
                            {running ? 'Ejecutando...' : 'Ejecutar y verificar'}
                        </button>
                        <button
                            onClick={handleReset}
                            className="px-5 py-2.5 rounded-full border border-outline-variant/50 text-on-surface-variant dark:text-slate-300 font-semibold hover:bg-surface-container-high transition-colors"
                        >
                            <span className="inline-flex items-center gap-2">
                                <RotateCcw size={14} />
                                Restaurar
                            </span>
                        </button>
                    </div>
                </motion.div>

                {/* Results */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
                    {!showResults ? (
                        <div className="rounded-2xl border border-outline-variant/30 dark:border-slate-800 bg-surface-container-low dark:bg-slate-900/70 p-8 text-center">
                            <Code2 size={40} className="mx-auto text-on-surface-variant/30 dark:text-slate-600 mb-4" />
                            <p className="text-on-surface-variant dark:text-slate-400 text-sm">
                                Escribe tu solución y presiona &ldquo;Ejecutar y verificar&rdquo; para ver los resultados.
                            </p>
                        </div>
                    ) : running ? (
                        <div className="rounded-2xl border border-outline-variant/30 dark:border-slate-800 bg-surface-container-low dark:bg-slate-900/70 p-8 text-center">
                            <div className="w-10 h-10 border-2 border-secondary dark:border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-on-surface-variant dark:text-slate-400 text-sm">Ejecutando tu código...</p>
                        </div>
                    ) : results && (
                        <>
                            <div className={`rounded-2xl border p-6 text-center ${results.allPassed
                                ? 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10'
                                : 'border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10'
                            }`}>
                                {results.allPassed ? (
                                    <Trophy size={40} className="mx-auto text-emerald-500 mb-3" />
                                ) : (
                                    <XCircle size={40} className="mx-auto text-amber-500 mb-3" />
                                )}
                                <h3 className={`text-lg font-black ${results.allPassed ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                                    {results.allPassed ? 'Todas las pruebas pasaron' : `${passedCount}/${totalCount} pruebas pasaron`}
                                </h3>
                                <p className="text-sm text-on-surface-variant dark:text-slate-400 mt-1">
                                    {results.allPassed ? 'Excelente trabajo. Has resuelto el ejercicio correctamente.' : 'Revisa las pruebas que fallaron y ajusta tu solución.'}
                                </p>
                            </div>

                            <div className="space-y-3">
                                {results.results.map((test, i) => (
                                    <div
                                        key={i}
                                        className={`rounded-2xl border p-4 ${test.passed
                                            ? 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/5'
                                            : 'border-red-500/30 bg-red-500/5 dark:bg-red-500/5'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            {test.passed ? (
                                                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                                            ) : (
                                                <XCircle size={16} className="text-red-500 shrink-0" />
                                            )}
                                            <span className="text-sm font-bold text-on-surface dark:text-white">
                                                {test.isHidden ? `Prueba oculta ${i + 1}` : test.name}
                                            </span>
                                        </div>
                                        {!test.isHidden && (
                                            <div className="ml-6 space-y-1 text-xs font-mono">
                                                {test.feedback && (
                                                    <p className={`${test.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                                                        {test.feedback}
                                                    </p>
                                                )}
                                                {!test.passed && (
                                                    <>
                                                        <div className="flex gap-2">
                                                            <span className="text-on-surface-variant dark:text-slate-400 shrink-0">Esperado:</span>
                                                            <span className="text-emerald-600 dark:text-emerald-400 break-all">{test.expected}</span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <span className="text-on-surface-variant dark:text-slate-400 shrink-0">Resultado:</span>
                                                            <span className="text-red-600 dark:text-red-400 break-all">{test.actual}</span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                        {test.isHidden && test.passed && (
                                            <p className="ml-6 text-xs text-emerald-600 dark:text-emerald-400">Prueba superada</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    )
}

export default ExerciseSolve