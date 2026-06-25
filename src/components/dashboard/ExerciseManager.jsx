import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Plus, Edit3, Trash2, X, Check, Loader2, Code2, Zap, Star } from 'lucide-react'
import axios from 'axios'
import storeAuth from '../../context/storeAuth'
import { toast } from 'react-toastify'

const DIFFICULTY_MAP = { muy_facil: 'Muy Fácil', facil: 'Fácil', medio: 'Medio', dificil: 'Difícil' }
const DIFFICULTY_COLORS = { muy_facil: 'bg-emerald-500/10 text-emerald-400', facil: 'bg-cyan-500/10 text-cyan-400', medio: 'bg-amber-500/10 text-amber-400', dificil: 'bg-red-500/10 text-red-400' }
const LANGUAGES = ['python', 'javascript', 'sql']
const DIFFICULTIES = ['muy_facil', 'facil', 'medio', 'dificil']

const emptyForm = { title: '', description: '', language: 'python', difficulty: 'facil', goal: '', hint: '', starterCode: '', tests: [{ name: 'Test 1', input: null, expectedOutput: '', isHidden: false }], order: 0 }

const ExerciseManager = () => {
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteId, setDeleteId] = useState(null)
  const { token } = storeAuth()
  const URL_BACK = import.meta.env.VITE_BACKEND_URL

  const fetchExercises = useCallback(async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${URL_BACK}/exercise`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setExercises(response.data || [])
    } catch (error) {
      console.error('Error al cargar ejercicios', error)
      toast.error('Error al cargar ejercicios')
    } finally {
      setLoading(false)
    }
  }, [URL_BACK, token])

  useEffect(() => { fetchExercises() }, [fetchExercises])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  const openEdit = (ex) => {
    setEditingId(ex._id)
    setForm({
      title: ex.title || '',
      description: ex.description || '',
      language: ex.language || 'python',
      difficulty: ex.difficulty || 'facil',
      goal: ex.goal || '',
      hint: ex.hint || '',
      starterCode: ex.starterCode || '',
      tests: ex.tests?.length > 0 ? ex.tests.map(t => ({ name: t.name || '', input: t.input, expectedOutput: t.expectedOutput || '', isHidden: t.isHidden || false })) : [{ name: 'Test 1', input: null, expectedOutput: '', isHidden: false }],
      order: ex.order || 0
    })
    setShowModal(true)
  }

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.goal) {
      toast.error('Completa los campos requeridos: título, descripción y objetivo')
      return
    }
    try {
      const cleanForm = {
        ...form,
        tests: form.tests.filter(t => t.name && t.expectedOutput)
      }
      if (editingId) {
        await axios.put(`${URL_BACK}/admin/ejercicios/${editingId}`, cleanForm, {
          headers: { Authorization: `Bearer ${token}` }
        })
        toast.success('Ejercicio actualizado')
      } else {
        await axios.post(`${URL_BACK}/admin/ejercicios`, cleanForm, {
          headers: { Authorization: `Bearer ${token}` }
        })
        toast.success('Ejercicio creado')
      }
      setShowModal(false)
      fetchExercises()
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Error al guardar ejercicio')
    }
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`${URL_BACK}/admin/ejercicios/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Ejercicio eliminado')
      setDeleteId(null)
      fetchExercises()
    } catch (error) {
      toast.error('Error al eliminar ejercicio')
    }
  }

  const addTest = () => {
    setForm(f => ({
      ...f,
      tests: [...f.tests, { name: `Test ${f.tests.length + 1}`, input: null, expectedOutput: '', isHidden: false }]
    }))
  }

  const removeTest = (index) => {
    setForm(f => ({ ...f, tests: f.tests.filter((_, i) => i !== index) }))
  }

  const updateTest = (index, field, value) => {
    setForm(f => ({
      ...f,
      tests: f.tests.map((t, i) => i === index ? { ...t, [field]: value } : t)
    }))
  }

  if (loading) return (
    <div className="p-10 flex items-center justify-center gap-3 text-secondary dark:text-cyan-400">
      <Loader2 className="animate-spin" size={18} />
      <p className="text-sm font-medium">Cargando ejercicios...</p>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-headline font-bold text-primary-container dark:text-white tracking-tight">Gestión de Ejercicios</h2>
          <p className="text-on-surface-variant dark:text-slate-400 text-xs font-label tracking-widest uppercase">
            {exercises.length} ejercicios disponibles
          </p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary dark:bg-cyan-500 text-white text-sm font-semibold hover:bg-secondary-fixed dark:hover:bg-cyan-600 transition-colors">
          <Plus size={16} /> Nuevo Ejercicio
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map((ex, i) => (
          <motion.div
            key={ex._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-5 rounded-2xl bg-surface-container-low dark:bg-slate-900/70 border border-outline-variant/50 dark:border-slate-800 group hover:border-secondary/30 dark:hover:border-cyan-500/30 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Code2 size={16} />
                </div>
                <span className={`text-[9px] font-semibold px-2 py-1 rounded-full border ${DIFFICULTY_COLORS[ex.difficulty] || 'bg-gray-500/10 text-gray-400'}`}>
                  {DIFFICULTY_MAP[ex.difficulty] || ex.difficulty}
                </span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(ex)} className="p-1.5 rounded-lg hover:bg-surface-container-high dark:hover:bg-slate-700 text-on-surface-variant dark:text-slate-400 hover:text-cyan-400 transition-colors">
                  <Edit3 size={14} />
                </button>
                <button onClick={() => setDeleteId(ex._id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-on-surface-variant dark:text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <h3 className="font-bold text-on-surface dark:text-white mb-1 text-sm">{ex.title}</h3>
            <p className="text-xs text-on-surface-variant dark:text-slate-400 line-clamp-2 mb-3">{ex.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-surface dark:bg-slate-800 border border-outline-variant/30 dark:border-slate-700 text-on-surface-variant dark:text-slate-400 uppercase">
                {ex.language}
              </span>
              <span className="text-[10px] text-on-surface-variant dark:text-slate-500 flex items-center gap-1">
                <Zap size={12} /> {ex.tests?.length || 0} tests
              </span>
            </div>
          </motion.div>
        ))}
        {exercises.length === 0 && (
          <div className="col-span-full p-12 text-center text-on-surface-variant dark:text-slate-400">
            <BookOpen size={32} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No hay ejercicios creados aún</p>
            <button onClick={openCreate} className="mt-3 text-sm text-secondary dark:text-cyan-400 hover:underline">Crear el primero</button>
          </div>
        )}
      </div>

      {/* Modal Crear/Editar Ejercicio */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-surface dark:bg-slate-900 rounded-2xl border border-outline-variant/40 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-outline-variant/30 dark:border-slate-800 flex justify-between items-center">
                <h3 className="text-lg font-headline font-bold text-primary-container dark:text-white">
                  {editingId ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}
                </h3>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-surface-container-low dark:hover:bg-slate-800 transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant dark:text-slate-400 block mb-1">Título *</label>
                    <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700 text-sm text-on-surface dark:text-white focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-cyan-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant dark:text-slate-400 block mb-1">Lenguaje *</label>
                    <select value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700 text-sm text-on-surface dark:text-white focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-cyan-500">
                      {LANGUAGES.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant dark:text-slate-400 block mb-1">Dificultad</label>
                    <select value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700 text-sm text-on-surface dark:text-white focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-cyan-500">
                      {DIFFICULTIES.map(d => <option key={d} value={d}>{DIFFICULTY_MAP[d]}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant dark:text-slate-400 block mb-1">Orden</label>
                    <input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700 text-sm text-on-surface dark:text-white focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-cyan-500" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant dark:text-slate-400 block mb-1">Descripción *</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700 text-sm text-on-surface dark:text-white focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-cyan-500 resize-none" />
                </div>

                <div>
                  <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant dark:text-slate-400 block mb-1">Objetivo *</label>
                  <textarea value={form.goal} onChange={e => setForm(f => ({ ...f, goal: e.target.value }))} rows={2}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700 text-sm text-on-surface dark:text-white focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-cyan-500 resize-none" />
                </div>

                <div>
                  <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant dark:text-slate-400 block mb-1">Pista (Hint)</label>
                  <input value={form.hint} onChange={e => setForm(f => ({ ...f, hint: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700 text-sm text-on-surface dark:text-white focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-cyan-500" />
                </div>

                <div>
                  <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant dark:text-slate-400 block mb-1">Código Inicial</label>
                  <textarea value={form.starterCode} onChange={e => setForm(f => ({ ...f, starterCode: e.target.value }))} rows={4}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700 text-sm text-on-surface dark:text-white focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-cyan-500 font-mono resize-none" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant dark:text-slate-400">Tests</label>
                    <button type="button" onClick={addTest}
                      className="text-xs flex items-center gap-1 px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors">
                      <Plus size={12} /> Agregar Test
                    </button>
                  </div>
                  <div className="space-y-3">
                    {form.tests.map((test, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-surface dark:bg-slate-800 border border-outline-variant/30 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-on-surface-variant dark:text-slate-400">Test #{idx + 1}</span>
                          <div className="flex items-center gap-2">
                            <label className="flex items-center gap-1 text-[10px] text-on-surface-variant dark:text-slate-400">
                              <input type="checkbox" checked={test.isHidden} onChange={e => updateTest(idx, 'isHidden', e.target.checked)}
                                className="rounded" /> Oculto
                            </label>
                            {form.tests.length > 1 && (
                              <button onClick={() => removeTest(idx)} className="text-red-400 hover:text-red-300 text-xs">✕</button>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <input placeholder="Nombre del test" value={test.name} onChange={e => updateTest(idx, 'name', e.target.value)}
                            className="px-2 py-1.5 rounded-lg bg-surface-container-low dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-600 text-xs text-on-surface dark:text-white focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                          <input placeholder="Entrada (input)" value={test.input || ''} onChange={e => updateTest(idx, 'input', e.target.value)}
                            className="px-2 py-1.5 rounded-lg bg-surface-container-low dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-600 text-xs text-on-surface dark:text-white focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                          <input placeholder="Salida esperada *" value={test.expectedOutput} onChange={e => updateTest(idx, 'expectedOutput', e.target.value)}
                            className="px-2 py-1.5 rounded-lg bg-surface-container-low dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-600 text-xs text-on-surface dark:text-white focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-outline-variant/30 dark:border-slate-800 flex justify-end gap-2">
                <button onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-surface dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700 text-sm font-semibold text-on-surface-variant dark:text-slate-400 hover:bg-surface-container-high dark:hover:bg-slate-700 transition-colors">
                  Cancelar
                </button>
                <button onClick={handleSubmit}
                  className="px-4 py-2 rounded-xl bg-secondary dark:bg-cyan-500 text-white text-sm font-semibold hover:bg-secondary-fixed dark:hover:bg-cyan-600 transition-colors flex items-center gap-2">
                  <Check size={16} /> {editingId ? 'Guardar Cambios' : 'Crear Ejercicio'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Confirmar Eliminación */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setDeleteId(null)}
          >
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-surface dark:bg-slate-900 rounded-2xl border border-outline-variant/40 dark:border-slate-800 w-full max-w-sm"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={24} className="text-red-500" />
                </div>
                <h3 className="text-lg font-headline font-bold text-primary-container dark:text-white mb-2">¿Eliminar ejercicio?</h3>
                <p className="text-sm text-on-surface-variant dark:text-slate-400">Esta acción no se puede deshacer.</p>
              </div>
              <div className="p-4 border-t border-outline-variant/30 dark:border-slate-800 flex justify-end gap-2">
                <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl bg-surface dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700 text-sm font-semibold text-on-surface-variant dark:text-slate-400 hover:bg-surface-container-high dark:hover:bg-slate-700 transition-colors">
                  Cancelar
                </button>
                <button onClick={handleDelete} className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors">
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ExerciseManager