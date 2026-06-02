import axios from "axios"
import { toast } from "react-toastify"

export function useFetch() {
    const fetchDataBackend = async (url, data = null, method = "GET", headers = {}, options = {}) => {
        const { silent = false } = options
        const loadingToast = silent ? null : toast.loading("Procesando solicitud...")
        try {
            // DETECCIÓN INTELIGENTE: 
            // Si la data es FormData, dejamos que el navegador ponga el Content-Type solo
            const isFormData = data instanceof FormData;

            const options = {
                method,
                url,
                headers: {
                    ...headers,
                },
                data
            }

            // Solo agregamos application/json si NO es un envío de archivos
            if (!isFormData) {
                options.headers["Content-Type"] = "application/json";
            } else {
                // IMPORTANTE: Al borrarlo, Axios/Navegador configuran el boundary correcto para Multer
                delete options.headers["Content-Type"];
            }

            const response = await axios(options)
            
            if (loadingToast) toast.dismiss(loadingToast)
            if (!silent && response?.data?.msg) {
                toast.success(response.data.msg)
            }
            return response?.data

        } catch (error) {
            if (loadingToast) toast.dismiss(loadingToast)
            console.error("Error en useFetch:", error)
            
            const errorMsg = error.response?.data?.msg || "Error en la comunicación con el servidor";
            if (!silent) toast.error(errorMsg)
            
            // Re-lanzamos el error para que el onSubmit pueda capturarlo si es necesario
            throw error; 
        }
    }
    return fetchDataBackend
}