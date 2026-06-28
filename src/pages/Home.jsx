export default function Home() {

  return (
    <div className="bg-background text-on-background font-body selection:bg-secondary-container selection:text-on-secondary-container">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-sm dark:shadow-none">
        <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
          <div className="text-2xl font-bold tracking-tighter text-slate-900 dark:text-white font-headline">
            InterviAI
          </div>
          <div className="hidden md:flex items-center space-gap-8 gap-x-8">
            <a className="text-secondary dark:text-cyan-400 border-b-2 border-secondary font-bold pb-1 font-headline tracking-tight" href="#funcionalidades">Funcionalidades</a>
            <a className="text-slate-600 dark:text-slate-400 font-medium hover:text-secondary transition-colors duration-200 font-headline tracking-tight" href="#como-funciona">Cómo funciona</a>
            <a className="text-slate-600 dark:text-slate-400 font-medium hover:text-secondary transition-colors duration-200 font-headline tracking-tight" href="#planes">Planes</a>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => window.location.href = "/login"} className="hidden lg:block text-slate-600 font-medium px-4 py-2 hover:text-secondary transition-all">Iniciar Sesión</button>
            <button onClick={() => window.location.href = "/register"} className="bg-primary-container text-white px-6 py-2 rounded-md font-bold transition-all active:opacity-80 active:scale-95">Empezar Gratis</button>
          </div>
        </div>
      </nav>

      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative px-8 py-20 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-widest mb-6">Simulación de entrevistas con IA</span>
            <h1 className="text-6xl md:text-7xl font-headline font-bold text-on-primary-fixed tracking-tighter leading-none mb-6">
              Prepárate para tu Próxima Entrevista Técnica
            </h1>
            <p className="text-xl text-on-surface-variant max-w-lg mb-10 leading-relaxed">
              Resuelve ejercicios de programación en Python, JavaScript y SQL, participa en entrevistas simuladas con IA y recibe feedback automático para mejorar tu rendimiento.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => window.location.href = "/register"} className="bg-primary-container hover:bg-on-primary-fixed-variant text-white px-8 py-4 rounded-md font-bold flex items-center gap-2 transition-all shadow-lg">
                Comenzar Ahora <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>terminal</span>
              </button>
              <button onClick={() => window.location.href = "/login"} className="border-2 border-outline-variant hover:border-secondary text-on-surface font-bold px-8 py-4 rounded-md transition-all">
                Iniciar Sesión
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-2xl overflow-hidden relative">
              <div className="bg-primary-container px-4 py-2 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-error"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-secondary-fixed"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed-dim"></div>
                </div>
                <div className="text-[10px] font-label text-on-primary-container tracking-widest uppercase">ejercicio_python.py</div>
                <div className="w-4"></div>
              </div>
              <div className="p-6 font-mono text-sm space-y-2 bg-primary-container text-on-primary-fixed-variant/80">
                <div className="flex gap-4 syntax-line px-2 py-1 transition-all"><span className="text-secondary-fixed-dim">01</span><span className="text-white">def two_sum(nums, target):</span></div>
                <div className="flex gap-4 syntax-line px-2 py-1"><span className="text-secondary-fixed-dim">02</span><span className="text-white">&nbsp;&nbsp;seen = {}</span></div>
                <div className="flex gap-4 syntax-line px-2 py-1"><span className="text-secondary-fixed-dim">03</span><span className="text-white">&nbsp;&nbsp;for i, n in enumerate(nums):</span></div>
                <div className="flex gap-4 syntax-line px-2 py-1 bg-secondary/20 border-l-2 border-secondary"><span className="text-secondary-fixed-dim">04</span><span className="text-secondary-fixed">&nbsp;&nbsp;&nbsp;&nbsp;diff = target - n</span></div>
                <div className="flex gap-4 syntax-line px-2 py-1"><span className="text-secondary-fixed-dim">05</span><span className="text-white">&nbsp;&nbsp;&nbsp;&nbsp;if diff in seen:</span></div>
              </div>
              <div className="absolute bottom-6 right-6 glass-panel p-4 rounded-xl border border-secondary/30 max-w-[240px] shadow-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-on-surface">Feedback IA</span>
                </div>
                <p className="text-[11px] text-on-surface-variant leading-tight">Buen uso de hash map para O(n). Considera agregar validación para arrays vacíos.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Funcionalidades Section */}
        <section className="py-32 px-8 max-w-7xl mx-auto" id="funcionalidades">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-headline font-bold text-on-primary-fixed mb-4">Lo que ofrecemos</h2>
            <p className="text-on-surface-variant text-lg">Herramientas reales para preparar entrevistas técnicas.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group bg-surface-container-lowest p-8 rounded-xl border border-transparent hover:border-secondary/20 transition-all shadow-sm hover:shadow-xl">
              <div className="w-12 h-12 bg-surface-container-high rounded-lg flex items-center justify-center mb-8 group-hover:bg-secondary-container transition-colors">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>code</span>
              </div>
              <h3 className="text-2xl font-headline font-bold mb-4">Ejercicios de Código</h3>
              <p className="text-on-surface-variant mb-6 text-sm leading-relaxed">Practica con ejercicios de programación en Python, JavaScript y SQL con distintos niveles de dificultad y un editor de código integrado.</p>
              <ul className="text-[12px] space-y-2 text-on-surface-variant font-label uppercase tracking-widest">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Python / JavaScript / SQL</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Editor Monaco integrado</li>
              </ul>
            </div>
            {/* Card 2 */}
            <div className="group bg-surface-container-lowest p-8 rounded-xl border border-transparent hover:border-secondary/20 transition-all shadow-sm hover:shadow-xl">
              <div className="w-12 h-12 bg-surface-container-high rounded-lg flex items-center justify-center mb-8 group-hover:bg-secondary-container transition-colors">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
              </div>
              <h3 className="text-2xl font-headline font-bold mb-4">Entrevistas Simuladas</h3>
              <p className="text-on-surface-variant mb-6 text-sm leading-relaxed">Participa en entrevistas técnicas simuladas por IA que evalúan tus respuestas y te guían en tiempo real.</p>
              <ul className="text-[12px] space-y-2 text-on-surface-variant font-label uppercase tracking-widest">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Preguntas adaptativas</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Feedback inmediato</li>
              </ul>
            </div>
            {/* Card 3 */}
            <div className="group bg-surface-container-lowest p-8 rounded-xl border border-transparent hover:border-secondary/20 transition-all shadow-sm hover:shadow-xl">
              <div className="w-12 h-12 bg-surface-container-high rounded-lg flex items-center justify-center mb-8 group-hover:bg-secondary-container transition-colors">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
              </div>
              <h3 className="text-2xl font-headline font-bold mb-4">Seguimiento de Progreso</h3>
              <p className="text-on-surface-variant mb-6 text-sm leading-relaxed">Visualiza tu rendimiento histórico mediante gráficos y métricas calculadas a partir de tus simulaciones completadas.</p>
              <ul className="text-[12px] space-y-2 text-on-surface-variant font-label uppercase tracking-widest">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Score de IA por entrevista</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Dashboard personal</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Cómo funciona Section */}
        <section className="bg-primary-container text-white py-32 px-8 overflow-hidden" id="como-funciona">
          <div className="max-w-7xl mx-auto">
            <div className="mb-20">
              <h2 className="text-5xl font-headline font-bold mb-4">Cómo Funciona</h2>
              <p className="text-on-primary-container text-lg">Tres pasos simples para empezar a practicar.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-12 relative">
              <div className="relative group">
                <div className="text-[120px] font-headline font-bold text-on-primary-fixed-variant/20 absolute -top-16 -left-4 leading-none select-none">01</div>
                <div className="relative pt-12">
                  <h4 className="text-xl font-bold mb-4 text-secondary-fixed">Crea tu cuenta</h4>
                  <p className="text-on-primary-container text-sm leading-relaxed">Regístrate con email o con Google y accede al panel de usuario donde verás tus estadísticas.</p>
                </div>
              </div>
              <div className="relative group">
                <div className="text-[120px] font-headline font-bold text-on-primary-fixed-variant/20 absolute -top-16 -left-4 leading-none select-none">02</div>
                <div className="relative pt-12">
                  <h4 className="text-xl font-bold mb-4 text-secondary-fixed">Resuelve ejercicios</h4>
                  <p className="text-on-primary-container text-sm leading-relaxed">Elige entre Python, JavaScript o SQL, selecciona la dificultad y comienza a practicar en el editor integrado.</p>
                </div>
              </div>
              <div className="relative group">
                <div className="text-[120px] font-headline font-bold text-on-primary-fixed-variant/20 absolute -top-16 -left-4 leading-none select-none">03</div>
                <div className="relative pt-12">
                  <h4 className="text-xl font-bold mb-4 text-secondary-fixed">Simula una entrevista</h4>
                  <p className="text-on-primary-container text-sm leading-relaxed">Crea una simulación, responde las preguntas del chat con IA y recibe feedback detallado de tu desempeño.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Planes Section */}
        <section className="py-32 px-8 max-w-7xl mx-auto" id="planes">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-headline font-bold text-on-primary-fixed mb-4">Planes</h2>
            <p className="text-on-surface-variant text-lg">Elige el plan que se adapte a tu preparación.</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8 items-end">
            {/* Basic */}
            <div className="bg-surface-container-low p-10 rounded-xl space-y-8">
              <div>
                <h4 className="text-xl font-bold mb-2">Basic</h4>
                <div className="text-4xl font-headline font-bold">$5<span className="text-lg font-normal text-on-surface-variant">/único</span></div>
                <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-2">Para empezar</p>
              </div>
              <ul className="space-y-4 text-sm text-on-surface-variant">
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-secondary text-lg">check_circle</span> 5 Entrevistas con IA</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-secondary text-lg">check_circle</span> Feedback estándar</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-secondary text-lg">check_circle</span> Ejercicios disponibles</li>
              </ul>
              <button onClick={() => window.location.href = "/login"} className="w-full py-4 border border-outline-variant font-bold rounded-md hover:bg-surface-container-high transition-all">Empezar Ahora</button>
            </div>
            {/* Pro */}
            <div className="bg-primary-container text-white p-10 rounded-xl space-y-8 relative scale-105 shadow-2xl">
              <div className="absolute top-0 right-10 -translate-y-1/2 bg-secondary text-white px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">Más Popular</div>
              <div>
                <h4 className="text-xl font-bold mb-2">Pro</h4>
                <div className="text-4xl font-headline font-bold">$15<span className="text-lg font-normal text-on-primary-container">/único</span></div>
                <p className="text-xs text-secondary-fixed uppercase tracking-widest mt-2">Para profesionales</p>
              </div>
              <ul className="space-y-4 text-sm text-on-primary-container">
                <li className="flex items-center gap-2 text-white"><span className="material-symbols-outlined text-secondary-fixed text-lg">check_circle</span> 20 Entrevistas con IA</li>
                <li className="flex items-center gap-2 text-white"><span className="material-symbols-outlined text-secondary-fixed text-lg">check_circle</span> Feedback detallado</li>
                <li className="flex items-center gap-2 text-white"><span className="material-symbols-outlined text-secondary-fixed text-lg">check_circle</span> Descarga de reporte en PDF</li>
                <li className="flex items-center gap-2 text-white"><span className="material-symbols-outlined text-secondary-fixed text-lg">check_circle</span> Análisis de tono</li>
              </ul>
              <button onClick={() => window.location.href = "/login"} className="w-full py-4 bg-secondary-fixed text-on-secondary-fixed font-bold rounded-md hover:opacity-90 transition-all">Elegir Pro</button>
            </div>
            {/* Unlimited */}
            <div className="bg-surface-container-low p-10 rounded-xl space-y-8">
              <div>
                <h4 className="text-xl font-bold mb-2">Unlimited</h4>
                <div className="text-4xl font-headline font-bold">$30<span className="text-lg font-normal text-on-surface-variant">/único</span></div>
                <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-2">Sin límites</p>
              </div>
              <ul className="space-y-4 text-sm text-on-surface-variant">
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-secondary text-lg">check_circle</span> Entrevistas ilimitadas</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-secondary text-lg">check_circle</span> IA Premium</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-secondary text-lg">check_circle</span> Coach personalizado</li>
              </ul>
              <button onClick={() => window.location.href = "/login"} className="w-full py-4 border border-outline-variant font-bold rounded-md hover:bg-surface-container-high transition-all">Elegir Unlimited</button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 w-full py-12 px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xl font-bold text-white font-headline">InterviAI</div>
          <div className="flex gap-8">
            <a className="text-slate-500 hover:text-cyan-400 transition-colors font-body text-sm tracking-wide" href="#funcionalidades">Funcionalidades</a>
            <a className="text-slate-500 hover:text-cyan-400 transition-colors font-body text-sm tracking-wide" href="#como-funciona">Cómo funciona</a>
            <a className="text-slate-500 hover:text-cyan-400 transition-colors font-body text-sm tracking-wide" href="mailto:contacto@interviai.com">Soporte</a>
          </div>
          <div className="text-slate-500 font-body text-sm tracking-wide text-center md:text-right">
            &copy; 2026 InterviAI
          </div>
        </div>
      </footer>
    </div>
  );
}
