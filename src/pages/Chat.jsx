import { useState, useRef, useEffect, useCallback } from "react"
import { useParams, useNavigate } from "react-router"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Sparkles, Loader2, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { useFetch } from "../hooks/useFetch" 
import storeAuth from "../context/storeAuth"
import { toast } from "react-toastify"

const ChatInterview = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const fetchDataBackend = useFetch()
    const { token } = storeAuth()
    
    const [interviewData, setInterviewData] = useState(null)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [messages, setMessages] = useState([])
    const [inputValue, setInputValue] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [answers, setAnswers] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)
    const [elapsedTime, setElapsedTime] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const scrollRef = useRef(null)
    const currentQuestionIndexRef = useRef(0)
    const answersRef = useRef([])
    const interviewDataRef = useRef(null)

    useEffect(() => { currentQuestionIndexRef.current = currentQuestionIndex }, [currentQuestionIndex])
    useEffect(() => { answersRef.current = answers }, [answers])
    useEffect(() => { interviewDataRef.current = interviewData }, [interviewData])

    useEffect(() => {
        if (!isPaused && interviewData && !isCompleted) {
            const interval = setInterval(() => {
                setElapsedTime(prev => prev + 1)
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [isPaused, interviewData, isCompleted])

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const loadInterview = useCallback(async () => {
        try {
            const data = await fetchDataBackend(
                `${import.meta.env.VITE_BACKEND_URL}/interview/detail/${id}`,
                null,
                'GET',
                { Authorization: `Bearer ${token}` },
                { silent: true }
            )

            if (data) {
                setInterviewData(data)
                
                const answeredQuestions = data.questions?.filter(q => q.userAnswer && q.userAnswer.trim() !== '') || []
                const startIndex = answeredQuestions.length
                
                setAnswers(data.questions?.map(q => q.userAnswer || '') || [])
                setCurrentQuestionIndex(startIndex)

                const initialMessages = [
                    { id: 'system-1', user: "IntervIAl", text: `Bienvenido a tu entrevista de tipo ${data.type}. Responde cada pregunta con calma y detalle.`, type: "other" }
                ]

                if (data.status === 'completed') {
                    setIsCompleted(true)
                    setIsPaused(true)
                    initialMessages.push({
                        id: 'system-done',
                        user: "IntervIAl",
                        text: "Esta entrevista ya fue completada. Revisa los resultados en el panel de detalles.",
                        type: "other"
                    })
                    setMessages(initialMessages)
                    return
                }

                if (startIndex > 0) {
                    initialMessages.push({
                        id: 'system-resume',
                        user: "IntervIAl",
                        text: `Retomando desde la pregunta ${startIndex + 1}. Ya respondiste ${startIndex} de ${data.questions.length} preguntas.`,
                        type: "other"
                    })
                }

                if (startIndex < data.questions.length) {
                    initialMessages.push({
                        id: `q-${startIndex}`,
                        user: "IntervIAl",
                        text: data.questions[startIndex].questionText,
                        type: "other"
                    })
                }

                setMessages(initialMessages)
            }
        } catch {
            toast.error("No se pudo cargar la entrevista")
            navigate("/dashboard/list")
        }
    }, [id, token, fetchDataBackend, navigate])

    useEffect(() => {
        loadInterview()
    }, [loadInterview])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const submitAllAnswers = async (allAnswers) => {
        setIsSubmitting(true)
        setIsPaused(true)
        
        try {
            const result = await fetchDataBackend(
                `${import.meta.env.VITE_BACKEND_URL}/interview/submit`,
                { interviewId: id, answers: allAnswers },
                'POST',
                { Authorization: `Bearer ${token}` }
            )

            if (result) {
                setIsCompleted(true)
                toast.success(`Entrevista evaluada. Puntaje: ${result.scoreTotal}/10`)
                
                setTimeout(() => {
                    navigate(`/dashboard/details/${id}`)
                }, 3000)
            }
        } catch {
            toast.error("Error al enviar respuestas. Intenta de nuevo.")
            setIsSubmitting(false)
            setIsPaused(false)
        }
    }

    const handleSendMessage = (e) => {
        if (e) e.preventDefault()
        if (inputValue.trim() === "" || isTyping || isCompleted || isSubmitting) return

        const userMessage = { id: Date.now(), user: "Tu", text: inputValue, type: "me" }
        setMessages(prev => [...prev, userMessage])
        
        const currentIndex = currentQuestionIndexRef.current
        const currentAnswers = [...answersRef.current]
        currentAnswers[currentIndex] = inputValue
        setAnswers(currentAnswers)
        answersRef.current = currentAnswers
        
        setInputValue("")
        setIsTyping(true)

        const nextIndex = currentIndex + 1
        
        setTimeout(() => {
            const questions = interviewDataRef.current?.questions
            if (!questions) return

            if (nextIndex < questions.length) {
                const nextMessage = { 
                    id: Date.now() + 1, 
                    user: "IntervIAl", 
                    text: questions[nextIndex].questionText, 
                    type: "other" 
                }
                setMessages(prev => [...prev, nextMessage])
                setCurrentQuestionIndex(nextIndex)
                currentQuestionIndexRef.current = nextIndex
                setIsTyping(false)
            } else {
                const completionMessage = { 
                    id: Date.now() + 1, 
                    user: "IntervIAl", 
                    text: "Has completado todas las preguntas. Procesando tu evaluacion con IA...", 
                    type: "other" 
                }
                setMessages(prev => [...prev, completionMessage])
                setIsTyping(false)
                submitAllAnswers(currentAnswers)
            }
        }, 1200)
    }

    const handleSkip = () => {
        if (isTyping || isCompleted || isSubmitting) return
        
        const currentIndex = currentQuestionIndexRef.current
        const currentAnswers = [...answersRef.current]
        currentAnswers[currentIndex] = ""
        setAnswers(currentAnswers)
        answersRef.current = currentAnswers

        const nextIndex = currentIndex + 1
        const questions = interviewDataRef.current?.questions
        if (!questions) return

        if (nextIndex < questions.length) {
            setMessages(prev => [...prev, 
                { id: Date.now(), user: "Tu", text: "[Pregunta omitida]", type: "me" },
                { id: Date.now() + 1, user: "IntervIAl", text: questions[nextIndex].questionText, type: "other" }
            ])
            setCurrentQuestionIndex(nextIndex)
            currentQuestionIndexRef.current = nextIndex
        } else {
            setMessages(prev => [...prev, 
                { id: Date.now(), user: "Tu", text: "[Pregunta omitida]", type: "me" },
                { id: Date.now() + 1, user: "IntervIAl", text: "Has completado todas las preguntas. Procesando tu evaluacion con IA...", type: "other" }
            ])
            submitAllAnswers(currentAnswers)
        }
    }

    if (!interviewData) return (
        <div className="h-screen w-full flex items-center justify-center bg-surface dark:bg-slate-950">
            <Loader2 className="animate-spin text-emerald-500" size={48} />
        </div>
    )

    const progress = interviewData.questions.length > 0 
        ? ((currentQuestionIndex + (isCompleted ? 1 : 0)) / interviewData.questions.length) * 100 
        : 0

    return (
        <div className="w-full h-screen flex flex-col bg-surface dark:bg-slate-950 text-on-surface dark:text-slate-100">
            <header className="px-6 py-4 flex items-center justify-between border-b border-outline-variant/30 dark:border-zinc-800 bg-surface/80 dark:bg-slate-950/80 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-emerald-500 animate-pulse'}`} />
                        <span className="font-bold text-emerald-500 text-sm">
                            {isCompleted ? 'COMPLETADA' : 'EN CURSO'}
                        </span>
                    </div>
                    <span className="text-on-surface-variant dark:text-zinc-400 text-sm">|</span>
                    <span className="text-sm font-medium text-on-surface-variant dark:text-zinc-400">
                        {interviewData.type.toUpperCase()}
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm font-mono text-on-surface-variant dark:text-zinc-400">
                        <Clock size={14} />
                        {formatTime(elapsedTime)}
                    </div>
                    <div className="text-xs font-black bg-surface-container-high dark:bg-zinc-800 px-3 py-1.5 rounded-full text-on-surface dark:text-slate-200">
                        {Math.min(currentQuestionIndex + 1, interviewData.questions.length)} / {interviewData.questions.length}
                    </div>
                </div>
            </header>

            <div className="w-full h-1 bg-surface-container-high dark:bg-zinc-800">
                <motion.div 
                    className="h-full bg-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            <main ref={scrollRef} className="flex-1 overflow-y-auto w-full max-w-3xl mx-auto px-4 py-8 space-y-10">
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div 
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-4 md:gap-6"
                        >
                            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                                msg.type === 'me' ? 'bg-surface-container-high dark:bg-zinc-800' : 'bg-emerald-500/10 text-emerald-500'
                            }`}>
                                {msg.type === 'me' ? <span className="text-[10px] font-bold">Tu</span> : <Sparkles size={16} />}
                            </div>
                            <div className="flex-1 pt-1">
                                <p className="text-lg leading-relaxed whitespace-pre-wrap font-medium">
                                    {msg.text}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                    {isTyping && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 px-14">
                            <span className="text-xs text-emerald-500 animate-pulse font-bold">IntervIAl esta analizando...</span>
                        </motion.div>
                    )}
                    {isSubmitting && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 px-14 py-4">
                            <Loader2 className="animate-spin text-emerald-500" size={20} />
                            <span className="text-sm text-on-surface-variant dark:text-zinc-400 font-medium">Evaluando tus respuestas con IA...</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {!isCompleted && !isSubmitting && (
                <footer className="w-full max-w-4xl mx-auto p-4 md:p-6">
                    <div className="flex items-center gap-2 mb-3 px-2">
                        {interviewData.questions.map((_, i) => (
                            <div 
                                key={i} 
                                className={`h-1.5 flex-1 rounded-full transition-colors ${
                                    i < currentQuestionIndex 
                                        ? answers[i] ? 'bg-emerald-500' : 'bg-amber-500'
                                        : i === currentQuestionIndex 
                                            ? 'bg-emerald-500/50' 
                                            : 'bg-surface-container-high dark:bg-zinc-700'
                                }`}
                            />
                        ))}
                    </div>
                    
                    <form onSubmit={(e) => { e.preventDefault(); handleSendMessage() }} className="relative bg-surface-container-high dark:bg-slate-800 rounded-[2rem] p-2 border border-transparent focus-within:border-emerald-500/50 transition-all">
                        <div className="flex items-center gap-3 px-6 py-2">
                            <textarea 
                                rows={1}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault()
                                        handleSendMessage()
                                    }
                                }}
                                placeholder="Responde a la pregunta..." 
                                className="flex-1 bg-transparent py-3 text-lg outline-none resize-none placeholder-on-surface-variant dark:text-white"
                            />
                            <button
                                type="button"
                                onClick={handleSkip}
                                disabled={isTyping}
                                className="p-2.5 rounded-full text-on-surface-variant dark:text-zinc-400 hover:text-amber-500 hover:bg-amber-500/10 transition-all disabled:opacity-30"
                                title="Omitir pregunta"
                            >
                                <AlertCircle size={18} />
                            </button>
                            <button 
                                type="submit"
                                disabled={!inputValue.trim() || isTyping}
                                className={`p-3.5 rounded-full transition-all ${
                                    inputValue.trim() ? 'bg-emerald-500 text-white' : 'text-on-surface-variant dark:text-zinc-400 opacity-50'
                                }`}
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </form>
                </footer>
            )}

            {isCompleted && (
                <footer className="w-full max-w-4xl mx-auto p-4 md:p-6">
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 text-center">
                        <CheckCircle2 className="mx-auto text-emerald-500 mb-3" size={32} />
                        <p className="text-emerald-700 dark:text-emerald-300 font-bold">
                            Entrevista completada. Redirigiendo a los resultados...
                        </p>
                    </div>
                </footer>
            )}
        </div>
    )
}

export default ChatInterview