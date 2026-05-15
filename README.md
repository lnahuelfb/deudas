# DeudApp - Backend API ⚙️🔒

Servicio backend de alto rendimiento diseñado para la plataforma DeudApp. Maneja la lógica de negocio de tarjetas, deudas, suscripciones y autenticación, sirviendo como fuente de la verdad para la base de datos PostgreSQL.

## 🚀 Tecnologías Principales

- **Entorno:** Node.js + Express
- **Lenguaje:** TypeScript (Compilación a CommonJS)
- **Base de Datos:** PostgreSQL
- **ORM:** Prisma
- **Autenticación:** JWT (JSON Web Tokens) vía Cookies HTTP-Only
- **Validación:** Zod
- **Gestor de paquetes:** pnpm

## ✨ Características Clave

- **Arquitectura Modular:** Separación limpia por dominios (usuarios, deudas, tarjetas, auth) implementando el patrón Controller-Service.
- **Seguridad Cross-Domain (CORS & Cookies):** Configuración explícita para permitir el intercambio seguro de credenciales (Cookies `SameSite: None` y `Secure`) entre dominios diferentes (ej. Backend en `api.dominio.com` y Frontend en `app.dominio.com`).
- **Prisma Schema Optimization:** Relaciones precisas en cascada y constraints fuertes en la base de datos para garantizar la integridad financiera de las tarjetas y deudas.
- **Serverless Ready:** Configurado para ejecutarse eficientemente bajo Vercel Serverless Functions (`vercel.json` y salida a `CommonJS`).

## 🛠️ Instalación y Uso Local

1. Asegúrate de tener **Node.js** y **pnpm** instalados.
2. Clona el repositorio y navega a esta carpeta.
3. Instala las dependencias:
   ```bash
   pnpm install
   ```
4. Configura tus variables de entorno creando un archivo `.env`:
   ```env
   PORT=3000
   DATABASE_URL="postgresql://usuario:password@localhost:5432/deudas_db?schema=public"
   JWT_SECRET="tu_super_secreto_local"
   ADMIN_PASSWORD="tu_password_de_creacion"
   ORIGIN="http://localhost:5173"
   ```
5. Sincroniza la base de datos con Prisma:
   ```bash
   pnpm dlx prisma db push
   ```
6. Levanta el servidor en modo desarrollo:
   ```bash
   pnpm run dev
   ```

## 📦 Despliegue en Producción (Vercel)

El proyecto está adaptado para compilar correctamente en los entornos de Vercel (CommonJS Node runtime).
Asegúrate de configurar en tu dashboard de Vercel las siguientes variables de entorno:
- `DATABASE_URL` (Tu BD Postgres productiva, preferentemente Supabase o Neon)
- `JWT_SECRET` (Secreto robusto para producción)
- `ORIGIN` (La URL exacta de tu frontend productivo, ej: `https://deudas-ashen.vercel.app`)

**Comandos de build configurados para Vercel:**
El script `build` en el `package.json` ya se encarga de generar el cliente de Prisma y compilar TypeScript:
```json
"build": "prisma generate && tsc"
```
