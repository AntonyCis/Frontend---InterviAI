# Entrevistas Front (InterviAI)

Frontend oficial de **InterviAI**, una plataforma para simular entrevistas laborales con IA.

La app incluye:
- autenticación de usuario y administrador
- confirmación de correo y recuperación de contraseña
- dashboard diferenciado por rol
- perfil, seguridad y actualización de datos
- simulaciones, chat y pagos
- diseño adaptable con modo claro/oscuro

---

## Stack

- React 18
- Vite
- Tailwind CSS
- Framer Motion
- Zustand
- React Hook Form
- Axios
- Chart.js + React Chart.js 2
- Socket.IO Client
- React Toastify
- Vitest + Testing Library

---

## Estructura del proyecto

```text
src/
├── assets/
├── components/
│   ├── dashboard/
│   ├── profile/
│   ├── create/
│   ├── list/
│   └── treatments/
├── context/
├── hooks/
├── helpers/
├── layout/
├── pages/
├── routes/
└── main.jsx
```

---

## Requisitos

- Node.js 18 o superior
- Backend de InterviAI ejecutándose

---

## Instalación

```bash
npm install
```

---

## Variables de entorno (`.env`)

```env
VITE_BACKEND_URL=http://localhost:4000/api
VITE_HUGGINGFACE_API_KEY=tu_api_key
VITE_STRIPE_PUBLIC_KEY=pk_test_tu_clave_publica
```

> Importante: `VITE_BACKEND_URL` debe apuntar al backend con el prefijo `/api`.

---

## Scripts disponibles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Previsualizar build
npm run preview

# Linter
npm run lint

# Tests
npm run test
```

---

## Ejecutar en local

Terminal 1 — backend:

```bash
cd ../Backend-Inter-IA-main
npm run dev
```

Terminal 2 — frontend:

```bash
npm run dev
```

La app normalmente queda disponible en:
- `http://localhost:5173`

---

## Rutas principales

### Públicas
- `/`
- `/login`
- `/register`
- `/forgot/:id`
- `/confirmar/:token`
- `/reset/:token`

### Protegidas
- `/dashboard`
- `/dashboard/profile`
- `/dashboard/list`
- `/dashboard/create`
- `/dashboard/details/:id`
- `/dashboard/update/:id`
- `/dashboard/chat/:id`
- `/dashboard/plans`
- `/dashboard/checkout`

### Solo administrador
- `/dashboard/users`
- `/dashboard/stats`

---

## Flujo general

1. El usuario se registra.
2. Recibe un correo de confirmación.
3. Confirma su cuenta desde el link enviado.
4. Inicia sesión y obtiene su JWT.
5. El token se guarda con `Zustand` (`storeAuth`).
6. El dashboard carga datos según el rol.
7. El frontend consume la API definida en `VITE_BACKEND_URL`.

---

## Qué hace cada área

- **Home**: landing principal con modo oscuro y CTA.
- **Login / Register**: acceso y registro con autenticación por rol.
- **Forgot / Reset / Confirm**: recuperación y verificación de cuenta.
- **Dashboard**: contenedor común para admin y usuario.
- **Profile**: edición de datos personales y seguridad.
- **Panel**: resumen principal del usuario o del admin.
- **List / Details / Create / Update**: gestión de simulaciones.
- **Chat**: mensajería en tiempo real.
- **Checkout / Pricing**: suscripciones y pagos.

---

## Problemas comunes

- **No carga el dashboard**
	- Revisa que exista token en `storeAuth`.
	- Verifica que el backend esté respondiendo en `VITE_BACKEND_URL`.

- **Error de CORS**
	- Revisa `FRONTEND_URL` en el backend.
	- Verifica que el frontend use el puerto correcto.

- **Login de Google falla**
	- Revisa el endpoint de autenticación en el backend.
	- Confirma las credenciales OAuth.

- **Stripe no inicia**
	- Revisa `VITE_STRIPE_PUBLIC_KEY`.

---

## Documentación relacionada

- Endpoints de administrador: `../Backend-Inter-IA-main/ADMIN_ENDPOINTS.md`
- README del backend: `../Backend-Inter-IA-main/README.md`

---

## Notas

- El diseño visual está optimizado para modo claro/oscuro.
- El dashboard cambia según el rol del usuario.
- El proyecto usa componentes reutilizables y stores persistentes con Zustand.

