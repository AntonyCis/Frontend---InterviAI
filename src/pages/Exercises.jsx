import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Braces, Code2, Lightbulb, PlayCircle, ShieldCheck, TerminalSquare } from 'lucide-react'

const exercisesByLanguage = {
  python: {
    title: 'Python para principiantes',
    subtitle: 'Ejercicios básicos para practicar variables, condicionales y bucles.',
    accent: 'from-sky-500/20 to-cyan-500/10',
    badge: 'PYTHON',
    icon: Code2,
    editorHint: '# Escribe tu solución aquí\n# Sugerencia: usa print(), if y for',
    items: [
      {
        title: '1. Saludar al usuario',
        difficulty: 'Muy fácil',
        goal: 'Practicar variables y `print()`.',
        statement: 'Crea una variable llamada nombre y muestra un saludo personalizado en pantalla.'
      },
      {
        title: '2. Par o impar',
        difficulty: 'Fácil',
        goal: 'Usar condicionales `if / else`.',
        statement: 'Define un número y muestra si es par o impar usando el operador módulo.'
      },
      {
        title: '3. Contar del 1 al 5',
        difficulty: 'Fácil',
        goal: 'Practicar un bucle `for`.',
        statement: 'Imprime los números del 1 al 5, uno por línea.'
      }
    ]
  },
  javascript: {
    title: 'JavaScript para principiantes',
    subtitle: 'Ejercicios básicos para practicar variables, funciones y ciclos.',
    accent: 'from-amber-500/20 to-orange-500/10',
    badge: 'JAVASCRIPT',
    icon: Braces,
    editorHint: '// Escribe tu solución aquí\n// Sugerencia: usa console.log(), if y for',
    items: [
      {
        title: '1. Saludar al usuario',
        difficulty: 'Muy fácil',
        goal: 'Practicar variables y `console.log()`.',
        statement: 'Crea una variable llamada nombre y muestra un saludo personalizado en la consola.'
      },
      {
        title: '2. Par o impar',
        difficulty: 'Fácil',
        goal: 'Usar el operador módulo y condicionales.',
        statement: 'Define un número y muestra si es par o impar en la consola.'
      },
      {
        title: '3. Contar del 1 al 5',
        difficulty: 'Fácil',
        goal: 'Practicar un ciclo `for`.',
        statement: 'Imprime los números del 1 al 5 en la consola.'
      }
    ]
  }
}

const buildInitialDrafts = () =>
  Object.fromEntries(
    Object.entries(exercisesByLanguage).map(([language, content]) => [
      language,
      content.items.map(() => content.editorHint)
    ])
  )

const formatValue = (value) => {
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (value == null) return ''

  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

const Exercises = () => {
  const [language, setLanguage] = useState('python')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [drafts, setDrafts] = useState(buildInitialDrafts)
  const [output, setOutput] = useState('Presiona “Ejecutar código” para ver el resultado aquí.')
  const [status, setStatus] = useState('idle')
  const pyodidePromiseRef = useRef(null)

  const currentLanguage = useMemo(() => exercisesByLanguage[language], [language])
  const selectedExercise = currentLanguage.items[selectedIndex] ?? currentLanguage.items[0]
  const selectedCode = drafts[language]?.[selectedIndex] ?? currentLanguage.editorHint
  const Icon = currentLanguage.icon

  const updateLanguage = (nextLanguage) => {
    setLanguage(nextLanguage)
    setSelectedIndex(0)
    setOutput('Selecciona un ejercicio y presiona “Ejecutar código”.')
    setStatus('idle')
  }

  const updateDraft = (value) => {
    setDrafts((current) => ({
      ...current,
      [language]: current[language].map((item, index) => (index === selectedIndex ? value : item))
    }))
  }

  const ensurePyodide = async () => {
    if (window.pyodide) return window.pyodide

    if (!pyodidePromiseRef.current) {
      pyodidePromiseRef.current = new Promise((resolve, reject) => {
        const existingScript = document.querySelector('script[data-pyodide-loader="true"]')

        const loadRuntime = async () => {
          try {
            if (!window.loadPyodide) {
              const script = existingScript || document.createElement('script')
              script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js'
              script.async = true
              script.dataset.pyodideLoader = 'true'
              script.onload = async () => {
                try {
                  window.pyodide = await window.loadPyodide({
                    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/'
                  })
                  resolve(window.pyodide)
                } catch (error) {
                  reject(error)
                }
              }
              script.onerror = () => reject(new Error('No se pudo cargar Pyodide.'))

              if (!existingScript) document.body.appendChild(script)
              return
            }

            window.pyodide = await window.loadPyodide({
              indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/'
            })
            resolve(window.pyodide)
          } catch (error) {
            reject(error)
          }
        }

        loadRuntime()
      })
    }

    return pyodidePromiseRef.current
  }

  const runJavaScript = async (code) => {
    const logs = []
    const errors = []
    const mockConsole = {
      log: (...args) => logs.push(args.map(formatValue).join(' ')),
      error: (...args) => errors.push(args.map(formatValue).join(' ')),
      warn: (...args) => logs.push(args.map(formatValue).join(' '))
    }

    try {
      const runner = new Function(
        'console',
        'prompt',
        'alert',
        `'use strict';\n${code}`
      )

      const result = runner(mockConsole, () => '', () => {})
      if (result instanceof Promise) await result

      const combined = [...logs, ...errors].filter(Boolean).join('\n')
      return combined || 'Código ejecutado sin salida.'
    } catch (error) {
      return error?.message || String(error)
    }
  }

  const runPython = async (code) => {
    try {
      const pyodide = await ensurePyodide()
      const logs = []
      const errors = []

      pyodide.setStdout({
        batched: (text) => logs.push(text)
      })
      pyodide.setStderr({
        batched: (text) => errors.push(text)
      })

      await pyodide.runPythonAsync(code)

      const combined = [...logs, ...errors].filter(Boolean).join('')
      return combined || 'Código ejecutado sin salida.'
    } catch (error) {
      return error?.message || String(error)
    }
  }

  const handleRun = async () => {
    setStatus('running')
    setOutput('Ejecutando código...')

    const code = selectedCode.trim() ? selectedCode : currentLanguage.editorHint
    const result = language === 'python' ? await runPython(code) : await runJavaScript(code)

    setOutput(result)
    setStatus('done')
  }

  const handleReset = () => {
    setDrafts((current) => ({
      ...current,
      [language]: current[language].map((item, index) =>
        index === selectedIndex ? currentLanguage.editorHint : item
      )
    }))
    setOutput('Editor restaurado. Ahora puedes escribir tu solución.')
    setStatus('idle')
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <header className="relative overflow-hidden rounded-[2rem] border border-outline-variant/40 dark:border-slate-800 bg-surface-container-low/80 dark:bg-slate-900/70 p-6 md:p-8">
        <div className={`absolute inset-0 bg-gradient-to-br ${currentLanguage.accent}`} />
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary-container/30 dark:bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary-container text-white shadow-lg">
              <TerminalSquare size={26} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-on-surface-variant dark:text-slate-400 font-semibold">
                Ruta de aprendizaje
              </p>
              <h1 className="text-3xl md:text-4xl font-headline font-black text-primary-container dark:text-white tracking-tight">
                Ejercicios para principiantes
              </h1>
            </div>
          </div>

          <p className="max-w-3xl text-on-surface-variant dark:text-slate-300 text-base md:text-lg leading-relaxed">
            Elige un lenguaje, abre un ejercicio y escribe tu solución dentro del editor. Abajo verás la salida del código que ejecutes.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => updateLanguage('python')}
              className={`px-4 py-2 rounded-full border text-sm font-semibold transition-all ${language === 'python' ? 'bg-primary-container text-white border-primary-container' : 'bg-transparent border-outline-variant/50 text-on-surface-variant dark:text-slate-300 hover:bg-surface-container-high'}`}
            >
              Python
            </button>
            <button
              onClick={() => updateLanguage('javascript')}
              className={`px-4 py-2 rounded-full border text-sm font-semibold transition-all ${language === 'javascript' ? 'bg-primary-container text-white border-primary-container' : 'bg-transparent border-outline-variant/50 text-on-surface-variant dark:text-slate-300 hover:bg-surface-container-high'}`}
            >
              JavaScript
            </button>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <aside className="xl:col-span-4 space-y-4">
          <div className="rounded-3xl border border-outline-variant/40 dark:border-slate-800 bg-surface-container-low/80 dark:bg-slate-900/70 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary-container dark:bg-cyan-500/20 flex items-center justify-center text-secondary dark:text-cyan-300">
                <Icon size={24} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant dark:text-slate-400 font-semibold">Lenguaje actual</p>
                <h2 className="text-2xl font-bold text-primary-container dark:text-white capitalize">{language}</h2>
              </div>
            </div>

            <p className="text-on-surface-variant dark:text-slate-300 text-sm leading-relaxed mb-5">
              {currentLanguage.subtitle}
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Lightbulb size={16} className="mt-1 text-amber-500 shrink-0" />
                <p className="text-on-surface-variant dark:text-slate-300">Lee el enunciado y crea tu propia solución dentro del editor.</p>
              </div>
              <div className="flex items-start gap-3">
                <PlayCircle size={16} className="mt-1 text-emerald-500 shrink-0" />
                <p className="text-on-surface-variant dark:text-slate-300">Ejecuta el código para revisar el resultado o los errores en la consola.</p>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck size={16} className="mt-1 text-secondary dark:text-cyan-400 shrink-0" />
                <p className="text-on-surface-variant dark:text-slate-300">No mostramos soluciones resueltas: la idea es practicar de verdad.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {currentLanguage.items.map((exercise, index) => {
              const isSelected = index === selectedIndex

              return (
                <button
                  key={exercise.title}
                  onClick={() => setSelectedIndex(index)}
                  className={`text-left rounded-3xl border p-5 transition-all shadow-sm ${isSelected ? 'border-primary-container bg-primary-container/10 dark:bg-cyan-500/10' : 'border-outline-variant/40 dark:border-slate-800 bg-surface dark:bg-slate-900/70 hover:border-secondary/40 dark:hover:border-cyan-500/40'}`}
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-[10px] uppercase tracking-[0.35em] font-bold text-secondary dark:text-cyan-400">{currentLanguage.badge}</span>
                    <span className="text-[10px] uppercase tracking-widest text-on-surface-variant dark:text-slate-400">{exercise.difficulty}</span>
                  </div>
                  <h3 className="text-lg font-black text-primary-container dark:text-white tracking-tight">{exercise.title}</h3>
                  <p className="mt-2 text-sm text-on-surface-variant dark:text-slate-300 line-clamp-2">{exercise.statement}</p>
                </button>
              )
            })}
          </div>
        </aside>

        <div className="xl:col-span-8 space-y-6">
          <motion.article
            key={`${language}-${selectedIndex}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-[2rem] border border-outline-variant/40 dark:border-slate-800 bg-surface dark:bg-slate-900/70 p-6 md:p-7 shadow-sm"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] uppercase tracking-[0.35em] font-bold text-secondary dark:text-cyan-400">{currentLanguage.badge}</span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest bg-secondary-container/70 dark:bg-cyan-500/15 text-secondary dark:text-cyan-300">
                    {selectedExercise.difficulty}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-primary-container dark:text-white tracking-tight">{selectedExercise.title}</h3>
                <p className="mt-2 text-sm text-on-surface-variant dark:text-slate-300">
                  <span className="font-semibold text-on-surface dark:text-white">Objetivo:</span> {selectedExercise.goal}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-on-surface-variant dark:text-slate-400">
                <ArrowRight size={14} />
                Ejercicio {selectedIndex + 1}
              </div>
            </div>

            <div className="rounded-2xl bg-surface-container-low dark:bg-slate-950/70 border border-outline-variant/30 dark:border-slate-800 p-4 mb-5">
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-on-surface-variant dark:text-slate-400 mb-2">Enunciado</p>
              <p className="text-sm md:text-base text-on-surface dark:text-slate-100 leading-relaxed">{selectedExercise.statement}</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden border border-outline-variant/30 dark:border-slate-800 bg-[#0b1020] shadow-inner">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 text-white/80 text-xs uppercase tracking-[0.3em] font-semibold">
                    <span>Editor de código</span>
                    <span>{currentLanguage.badge}</span>
                  </div>
                  <textarea
                    value={selectedCode}
                    onChange={(event) => updateDraft(event.target.value)}
                    spellCheck={false}
                    className="w-full min-h-[320px] p-4 md:p-5 bg-transparent text-cyan-100 font-mono text-sm leading-7 resize-y outline-none placeholder:text-cyan-100/50"
                    placeholder={currentLanguage.editorHint}
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleRun}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary-container text-white font-semibold hover:opacity-95 transition-opacity"
                  >
                    <PlayCircle size={16} />
                    Ejecutar código
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2.5 rounded-full border border-outline-variant/50 text-on-surface-variant dark:text-slate-300 font-semibold hover:bg-surface-container-high transition-colors"
                  >
                    Limpiar editor
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 p-4">
                  <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-amber-600 dark:text-amber-400 mb-2">Pista</p>
                  <p className="text-sm text-on-surface-variant dark:text-slate-300 leading-relaxed">
                    {status === 'running'
                      ? 'Estamos ejecutando tu código. En unos segundos verás el resultado.'
                      : 'Escribe tu solución, ejecuta el código y revisa el resultado en la consola inferior.'}
                  </p>
                </div>

                <div className="rounded-2xl overflow-hidden border border-outline-variant/30 dark:border-slate-800 bg-surface-container-low dark:bg-slate-950/70">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/20 dark:border-slate-800 text-xs uppercase tracking-[0.3em] font-semibold text-on-surface-variant dark:text-slate-400">
                    <span>Resultados</span>
                    <span>{status === 'running' ? 'EJECUTANDO' : 'SALIDA'}</span>
                  </div>
                  <pre className="min-h-[320px] p-4 md:p-5 whitespace-pre-wrap break-words text-sm leading-7 font-mono text-on-surface dark:text-slate-100">
                    {output}
                  </pre>
                </div>
              </div>
            </div>
          </motion.article>
        </div>
      </section>
    </div>
  )
}

export default Exercises
