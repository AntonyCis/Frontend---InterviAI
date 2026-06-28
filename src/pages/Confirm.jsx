
import { useState, useEffect, useRef } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'

import { useFetch } from '../hooks/useFetch'
import { motion } from 'framer-motion'
import * as THREE from "three";
import GLOBE from "vanta/dist/vanta.globe.min";
import storeTheme from '../context/storeTheme'

export const Confirm = () => {
    const fetchDataBackend = useFetch()
    const { token } = useParams()
    const [searchParams] = useSearchParams()
    const type = searchParams.get('type') || 'user'
    const { isDark } = storeTheme()

    const vantaRef = useRef(null)
    const [vantaEffect, setVantaEffect] = useState(null)

    useEffect(() => {
        if (!vantaEffect) {
            setVantaEffect(
                GLOBE({
                    el: vantaRef.current,
                    THREE,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    color: isDark ? 0x44ddc1 : 0x8ab4ff,
                    backgroundColor: isDark ? 0x1a1a2e : 0xf7f9fe,
                    size: 1.2,
                })
            );
        }
        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [vantaEffect, isDark]);

    const verifyToken = async () => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/${type}/confirmar/${token}`
        await fetchDataBackend(url)
    }

    useEffect(() => {
        verifyToken()
    }, [])

    return (
        <div
            ref={vantaRef}
            className={`${isDark ? "dark" : ""} min-h-screen w-full flex flex-col bg-surface dark:bg-slate-900 font-body text-on-surface relative overflow-hidden`}
        >

            {/* Header */}
            <header className="flex justify-between items-center px-8 py-6 w-full max-w-7xl mx-auto">
                <Link to="/" className="text-2xl font-bold text-primary-container dark:text-white font-headline tracking-tight hover:opacity-80 transition-opacity">
                    InterviAI
                </Link>
                <div className="hidden md:flex gap-4">
                    <span className="text-on-surface-variant text-sm font-label tracking-tight self-center">¿Necesitas ayuda?</span>
                    <Link to="/login" className="text-secondary dark:text-cyan-400 font-bold font-label text-sm hover:opacity-80 transition-opacity">Soporte</Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center px-6 py-12 relative">
                {/* Background Pattern */}
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-secondary-container/20 dark:bg-tertiary-fixed/20 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-[-5%] left-[-2%] w-72 h-72 bg-primary-fixed/30 dark:bg-tertiary-fixed/30 rounded-full blur-[100px] pointer-events-none"></div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.94, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-2xl z-10 grid lg:grid-cols-2 gap-12 items-center"
                >
                    {/* GIF Section */}
                    <div className="hidden lg:flex justify-center items-center relative">
                        {/* Glow background */}
                        <motion.div
                            className="absolute w-[400px] h-[400px] rounded-full bg-secondary-container/30 dark:bg-tertiary-fixed/30 blur-[100px]"
                            animate={{ opacity: [0.2, 0.4, 0.2] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        />

                        {/* Animated GIF */}
                        <motion.img
                            src="https://media2.giphy.com/media/v1.Y2lkPTZjMDliOTUydWVsYng1bXZkbnN2a3NyNWpyZzgzcTI2czdvcDhvbDJ1Zng4cGxpNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/5k5vZwRFZR5aZeniqb/source.gif"
                            alt="Confirmación"
                            className="w-[380px] h-[380px] drop-shadow-lg relative z-10 rounded-full border-4 border-secondary-container/20 dark:border-tertiary-fixed/20"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                        />
                    </div>

                    {/* Content Section */}
                    <div className="w-full">
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="material-symbols-outlined text-4xl text-secondary dark:text-cyan-400">check_circle</span>
                            </div>
                            <h1 className="text-4xl font-headline font-bold text-primary-container dark:text-white tracking-tighter leading-none mb-4">
                                ¡Cuenta Confirmada!
                            </h1>
                            <p className="text-on-surface-variant font-body text-md leading-relaxed max-w-[350px]">
                                Tu acceso al sistema de entrevistas ha sido activado exitosamente.
                            </p>
                        </div>

                        {/* Success Details */}
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3 p-4 bg-surface-container-low dark:bg-slate-800 rounded-lg border border-outline-variant/30 dark:border-slate-700">
                                <span className="material-symbols-outlined text-secondary dark:text-cyan-400">mail</span>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-on-surface-variant dark:text-slate-400 font-label">Email Verificado</p>
                                    <p className="text-on-surface dark:text-white text-sm font-medium">Tu dirección de correo está confirmada</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-surface-container-low dark:bg-slate-800 rounded-lg border border-outline-variant/30 dark:border-slate-700">
                                <span className="material-symbols-outlined text-secondary dark:text-cyan-400">verified_user</span>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-on-surface-variant dark:text-slate-400 font-label">Acceso Activado</p>
                                    <p className="text-on-surface dark:text-white text-sm font-medium">Puedes iniciar sesión ahora</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <Link
                            to="/login"
                            className="w-full py-4 bg-gradient-to-r from-primary-container to-on-primary-fixed-variant dark:from-slate-700 dark:to-slate-600 text-white font-headline font-bold rounded-lg shadow-xl shadow-primary-container/10 dark:shadow-slate-700/20 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 hover:shadow-lg"
                        >
                            Ir a Iniciar Sesión
                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </Link>

                        {/* Additional Info */}
                        <p className="mt-8 text-center text-on-surface-variant dark:text-slate-400 text-sm">
                            ¿Necesitas ayuda?{" "}
                            <a href="#" className="text-secondary dark:text-cyan-400 font-bold hover:underline">Contacta soporte</a>
                        </p>
                    </div>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="flex flex-col md:flex-row justify-between items-center px-12 py-12 w-full border-t border-black/5 dark:border-white/10 bg-surface-container-low dark:bg-slate-800">
                <Link to="/" className="text-lg font-black text-primary-container dark:text-white font-headline tracking-tighter mb-4 md:mb-0 hover:opacity-80 transition-opacity">
                    InterviAI
                </Link>
                <div className="flex flex-wrap justify-center gap-6">
                    <a href="#" className="font-body text-xs tracking-widest uppercase text-on-surface-variant dark:text-slate-400 opacity-60 hover:text-secondary dark:hover:text-cyan-400 transition-colors">Documentación</a>
                    <a href="#" className="font-body text-xs tracking-widest uppercase text-on-surface-variant dark:text-slate-400 opacity-60 hover:text-secondary dark:hover:text-cyan-400 transition-colors">Privacidad</a>
                    <a href="#" className="font-body text-xs tracking-widest uppercase text-on-surface-variant dark:text-slate-400 opacity-60 hover:text-secondary dark:hover:text-cyan-400 transition-colors">Términos</a>
                    <a href="#" className="font-body text-xs tracking-widest uppercase text-on-surface-variant dark:text-slate-400 opacity-60 hover:text-secondary dark:hover:text-cyan-400 transition-colors">Soporte</a>
                </div>
                <div className="mt-8 md:mt-0 font-body text-[10px] tracking-widest uppercase text-on-surface-variant dark:text-slate-500 opacity-40">
                    © 2026 InterviAI. Technical Excellence Defined.
                </div>
            </footer>
        </div>
    )
}