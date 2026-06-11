import axios from "axios"
import { toast } from "react-toastify"
import { useCallback } from "react"

export function useFetch() {
    const fetchDataBackend = useCallback(async (url, data = null, method = "GET", headers = {}, options = {}) => {
        const { silent = false } = options
        const loadingToast = silent ? null : toast.loading("Procesando solicitud...")
        try {
            const options = {
                method,
                url,
                headers: {
                    ...headers,
                },
            }

            if (data !== null && data !== undefined) {
                options.data = data
            }

            const isFormData = data instanceof FormData;

            if (data !== null && data !== undefined) {
                if (!isFormData) {
                    options.headers["Content-Type"] = "application/json";
                }
            }

            const response = await axios(options)
            
            if (loadingToast) toast.dismiss(loadingToast)
            if (!silent && response?.data?.msg) {
                toast.success(response.data.msg)
            }
            return response?.data

        } catch (error) {
            if (loadingToast) toast.dismiss(loadingToast)
            if (!silent) console.error("Error en useFetch:", error)
            
            const errorMsg = error.response?.data?.msg || "Error en la comunicación con el servidor";
            if (!silent) toast.error(errorMsg)
            
            // Re-lanzamos el error para que el onSubmit pueda capturarlo si es necesario
            throw error; 
        }
    }, [])
    return fetchDataBackend
}