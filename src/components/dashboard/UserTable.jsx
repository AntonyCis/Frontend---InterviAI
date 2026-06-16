import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Shield, Loader2, Mail, Search, ChevronLeft, ChevronRight, Edit3, Trash2, X, Check, Phone, MapPin, Calendar } from 'lucide-react'
import axios from 'axios'
import storeAuth from '../../context/storeAuth'
import { toast } from 'react-toastify'

const UserTable = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [editUser, setEditUser] = useState(null)
  const [deleteUser, setDeleteUser] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [detailUser, setDetailUser] = useState(null)
  const { token } = storeAuth()
  const URL_BACK = import.meta.env.VITE_BACKEND_URL
  const limit = 8

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit }
      if (search) params.q = search
      const response = await axios.get(`${URL_BACK}/admin/usuarios`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      })
      setUsers(response.data.usuarios)
      setTotal(response.data.total)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error('Error al obtener usuarios', error)
      toast.error('Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }, [URL_BACK, token, page, search])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    setSearch(searchInput)
  }

  const openEdit = (user) => {
    setEditUser(user._id)
    setEditForm({
      nombre: user.nombre || '',
      apellido: user.apellido || '',
      email: user.email || '',
      direccion: user.direccion || '',
      celular: user.celular || '',
      rol: user.rol || 'usuario',
      status: user.status !== false
    })
  }

  const handleEditSubmit = async () => {
    try {
      await axios.put(`${URL_BACK}/admin/usuarios/${editUser}`, {
        ...editForm,
        status: editForm.status
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Usuario actualizado')
      setEditUser(null)
      fetchUsers()
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Error al actualizar')
    }
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`${URL_BACK}/admin/usuarios/${deleteUser}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Usuario eliminado')
      setDeleteUser(null)
      fetchUsers()
    } catch (error) {
      toast.error('Error al eliminar usuario')
    }
  }

  const openDetail = async (userId) => {
    try {
      const response = await axios.get(`${URL_BACK}/admin/usuarios/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setDetailUser(response.data)
    } catch (error) {
      toast.error('Error al cargar detalle')
    }
  }

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('es-EC', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="p-6 rounded-2xl bg-surface-container-low dark:bg-slate-900/70 border border-outline-variant/50 dark:border-slate-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant dark:text-slate-400">Total Usuarios</p>
              <h3 className="text-4xl font-bold text-on-surface dark:text-white mt-1">{total}</h3>
            </div>
            <div className="p-4 bg-secondary-container dark:bg-cyan-500/20 rounded-xl text-secondary dark:text-cyan-300"><Users size={24}/></div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-surface-container-low dark:bg-slate-900/70 border border-outline-variant/50 dark:border-slate-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant dark:text-slate-400">Página</p>
              <h3 className="text-4xl font-bold text-on-surface dark:text-white mt-1">{page}<span className="text-xl text-on-surface-variant">/{totalPages || 1}</span></h3>
            </div>
            <div className="p-4 bg-amber-500/10 rounded-xl text-amber-500"><Shield size={24}/></div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-surface-container-low dark:bg-slate-900/70 border border-outline-variant/50 dark:border-slate-800 rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-outline-variant/30 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-headline font-bold tracking-tight text-primary-container dark:text-white">Gestión de Usuarios</h2>
              <p className="text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant dark:text-slate-400">{total} registros encontrados</p>
            </div>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o email..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-xl bg-surface dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700 text-sm text-on-surface dark:text-white placeholder:text-on-surface-variant dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-cyan-500 w-56"
                />
              </div>
              <button type="submit" className="px-4 py-2 rounded-xl bg-secondary dark:bg-cyan-500 text-white text-sm font-semibold hover:bg-secondary-fixed dark:hover:bg-cyan-600 transition-colors">
                Buscar
              </button>
              {search && (
                <button type="button" onClick={() => { setSearchInput(''); setSearch(''); setPage(1) }}
                  className="px-3 py-2 rounded-xl bg-surface dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700 text-sm text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-white transition-colors">
                  Limpiar
                </button>
              )}
            </form>
          </div>
        </div>

        {loading ? (
          <div className="p-10 flex items-center justify-center gap-3 text-secondary dark:text-cyan-400">
            <Loader2 className="animate-spin" size={18} />
            <p className="text-sm font-medium">Cargando usuarios...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant dark:text-slate-400 border-b border-outline-variant/30 dark:border-slate-800">
                    <th className="px-6 py-4">Usuario</th>
                    <th className="px-6 py-4">Contacto</th>
                    <th className="px-6 py-4">Rol</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4">Registro</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 dark:divide-slate-800">
                  {users.length > 0 ? (
                    users.map((u) => (
                      <tr key={u._id} className="group hover:bg-surface dark:hover:bg-slate-800/60 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-surface-container-high dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-on-surface dark:text-white border border-outline-variant/40 dark:border-slate-700">
                              {u.nombre?.substring(0,2).toUpperCase()}
                            </div>
                            <button onClick={() => openDetail(u._id)} className="text-sm font-semibold text-on-surface dark:text-white tracking-tight hover:text-secondary dark:hover:text-cyan-400 transition-colors text-left">
                              {u.nombre} {u.apellido}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs text-on-surface-variant dark:text-slate-400 flex items-center gap-1.5"><Mail size={12}/> {u.email}</span>
                            {u.celular && <span className="text-xs text-on-surface-variant dark:text-slate-400 flex items-center gap-1.5"><Phone size={12}/> {u.celular}</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[9px] font-semibold px-3 py-1 rounded-full border ${
                            u.rol === 'administrador' || u.rol === 'admin'
                              ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                              : 'bg-secondary-container dark:bg-cyan-500/20 text-secondary dark:text-cyan-300 border-secondary/20 dark:border-cyan-400/20'
                          }`}>
                            {u.rol?.toUpperCase() || 'USUARIO'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[9px] font-semibold px-3 py-1 rounded-full border ${
                            u.status !== false
                              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                              : 'bg-red-500/10 text-red-500 border-red-500/20'
                          }`}>
                            {u.status !== false ? 'ACTIVO' : 'INACTIVO'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-on-surface-variant dark:text-slate-400 flex items-center gap-1.5">
                            <Calendar size={12} /> {formatDate(u.createdAt)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => openEdit(u)} className="p-2 rounded-lg hover:bg-surface-container-high dark:hover:bg-slate-700 text-on-surface-variant dark:text-slate-400 hover:text-secondary dark:hover:text-cyan-400 transition-colors" title="Editar">
                              <Edit3 size={14} />
                            </button>
                            <button onClick={() => setDeleteUser(u._id)} className="p-2 rounded-lg hover:bg-red-500/10 text-on-surface-variant dark:text-slate-400 hover:text-red-500 transition-colors" title="Eliminar">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-8 py-10 text-center text-on-surface-variant dark:text-slate-400 text-sm">
                        No se encontraron usuarios
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="p-4 border-t border-outline-variant/30 dark:border-slate-800 flex items-center justify-between">
                <p className="text-xs text-on-surface-variant dark:text-slate-400">
                  Mostrando {users.length} de {total}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-outline-variant/40 dark:border-slate-700 disabled:opacity-30 hover:bg-surface dark:hover:bg-slate-800 transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                        p === page
                          ? 'bg-secondary dark:bg-cyan-500 text-white'
                          : 'border border-outline-variant/40 dark:border-slate-700 hover:bg-surface dark:hover:bg-slate-800 text-on-surface-variant dark:text-slate-400'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg border border-outline-variant/40 dark:border-slate-700 disabled:opacity-30 hover:bg-surface dark:hover:bg-slate-800 transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Modal Editar Usuario */}
      <AnimatePresence>
        {editUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setEditUser(null)}
          >
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-surface dark:bg-slate-900 rounded-2xl border border-outline-variant/40 dark:border-slate-800 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-outline-variant/30 dark:border-slate-800 flex justify-between items-center">
                <h3 className="text-lg font-headline font-bold text-primary-container dark:text-white">Editar Usuario</h3>
                <button onClick={() => setEditUser(null)} className="p-2 rounded-lg hover:bg-surface-container-low dark:hover:bg-slate-800 transition-colors">
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant dark:text-slate-400 block mb-1">Nombre</label>
                    <input value={editForm.nombre} onChange={e => setEditForm(f => ({ ...f, nombre: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700 text-sm text-on-surface dark:text-white focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-cyan-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant dark:text-slate-400 block mb-1">Apellido</label>
                    <input value={editForm.apellido} onChange={e => setEditForm(f => ({ ...f, apellido: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700 text-sm text-on-surface dark:text-white focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-cyan-500" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant dark:text-slate-400 block mb-1">Email</label>
                  <input value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700 text-sm text-on-surface dark:text-white focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-cyan-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant dark:text-slate-400 block mb-1">Dirección</label>
                    <input value={editForm.direccion} onChange={e => setEditForm(f => ({ ...f, direccion: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700 text-sm text-on-surface dark:text-white focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-cyan-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant dark:text-slate-400 block mb-1">Celular</label>
                    <input value={editForm.celular} onChange={e => setEditForm(f => ({ ...f, celular: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700 text-sm text-on-surface dark:text-white focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-cyan-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant dark:text-slate-400 block mb-1">Rol</label>
                    <select value={editForm.rol} onChange={e => setEditForm(f => ({ ...f, rol: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700 text-sm text-on-surface dark:text-white focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-cyan-500">
                      <option value="usuario">Usuario</option>
                      <option value="administrador">Administrador</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant dark:text-slate-400 block mb-1">Estado</label>
                    <select value={editForm.status ? 'true' : 'false'} onChange={e => setEditForm(f => ({ ...f, status: e.target.value === 'true' }))}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700 text-sm text-on-surface dark:text-white focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-cyan-500">
                      <option value="true">Activo</option>
                      <option value="false">Inactivo</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-outline-variant/30 dark:border-slate-800 flex justify-end gap-2">
                <button onClick={() => setEditUser(null)} className="px-4 py-2 rounded-xl bg-surface dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700 text-sm font-semibold text-on-surface-variant dark:text-slate-400 hover:bg-surface-container-high dark:hover:bg-slate-700 transition-colors">
                  Cancelar
                </button>
                <button onClick={handleEditSubmit} className="px-4 py-2 rounded-xl bg-secondary dark:bg-cyan-500 text-white text-sm font-semibold hover:bg-secondary-fixed dark:hover:bg-cyan-600 transition-colors flex items-center gap-2">
                  <Check size={16} /> Guardar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Confirmar Eliminación */}
      <AnimatePresence>
        {deleteUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setDeleteUser(null)}
          >
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-surface dark:bg-slate-900 rounded-2xl border border-outline-variant/40 dark:border-slate-800 w-full max-w-sm"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={24} className="text-red-500" />
                </div>
                <h3 className="text-lg font-headline font-bold text-primary-container dark:text-white mb-2">¿Eliminar usuario?</h3>
                <p className="text-sm text-on-surface-variant dark:text-slate-400">Esta acción no se puede deshacer. Se eliminarán todos los datos asociados.</p>
              </div>
              <div className="p-4 border-t border-outline-variant/30 dark:border-slate-800 flex justify-end gap-2">
                <button onClick={() => setDeleteUser(null)} className="px-4 py-2 rounded-xl bg-surface dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700 text-sm font-semibold text-on-surface-variant dark:text-slate-400 hover:bg-surface-container-high dark:hover:bg-slate-700 transition-colors">
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

      {/* Modal Detalle Usuario */}
      <AnimatePresence>
        {detailUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setDetailUser(null)}
          >
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-surface dark:bg-slate-900 rounded-2xl border border-outline-variant/40 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-outline-variant/30 dark:border-slate-800 flex justify-between items-center">
                <h3 className="text-lg font-headline font-bold text-primary-container dark:text-white">Detalle del Usuario</h3>
                <button onClick={() => setDetailUser(null)} className="p-2 rounded-lg hover:bg-surface-container-low dark:hover:bg-slate-800 transition-colors">
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700">
                  <div className="w-16 h-16 rounded-2xl bg-surface-container-high dark:bg-slate-900 flex items-center justify-center text-xl font-bold text-on-surface dark:text-white border border-outline-variant/40 dark:border-slate-700">
                    {detailUser.usuario.nombre?.substring(0,2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-on-surface dark:text-white">{detailUser.usuario.nombre} {detailUser.usuario.apellido}</h4>
                    <p className="text-sm text-on-surface-variant dark:text-slate-400">{detailUser.usuario.email}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-[9px] font-semibold px-2 py-1 rounded-full bg-secondary-container dark:bg-cyan-500/20 text-secondary dark:text-cyan-300 border border-secondary/20">
                        {detailUser.usuario.rol?.toUpperCase()}
                      </span>
                      <span className={`text-[9px] font-semibold px-2 py-1 rounded-full border ${detailUser.usuario.status !== false ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                        {detailUser.usuario.status !== false ? 'ACTIVO' : 'INACTIVO'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {detailUser.usuario.celular && (
                    <div className="flex items-center gap-2 text-on-surface-variant dark:text-slate-400">
                      <Phone size={14} /> {detailUser.usuario.celular}
                    </div>
                  )}
                  {detailUser.usuario.direccion && (
                    <div className="flex items-center gap-2 text-on-surface-variant dark:text-slate-400">
                      <MapPin size={14} /> {detailUser.usuario.direccion}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-on-surface-variant dark:text-slate-400">
                    <Calendar size={14} /> Registro: {formatDate(detailUser.usuario.createdAt)}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700 text-center">
                    <p className="text-2xl font-bold text-on-surface dark:text-white">{detailUser.totalEntrevistas || 0}</p>
                    <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant dark:text-slate-400">Entrevistas</p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700 text-center">
                    <p className="text-2xl font-bold text-on-surface dark:text-white">${detailUser.totalDonado || 0}</p>
                    <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant dark:text-slate-400">Donado</p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700 text-center">
                    <p className="text-2xl font-bold text-on-surface dark:text-white">{detailUser.mensajes?.length || 0}</p>
                    <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant dark:text-slate-400">Mensajes Chat</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default UserTable