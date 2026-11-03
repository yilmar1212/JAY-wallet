# JAY-wallet

Aplicación web para prestamistas. Sirve para llevar el registro de a quién se le prestó dinero, cuánto, con qué interés, para cuándo vence y cuánto se ha abonado, sin depender de la memoria ni de notas sueltas.

Proyecto Integrador I · Ingeniería de Sistemas · Universidad del Valle. Lo desarrollamos entre tres personas.

## Estado actual

El registro e inicio de sesión ya funcionan de punta a punta: un usuario puede crear su cuenta, entrar, ver el dashboard y cerrar sesión, y el backend rechaza las peticiones sin token válido. Lo que sigue es el CRUD de deudores, que es la base de todo lo demás (préstamos, abonos y estadísticas cuelgan de ahí).

El detalle por sprint está al final, en la sección [Avance](#avance).

## Qué es y para quién

Hay un solo tipo de usuario: el prestamista, una persona natural que presta dinero de forma habitual o de vez en cuando. Los deudores no usan la aplicación; son datos que el prestamista registra.

La app responde dos necesidades:

1. Saber quién debe, cuánto debe y cómo contactarlo para cobrar a tiempo.
2. Tener esa información a mano y ver cuánto capital hay prestado y cuánto falta por recuperar.

**Alcance**

| | Qué incluye |
|---|---|
| MVP | Registro e inicio de sesión, deudores, préstamos, abonos, pantalla principal, estadística e historial |
| Extras | Proveedores (entidades que aportan capital), soportes del préstamo, exportar reportes, alertas de vencimiento |
| Fuera de alcance | Pagos reales, notificaciones por SMS o correo, app móvil, varios tipos de usuario |

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React con Vite (JavaScript), React Router, ESLint |
| Backend | Node.js y Express (ES Modules) |
| Librerías del backend | `pg`, `dotenv`, `cors`, `bcrypt`, `jsonwebtoken` |
| Base de datos | PostgreSQL en [Neon](https://neon.com) |
| Despliegue previsto | Vercel o Netlify (frontend), Render (backend), Neon (base de datos) |

Para la sustentación se evalúa un despliegue temporal en AWS, pero primero se termina la app con el despliegue gratuito.

## Estructura del repositorio

```text
JAY-wallet/
├── client/              Frontend (React + Vite)
│   ├── src/             App.jsx con las rutas; pantallas Login, Registro y Dashboard
│   └── package.json
├── server/              Backend (Node + Express)
│   ├── server.js        Punto de entrada
│   ├── db.js            Conexión a PostgreSQL (pg, con SSL)
│   ├── routes/          Definen las URL y qué controlador atiende cada una
│   ├── controllers/     Lógica de cada endpoint y consultas SQL
│   ├── middleware/      Verificación del JWT
│   ├── .env.example     Plantilla de variables de entorno
│   └── package.json
├── .gitignore
└── README.md
```

El backend va por capas: la ruta recibe la petición, el middleware revisa el token cuando la ruta es privada, y el controlador responde. Cuando haya reglas de negocio más pesadas (cálculo de saldos, vencimientos) se separarán en una capa de servicios.

## Cómo correrlo en local

Necesitas Node.js (versión LTS), Git y una base de datos PostgreSQL. Para desarrollo, lo más simple es crear tu propia base gratis en Neon y ejecutar el esquema (`schema.sql`) en su SQL Editor.

Clona el repo fuera de OneDrive, por ejemplo en `C:\dev`. OneDrive intenta sincronizar `node_modules` y termina bloqueando la carpeta `.git`.

```bash
git clone https://github.com/yilmar1212/JAY-wallet.git
cd JAY-wallet
```

Instala las dependencias de las dos partes:

```bash
cd server
npm install
cd ../client
npm install
```

Crea el archivo de variables de entorno del servidor:

```bash
cd ../server
cp .env.example .env              # Linux, macOS o Git Bash
Copy-Item .env.example .env       # PowerShell
```

Abre `.env` y completa los valores (tabla de abajo). El archivo tiene que llamarse exactamente `.env`; en Windows es fácil que quede como `.env.txt` o `.env.example` sin darse cuenta.

Arranca las dos partes, cada una en su terminal:

```bash
# Backend: http://localhost:3000
cd server
npm run dev

# Frontend: http://localhost:5173
cd client
npm run dev
```

Si todo salió bien, el backend imprime que quedó escuchando y que conectó con Neon, y `http://localhost:3000/api/health` responde.

### Variables de entorno

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor. Por defecto `3000` |
| `DATABASE_URL` | Cadena de conexión de Neon. Es una credencial: no se sube a GitHub ni se pega en chats |
| `JWT_SECRET` | Clave con la que se firman los tokens. Debe ser larga y aleatoria |

Una forma de generar el `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## Autenticación

Así funciona hoy el acceso a la aplicación:

1. **Registro.** El backend valida que lleguen todos los campos y que el correo no exista. Luego cifra la contraseña con bcrypt y guarda el usuario en la tabla `usuarios`. La contraseña original nunca se guarda.
2. **Login.** Busca el usuario por correo y compara la contraseña con el hash usando `bcrypt.compare`. Si coincide, firma un JWT con el id y el correo del usuario. El token vence a las 2 horas.
3. **Sesión en el frontend.** El token se guarda en `localStorage` y se envía en las peticiones a rutas privadas. Cerrar sesión es borrarlo.
4. **Rutas privadas en el backend.** El middleware revisa el token de cada petición. Sin token, o con uno inválido o vencido, responde 401.
5. **Dashboard.** Si no hay token guardado, redirige al login. Ojo: esta revisión del frontend solo mejora la experiencia. La protección de verdad está en el backend, porque lo del navegador se puede saltar.

## Base de datos

Seis tablas y una vista, todas en PostgreSQL (Neon):

| Tabla | Qué guarda |
|---|---|
| `usuarios` | Los prestamistas: nombre, correo y contraseña cifrada |
| `deudores` | Nombre, documento, teléfono, dirección y correo de cada deudor |
| `prestamos` | Monto, tasa de interés, fecha de inicio y de vencimiento, estado |
| `abonos` | Pagos, parciales o totales, de un préstamo |
| `proveedores` | Entidades que le prestan capital al prestamista |
| `soportes` | Referencia a los archivos que respaldan un préstamo |
| `v_prestamos_saldo` (vista) | Cada préstamo con el total abonado, el saldo pendiente y si está vencido |

Algunas decisiones del diseño:

- El saldo pendiente y el estado "vencido" no se guardan, se calculan al consultar. Así, si se corrige un abono, el saldo se ajusta solo. El estado guardado es `activo`, `pagado` o `anulado`.
- El dinero va en `NUMERIC(14,2)`. Con `float` se acumulan errores de redondeo.
- El codeudor es otro registro de `deudores`.
- Los deudores, préstamos y proveedores llevan `usuario_id`, y cada consulta filtra por el usuario autenticado para que nadie vea datos ajenos.

Falta definir si la tasa de interés es mensual o anual, y si el interés es simple o compuesto.

## API

Lo que existe hoy y lo que viene. Las rutas pendientes son una propuesta y pueden cambiar.

| Ruta | Descripción | Estado |
|---|---|---|
| `GET /api/health` | Comprueba que el servidor responde | Hecho |
| `POST /api/auth/registro` | Crea un usuario | Hecho |
| `POST /api/auth/login` | Inicia sesión y devuelve el token | Hecho |
| `GET /api/prueba` | Ruta protegida para probar el middleware (se quitará) | Hecho |
| `GET` y `POST /api/deudores` | Listar y crear deudores | En curso |
| `GET`, `PUT` y `DELETE /api/deudores/:id` | Ver, editar y borrar un deudor | En curso |
| `GET` y `POST /api/prestamos` | Listar y crear préstamos | Pendiente |
| `GET /api/prestamos/:id` | Detalle con saldo y abonos | Pendiente |
| `POST /api/prestamos/:id/abonos` | Registrar un abono | Pendiente |
| `GET /api/estadisticas` | Totales prestado y por cobrar | Pendiente |
| `GET` y `POST /api/proveedores` | Proveedores | Pendiente |

## Cómo trabajamos

Hay una sola rama estable, `main`, y una rama por tarea.

```bash
git checkout main
git pull origin main
git checkout -b feature/nombre-de-la-tarea

# trabajar, y guardar en commits pequeños
git add .
git commit -m "feat: descripción de lo que hiciste"
git push -u origin feature/nombre-de-la-tarea
```

Después se abre un Pull Request hacia `main`, otro integrante lo revisa y se une con Squash and merge. La rama se borra al terminar.

Acuerdos:

- Nadie sube directo a `main`.
- Cada rama es de una sola tarea y dura uno o dos días.
- Los mensajes de commit empiezan con `feat:`, `fix:`, `docs:`, `refactor:` o `chore:`.
- Antes de `git add .` se revisa `git status`, para no subir el `.env` ni `node_modules`.

Las tareas están en un tablero de Notion, organizadas en sprints de una semana.

## Seguridad

El repositorio es público, así que cualquiera puede ver el código y todo el historial.

- Las credenciales van solo en `server/.env`, que está en el `.gitignore`.
- Si un secreto llega a subirse, borrar el commit no sirve: hay que cambiar la clave de inmediato.
- Las consultas SQL usan parámetros, nunca texto concatenado.
- En pruebas, capturas y demos se usan datos inventados, no de personas reales.

## Avance

**Sprint 0: preparación**
- [x] Arquitectura de la información y wireframes
- [x] Diseño de la base de datos y esquema ejecutado en Neon
- [x] Repositorio, flujo de ramas y limpieza de ramas de prueba
- [x] Estructura `client/` y `server/`
- [x] Servidor Express con `/api/health`
- [x] Conexión a Neon con variables de entorno
- [ ] Subir el esquema SQL al repositorio

**Sprint 1: acceso y deudores**
- [x] Registro de usuarios con contraseña cifrada
- [x] Login con JWT
- [x] Middleware de autenticación
- [x] Pantallas de login, registro y dashboard con rutas protegidas
- [ ] CRUD de deudores (backend y pantallas)

**Sprint 2: préstamos y abonos**
- [ ] Préstamos, abonos y cálculo del saldo
- [ ] Búsqueda y filtros

**Sprint 3: panorama general** (aquí termina el MVP)
- [ ] Pantalla principal, estadística e historial

**Sprint 4: cierre**
- [ ] Proveedores y soportes
- [ ] Validaciones, datos de prueba y sustentación

## Equipo

| Nombre | GitHub |
|---|---|
| Yilmar | [@yilmar1212](https://github.com/yilmar1212) |
| (completar) | (completar) |
| (completar) | (completar) |

Proyecto académico con fines educativos.