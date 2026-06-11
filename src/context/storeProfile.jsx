import { create } from "zustand"
import axios from "axios"
import {toast} from 'react-toastify'
import storeAuth from "./storeAuth"


const getAuthHeaders = () => {
    const { token } = storeAuth.getState()
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
}


const storeProfile = create((set) => ({
        
    user: null,
    clearUser: () => set({ user: null }),
    profile: async () => {
        try {
            const { rol } = storeAuth.getState()
            const endpoint = rol ==="administrador"
                ? "admin/perfil"
                : "user/perfil"
            const url = `${import.meta.env.VITE_BACKEND_URL}/${endpoint}`
            const respuesta = await axios.get(url, getAuthHeaders())
            set({ user: respuesta.data })
        } catch (error) {
            console.error(error)
        }
    },

    updateProfile:async(url, data)=>{
        try {
            const isFormData = data instanceof FormData
            const headers = getAuthHeaders()

            if (!isFormData) {
                headers.headers["Content-Type"] = "application/json"
            }

            const respuesta = await axios.put(url, data, headers)
            set({ user: respuesta.data })
            toast.success("Perfil actualizado correctamente")
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.msg)
        }
    },

    updatePasswordProfile:async(url,data)=>{
        try {
            const respuesta = await axios.put(url, data, getAuthHeaders())
            return respuesta
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.msg)
        }
    }
    })
)

export default storeProfile
