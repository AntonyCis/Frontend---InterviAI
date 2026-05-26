# Entrevistas Front (InterviAI)

Frontend de la plataforma de simulación de entrevistas con IA.

Incluye:
- autenticación (admin/usuario + Google login)
- dashboard con vistas separadas por rol
- perfil, seguridad y configuración
- flujo de recuperación y confirmación de cuenta
- pagos con Stripe
- chat y simulaciones

---

## Stack

- React 18 + Vite
- Tailwind CSS
- Framer Motion
- Zustand
- React Hook Form
- Axios
- Chart.js
- Vitest + Testing Library

---

## Estructura del proyecto

```text
src/
├── assets/
├── components/
│   ├── dashboard/
│   ├── profile/
│   └── ...
├── context/         # storeAuth, storeProfile, storeTheme
├── hooks/
├── layout/
├── pages/
├── routes/
└── main.jsx
```

---

## Requisitos

- Node.js 18+
- Backend InterviAI corriendo

---

## Instalación

```bash
npm install
```

---

## Variables de entorno (`.env`)

```env
VITE_BACKEND_URL=http://localhost:4000/api
VITE_HUGGINGFACE_API_KEY=...
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

> `VITE_BACKEND_URL` debe apuntar al backend y **sin slash final** para evitar URLs mal formadas.

---

## Scripts

```bash
# Desarrollo
npm run dev

# Build producción
npm run build

# Previsualizar build
npm run preview

# Lint
npm run lint

# Tests
npm run test
```

---

## Ejecutar local (frontend + backend)

Terminal 1 (backend):
```bash
cd ../Backend-Inter-IA-main
npm run dev
```

Terminal 2 (frontend):
```bash
npm run dev
```

Frontend esperado:
- `http://localhost:5173`

---

## Rutas importantes del frontend

Públicas:
- `/`
- `/login`
- `/register`
- `/forgot/:id`
- `/confirmar/:token`
- `/reset/:token`

Protegidas:
- `/dashboard`
- `/dashboard/profile`
- `/dashboard/list`
- `/dashboard/create`
- `/dashboard/users` (admin)
- `/dashboard/stats` (admin)

---

## Flujo funcional resumido

1. Usuario se registra y confirma correo.
2. Login devuelve token JWT.
3. Token se persiste en `storeAuth` (Zustand persist).
4. Dashboard carga datos de perfil y rutas según rol.
5. Secciones consumen API de backend con `VITE_BACKEND_URL`.

---

## Problemas comunes

- **No carga datos del dashboard**
	- Revisa token guardado y header `Authorization: Bearer <token>`.
- **Error CORS**
	- Revisa `FRONTEND_URL` en backend y `VITE_BACKEND_URL` en frontend.
- **Google login no redirige**
	- Verifica endpoint `/api/auth/google` y callback del backend.
- **Stripe falla**
	- Confirma `VITE_STRIPE_PUBLIC_KEY` válida.

---

## Notas

- El diseño visual está optimizado para modo claro/oscuro.
- El dashboard usa vistas separadas por rol (`usuario` / `administrador`).
- Para documentación de endpoints de admin revisa:
	- `../Backend-Inter-IA-main/ADMIN_ENDPOINTS.md`

