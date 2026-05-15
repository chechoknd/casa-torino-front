# Instalación y Despliegue de Casa Torino Frontend

Este documento describe los requisitos previos y pasos necesarios para ejecutar el proyecto en tu entorno local de desarrollo, así como las instrucciones de configuración para desplegar la aplicación en Vercel.

## 1. Requisitos Previos

Asegúrate de tener instalados en tu sistema los siguientes componentes:

- **Node.js**: Versión LTS (recomendada `v20.x` o superior, actualmente probado en `v25.x`).
- **NPM**: Incluido nativamente con Node.js (recomendada `v10.x` o superior).
- **Angular CLI**: Opcional a nivel global, pero recomendable para comandos extra (`npm install -g @angular/cli`).

## 2. Configuración Local

Sigue estos pasos para levantar el entorno de desarrollo:

1. **Clonar el repositorio y entrar al directorio:**
   ```bash
   git clone https://github.com/chechoknd/casa-torino-front.git
   cd casa-torino-front
   ```

2. **Instalar las dependencias:**
   ```bash
   npm install
   ```

3. **Configuración de Variables de Entorno (API):**
   Las configuraciones locales para la comunicación con el backend (API) se encuentran en el archivo:
   `src/environments/environment.development.ts`
   
   Por defecto, la API en desarrollo apunta a `/api` para aprovechar el proxy de Angular:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: '/api'
   };
   ```
   *Nota: El archivo `proxy.conf.json` incluido en el proyecto se encarga automáticamente de redirigir todas las peticiones que empiecen por `/api` hacia `http://localhost:8000` para evitar problemas de CORS durante el desarrollo.*

4. **Levantar el servidor de desarrollo:**
   Ejecuta el siguiente comando para iniciar la app:
   ```bash
   npm start
   ```
   La aplicación se ejecutará y estará accesible en: [http://localhost:4200/](http://localhost:4200/).

---

## 3. Despliegue en Vercel

Dado que Casa Torino es una Single Page Application (SPA) basada en Angular, Vercel requiere cierta configuración para manejar correctamente el enrutamiento y servir los archivos compilados.

### A. Configuración desde el panel de Vercel

1. Inicia sesión en [Vercel](https://vercel.com/) y haz clic en **Add New... > Project**.
2. Importa tu repositorio `casa-torino-front` desde GitHub.
3. En la pantalla de **Configure Project**, asegúrate de que el **Framework Preset** sea detectado como **Angular**.
4. Valida los comandos de construcción (Build and Output Settings):
   - **Build Command:** `npm run build` o `ng build`
   - **Output Directory:** `dist/casa-torino-front`
   - **Install Command:** `npm install`
5. **Variables de Entorno (Environment Variables):**
   Si la URL de tu API de producción es dinámica, puedes definirla aquí. De lo contrario, Angular la tomará directamente del archivo `src/environments/environment.ts` (asegúrate de que ese archivo contenga la URL real de tu backend en producción, ej. `https://api.casatorino.com`).

### B. Configuración de enrutamiento (vercel.json)

Dado que Angular maneja su propio sistema de rutas, al recargar una página que no sea la raíz (ej. `/customers`), Vercel devolverá un error 404 por defecto. Para solucionar esto, hemos incluido un archivo `vercel.json` en la raíz (si no existe, debes crearlo con el siguiente contenido):

```json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

*Este archivo instruye a Vercel a redirigir cualquier ruta no encontrada hacia el `index.html` de Angular, permitiendo que el router interno procese la vista correctamente.*

### C. Desplegar

Con estas configuraciones, simplemente haz clic en **Deploy**. Vercel construirá la aplicación ejecutando `ng build` y publicará los recursos del directorio `dist/casa-torino-front` en una URL segura HTTPS de forma automática.
