# CIAE: Centro de Innovación y Aprendizaje Estratégico

Plataforma web para la gestión académica, registro de alumnos y validación de certificaciones mediante códigos QR.

---

## 🚀 Funcionalidades Clave

- **Landing Page:** Página pública de presentación ("Nosotros") y formulario de contacto.
- **Autenticación:** Sistema de inicio de sesión (_Login_) para administradores.
- **Gestión de Cursos:** Registro, actualización y catálogo de programas formativos.
- **Registro de Alumnos:** Alta y validación del estatus académico de estudiantes.
- **Verificación por QR:** Generación de códigos QR únicos que dirigen a una página pública de validación del curso y alumno.

---

## 🛠️ Stack Tecnológico

### Frontend

- **Vite + React:** Entorno de desarrollo ultrarrápido y librería de UI.
- **Tailwind CSS:** Framework CSS utility-first para estilizado moderno y ágil.
- **React Router DOM:** Manejo de rutas y navegación entre páginas.

### Backend

- **Node.js (Express.js):** Entorno de ejecución y framework backend para la API REST.

---

## 📂 Estructura del Proyecto

```text
src/
├── components/      # Navbar, Footer, UI reutilizable
├── pages/           # Landing, Login, Dashboard, Cursos, Alumnos, ValidarQR
├── services/        # Peticiones API / Backend
├── App.jsx          # Rutas principales (React Router)
└── main.jsx         # Punto de entrada de la aplicación
```

---

## 🔗 Mapa de Rutas

- `/` — Landing page (Nosotros y Contacto)
- `/login` — Acceso de usuarios
- `/dashboard` — Panel de administración
- `/cursos` — Gestión de cursos
- `/alumnos` — Registro y validación de alumnos
- `/validar/:id` — Vista pública de verificación del código QR

---

## ⚡ Inicio Rápido

1. **Instalar dependencias:**

   ```bash
   npm install
   ```

2. **Ejecutar en entorno de desarrollo:**
   ```bash
   npm run dev
   ```

---

## 👥 Colaboradores

[![Contributors](https://contrib.rocks/image?repo=devworkmx/CIAE-frontend)](https://github.com/devworkmx/CIAE-frontend/graphs/contributors)

---
