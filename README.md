# Industrial Monitoring

Plataforma de monitoreo industrial: permite gestionar **sensores**, **zonas** de una planta y la **asignación** de sensores a zonas (monitoreos) con su umbral y estado. Monorepo con backend (API REST) y frontend (SPA).

---

## Stack

| Capa | Tecnologías |
|------|-------------|
| **Backend** | Node.js · TypeScript · Express · Prisma 7 · MySQL |
| **Frontend** | React · TypeScript · Vite · Tailwind CSS · React Router · Axios |

---

## Estructura del proyecto

```
industrial-monitoring/
├── schema.sql          # Esquema MySQL + datos de prueba (13 registros)
├── backend/            # API REST (puerto 3000)
│   ├── prisma/         # schema.prisma + migraciones
│   └── src/            # routes / controllers / services / types / middlewares
└── frontend/           # SPA React (puerto 5173)
    └── src/            # pages / components / services / types
```

---

## Requisitos previos

Antes de empezar necesitas tener instalado:

- **Node.js 18 o superior** (recomendado 20+) → `node --version`
- **npm 9+** (viene con Node) → `npm --version`
- **MySQL 8 o superior** corriendo localmente → `mysql --version`
- **Git**

---

## Puesta en marcha (paso a paso)

> El proyecto tiene dos partes (backend y frontend) que se ejecutan **por separado**, cada una en su propia terminal. Sigue los pasos en orden.

### 1. Clonar el repositorio

```bash
git clone https://github.com/juanesbrice11/industrial-monitoring.git
cd industrial-monitoring
```

### 2. Crear la base de datos y cargar los datos de prueba

El archivo `schema.sql` (en la raíz) **crea la base de datos, las tablas y 13 registros de prueba** de una sola vez. Desde la raíz del proyecto:

```bash
mysql -u root -p < schema.sql
```

Te pedirá la contraseña de tu MySQL. Esto crea la base de datos llamada **`industrial_monitoring`** con sus 3 tablas (`sensor`, `zone`, `monitoring`) y los datos de ejemplo.

> Para verificar que se cargó bien:
> ```bash
> mysql -u root -p -e "USE industrial_monitoring; SELECT COUNT(*) FROM sensor;"
> ```
> Debe devolver 4 sensores.

### 3. Levantar el backend

En una terminal:

```bash
cd backend

# 3.1 Instalar dependencias
npm install

# 3.2 Crear el archivo .env a partir del ejemplo
cp .env.example .env
```

Abre `backend/.env` y ajusta la **`DATABASE_URL`** con el usuario y contraseña de TU MySQL:

```env
DATABASE_URL="mysql://root:TU_PASSWORD@localhost:3306/industrial_monitoring"
PORT=3000
```

```bash
# 3.3 Generar el cliente de Prisma (obligatorio tras clonar)
npx prisma generate

# 3.4 Iniciar el servidor en modo desarrollo
npm run dev
```

Si todo está bien verás: **`Servidor corriendo en http://localhost:3000`**

> Prueba rápida (en otra terminal): `curl http://localhost:3000/sensors` debe devolver los 4 sensores en JSON.

### 4. Levantar el frontend

En **otra** terminal (deja el backend corriendo):

```bash
cd frontend

# 4.1 Instalar dependencias
npm install

# 4.2 Crear el archivo .env a partir del ejemplo
cp .env.example .env
```

El `frontend/.env` ya viene apuntando al backend local (no necesitas cambiar nada si usaste el puerto 3000):

```env
VITE_API_URL=http://localhost:3000
```

```bash
# 4.3 Iniciar la aplicación
npm run dev
```

Abre el navegador en **http://localhost:5173**

---

## Variables de entorno

| Archivo | Variable | Descripción | Valor por defecto |
|---------|----------|-------------|-------------------|
| `backend/.env` | `DATABASE_URL` | Cadena de conexión MySQL | `mysql://root:pass@localhost:3306/industrial_monitoring` |
| `backend/.env` | `PORT` | Puerto del backend | `3000` |
| `frontend/.env` | `VITE_API_URL` | URL del backend que consume el frontend | `http://localhost:3000` |

> Los archivos `.env` reales no se versionan (están en `.gitignore`). Usa los `.env.example` como plantilla.

---

## Scripts disponibles

**Backend** (`cd backend`):

| Script | Acción |
|--------|--------|
| `npm run dev` | Servidor en desarrollo con recarga automática |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm start` | Ejecuta la versión compilada (`dist/index.js`) |

**Frontend** (`cd frontend`):

| Script | Acción |
|--------|--------|
| `npm run dev` | Servidor de desarrollo (Vite) |
| `npm run build` | Build de producción |
| `npm run preview` | Sirve el build de producción |

---

## API — Endpoints

Base URL: `http://localhost:3000`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/sensors` | Lista todos los sensores |
| `GET` | `/sensors/:id/zones` | Zonas monitoreadas por un sensor |
| `GET` | `/zones` | Lista zonas con su nº de sensores activos |
| `GET` | `/zones/:id` | Detalle de una zona |
| `GET` | `/zones/:id/sensors` | Sensores de una zona (con tipo de lectura, umbral y estado) |
| `GET` | `/monitorings` | Lista monitoreos. Filtro opcional: `?status=ACTIVO` o `?status=PAUSADO` |
| `POST` | `/monitorings` | Asigna un sensor a una zona |
| `PATCH` | `/monitorings/:id` | Actualiza el umbral y/o el estado de un monitoreo |

Todas las respuestas siguen el formato:

```json
{ "success": true, "data": { } }
{ "success": false, "error": "mensaje descriptivo", "data": null }
```

**Ejemplo — crear un monitoreo:**

```bash
curl -X POST http://localhost:3000/monitorings \
  -H "Content-Type: application/json" \
  -d '{
    "sensorId": 3,
    "zoneId": 1,
    "fechaInstalacion": "2024-01-15",
    "tipoLectura": "VIBRACION",
    "valorUmbral": 50,
    "estado": "ACTIVO"
  }'
```

---

## Solución de problemas

| Problema | Causa probable / solución |
|----------|---------------------------|
| `Can't reach database server` al iniciar el backend | MySQL no está corriendo, o la `DATABASE_URL` (usuario/clave/puerto) es incorrecta |
| `@prisma/client did not initialize yet` / error de import de Prisma | Falta ejecutar `npx prisma generate` en `backend/` tras clonar |
| `EADDRINUSE: address already in use :::3000` | Ya hay un proceso usando el puerto 3000. Ciérralo o cambia `PORT` en `backend/.env` |
| El frontend carga pero no muestra datos | El backend no está corriendo, o `VITE_API_URL` en `frontend/.env` no apunta al backend |
| La tabla ya existe al correr `schema.sql` | La base de datos ya estaba creada. Bórrala (`DROP DATABASE industrial_monitoring;`) y vuelve a ejecutar `schema.sql` |

> **Alternativa al paso 2** (en vez de `schema.sql`): puedes crear el esquema con las migraciones de Prisma ejecutando `npx prisma migrate deploy` en `backend/`. Ten en cuenta que **ese método crea las tablas pero no inserta los datos de prueba** — para los datos de ejemplo usa `schema.sql`.
