# 🤝 Guía de Contribución y Flujo de Trabajo

Para mantener el código limpio, el historial claro y evitar conflictos durante el desarrollo, todos los desarrolladores deben seguir estas reglas para la gestión de ramas y commits.

---

## 🌿 Convención de Ramas (Git Branching)

Trabajaremos utilizando una variación simplificada de **Git Flow**. Ningún commit debe hacerse directamente sobre la rama `main` o `master`.

### 1. Nombres de Ramas

Crea tus ramas siempre a partir de `main` (o `develop`, según corresponda) usando la sintaxis: `<tipo>/<descripcion-corta>`

- **`feature/`**: Para nuevas funcionalidades o pantallas.
  - _Ejemplo:_ `feature/login-form`, `feature/tabla-asistencias`
- **`bugfix/`**: Para corregir errores reportados durante el desarrollo.
  - _Ejemplo:_ `bugfix/error-sesion-expirada`
- **`hotfix/`**: Para arreglos urgentes en producción.
  - _Ejemplo:_ `hotfix/caida-servidor-autenticacion`
- **`chore/`**: Para tareas de mantenimiento, configuración o actualización de paquetes.
  - _Ejemplo:_ `chore/actualizar-astro`

---

## 💬 Convención de Commits (Conventional Commits)

Este repositorio utiliza **Husky + Commitlint** para validar automáticamente los mensajes. Si el mensaje no sigue el estándar, el commit será rechazado.

### Estructura del mensaje

`<tipo>(<alcance opcional>): <descripción corta en minúsculas>`

> ⚠️ **Reglas obligatorias:**
>
> 1. Inicia la descripción siempre en minúsculas.
> 2. No agregues punto final `.` al terminar la oración.
> 3. Usa el tiempo presente imperativo (ej. "agregar" en vez de "agregado").

### Tipos de Commit Permitidos

| Tipo           | Descripción                                                     | Ejemplo                                              |
| :------------- | :-------------------------------------------------------------- | :--------------------------------------------------- |
| **`feat`**     | Una nueva funcionalidad para el usuario                         | `feat: agregar boton para exportar reporte`          |
| **`fix`**      | Solución a un error o bug                                       | `fix: corregir calculo de total en carrito`          |
| **`docs`**     | Cambios exclusivamente en la documentación                      | `docs: actualizar instrucciones en README`           |
| **`style`**    | Formato, espacios o CSS (sin afectar la lógica)                 | `style: ajustar padding en el menu lateral`          |
| **`refactor`** | Reestructuración de código (sin arreglar bugs ni agregar feats) | `refactor: optimizar consulta a la base de datos`    |
| **`test`**     | Añadir o corregir pruebas unitarias/integración                 | `test: agregar pruebas para la validacion del login` |
| **`chore`**    | Mantenimiento, dependencias o herramientas                      | `chore: actualizar dependencias de npm`              |

### Alcance u Organigrama (`scope`) _Opcional_

Puedes indicar la sección del proyecto entre paréntesis:

- `feat(auth): agregar recuperacion de contraseña via email`
- `fix(ui): corregir desalineacion en formulario de contacto`

---

## ❌ Ejemplos Incorrectos (Serán rechazados)

- `git commit -m "cambios en la interfaz"` _(Falta el tipo)_
- `git commit -m "Fix: arreglado el login."` _(Tipo en mayúscula y con punto final)_
- `git commit -m "feat: Arreglé las tablas"` _(Descripción inicia con mayúscula)_

## ✅ Ejemplos Correctos (Serán aceptados)

- `git commit -m "feat: agregar filtro por fecha en historial"`
- `git commit -m "fix(api): manejar error 500 cuando el servidor cae"`
- `git commit -m "chore: agregar configuracion de husky y commitlint"`

---

## ⚙️ Reglas de Entorno y Formato

1. **Saltos de Línea:** Este proyecto está configurado para usar finales de línea **LF** (`\n`). Asegúrate de que tu editor guarde con el estándar UNIX o respete la regla del `.gitattributes`.
2. **Formateo:** Se utiliza **Prettier** para el formateo de código. Asegúrate de ejecutar el formateador antes de subir cambios (`npx prettier --write .`).
