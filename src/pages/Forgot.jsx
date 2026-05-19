import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useFetch } from "../hooks/useFetch";
import * as THREE from "three";
import GLOBE from "vanta/dist/vanta.globe.min";
import storeTheme from "../context/storeTheme";

export const Forgot = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const fetchDataBackend = useFetch();
  const { isDark } = storeTheme();

  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

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

  const sendMail = async (dataForm) => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/recuperarpassword`;
    await fetchDataBackend(url, dataForm, "POST");
  };

  return (
    <div
      ref={vantaRef}
      className={`${isDark ? "dark" : ""} min-h-screen w-full flex flex-col bg-surface dark:bg-slate-900 font-body text-on-surface relative overflow-hidden`}
    >
      <ToastContainer />

      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6 w-full max-w-7xl mx-auto">
        <Link to="/" className="text-2xl font-bold text-primary-container dark:text-white font-headline tracking-tight hover:opacity-80 transition-opacity">
          InterviAI
        </Link>
        <div className="hidden md:flex gap-4">
          <span className="text-on-surface-variant text-sm font-label tracking-tight self-center">¿Recordaste tu contraseña?</span>
          <Link to="/login" className="text-secondary dark:text-cyan-400 font-bold font-label text-sm hover:opacity-80 transition-opacity">Inicia Sesión</Link>
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

            {/* Robot GIF */}
            <motion.img
              src="/images/Robot1.gif"
              alt="Robot"
              className="w-[380px] h-[380px] drop-shadow-lg relative z-10 rounded-xl"
              animate={{ y: [0, -18, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
            />
          </div>

          {/* Form Section */}
          <div className="w-full">
            <div className="mb-12">
              <h1 className="text-4xl font-headline font-bold text-primary-container dark:text-white tracking-tighter leading-none mb-4">
                Recuperar<br/>Contraseña
              </h1>
              <p className="text-on-surface-variant font-body text-md leading-relaxed max-w-[320px]">
                Ingresa tu correo electrónico y recibirás un enlace para restablecer tu contraseña.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(sendMail)} className="space-y-6">
              {/* Email Field */}
              <div className="group">
                <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant dark:text-slate-400 font-label mb-2 px-1">Correo Electrónico</label>
                <div className="relative flex items-center bg-surface-container-low dark:bg-slate-800 transition-all duration-200 overflow-hidden rounded-lg border border-outline-variant/30 dark:border-slate-700">
                  <span className="material-symbols-outlined ml-4 text-on-surface-variant dark:text-slate-400 text-xl">mail</span>
                  <input
                    type="email"
                    className="w-full bg-transparent border-none focus:ring-0 py-4 px-4 text-on-surface dark:text-white placeholder:text-outline/50 dark:placeholder:text-slate-500 font-body"
                    placeholder="nombre@empresa.com"
                    {...register("email", {
                      required: "El correo electrónico es obligatorio",
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-primary-container to-on-primary-fixed-variant dark:from-slate-700 dark:to-slate-600 text-white font-headline font-bold rounded-lg shadow-xl shadow-primary-container/10 dark:shadow-slate-700/20 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 hover:shadow-lg"
              >
                Enviar Enlace
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </form>

            {/* Back to login */}
            <p className="mt-8 text-center text-on-surface-variant dark:text-slate-400 text-sm">
              ¿Recordaste tu contraseña?{" "}
              <Link to="/login" className="text-secondary dark:text-cyan-400 font-bold hover:underline">Inicia sesión</Link>
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
  );
};

export default Forgot;


