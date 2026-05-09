# Informe de Vulnerabilidades y Riesgos de Seguridad

> **Proyecto:** Casa Torino Frontend (Angular 20 + NgRx)
> **Fecha del análisis:** 8 de mayo de 2026
> **Propósito:** Identificar riesgos de seguridad en el frontend para priorizar correcciones.

---

## Resumen Ejecutivo

| Severidad | Cantidad | Hallazgos clave |
|-----------|----------|-----------------|
| **Critical** | 1 | JWT almacenado en `localStorage` sin cookie HttpOnly ni refresh token |
| **High** | 5 | Sin CSP, open redirect potencial, fuga de errores del backend en recipes effect, devtools en bundle de producción, PII en NgRx store |
| **Medium** | 4 | Errores silenciados en effects, headers de seguridad faltantes, recursos externos sin SRI, sin HTTPS forcing |
| **Low** | 3 | Mensajes de error genéricos, password toggle visible sin timeout, sin protección contra fuerza bruta |

**Total de vulnerabilidades encontradas: 13**

---

## CRITICAL

### C-01: JWT en localStorage sin HttpOnly ni Refresh Token

| Atributo | Detalle |
|----------|---------|
| **Archivo** | `src/app/core/services/auth.service.ts:65,73,82,89-90,96` |
| **Severidad** | Critical |
| **CWE** | CWE-312 (Cleartext Storage of Sensitive Information), CWE-522 (Insufficiently Protected Credentials) |

**Descripción:** El token JWT de autenticación se almacena en `localStorage` mediante `localStorage.setItem(authStorageKey, JSON.stringify(session))`. No existe un mecanismo de refresh token; solo hay un `accessToken` con un campo `expiresAt`.

**Riesgo:** `localStorage` es accesible por **cualquier JavaScript que se ejecute en el mismo origen**, incluyendo:
- Scripts de terceros cargados vía CDN
- Extensiones de navegador
- Payloads XSS
- Código malicioso inyectado

El token no puede marcarse como `HttpOnly` ni `Secure` al ser almacenado del lado del cliente, lo que facilita su exfiltración vía XSS. Además, al no haber refresh token, una vez que el access token expira, el usuario simplemente se desconecta sin posibilidad de refresco silencioso.

**Solución recomendada:**
1. Migrar el almacenamiento a **cookies HttpOnly, Secure, SameSite=Strict** para el token.
2. Implementar un flujo de **refresh token** con un endpoint `/auth/refresh`.
3. Si no es factible usar cookies, al menos implementar un store en memoria (con refresh) y requerir reautenticación al recargar la página.

---

## HIGH

### H-01: Falta de Content Security Policy (CSP)

| Atributo | Detalle |
|----------|---------|
| **Archivo** | `src/index.html` |
| **Severidad** | High |
| **CWE** | CWE-1021 (Improper Restriction of Rendered UI Layers or Frames), CWE-79 (Cross-Site Scripting) |

**Descripción:** El `<head>` de `index.html` carece de una etiqueta `<meta http-equiv="Content-Security-Policy">`. La aplicación carga Google Fonts y Material Icons desde CDNs externos (`fonts.googleapis.com`, `fonts.gstatic.com`) sin restricciones CSP.

**Riesgo:** Sin CSP, cualquier vulnerabilidad XSS puede ejecutar scripts arbitrarios sin restricción. Los recursos externos cargados no tienen verificación de integridad ni límites de origen.

**Solución recomendada:** Agregar una política CSP estricta en `index.html`:
```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self';
               style-src 'self' https://fonts.googleapis.com;
               font-src 'self' https://fonts.gstatic.com;
               img-src 'self' data:;
               connect-src 'self' https://casa-torino-back-go.onrender.com;">
```

---

### H-02: Open Redirect Potencial vía returnUrl

| Atributo | Detalle |
|----------|---------|
| **Archivo** | `src/app/features/auth/login.component.ts:136-138,154,159-162` |
| **Severidad** | High |
| **CWE** | CWE-601 (Open Redirect) |

**Descripción:** El `LoginComponent` lee `returnUrl` de los query params y redirige allí tras el login (`navigateByUrl`). El método `getReturnUrl()` valida que comience con `/`, lo que bloquea URLs como `https://evil.com` y `//evil.com`, pero la validación es insuficiente.

**Riesgo:** Si la lógica de validación cambia en el futuro o si existe una ruta interna que redirija a externos, un atacante podría redirigir a un sitio malicioso después del login legítimo (phishing).

**Solución recomendada:** Usar `router.parseUrl()` para validar y restringir los destinos de redirección a una lista blanca de rutas conocidas de la aplicación, o usar `Router.createUrlTree` en lugar de `navigateByUrl` con string directo.

---

### H-03: Fuga de Detalles del Backend en Recipes Effect

| Atributo | Detalle |
|----------|---------|
| **Archivo** | `src/app/features/recipes/store/recipes.effects.ts:17-54` |
| **Severidad** | High |
| **CWE** | CWE-209 (Information Exposure Through an Error Message) |

**Descripción:** El método `getErrorMessage` extrae `error.error.detail`, `error.error.message`, y detalles de arrays de errores directamente de la respuesta HTTP y los **muestra al usuario mediante el notifier**. Es el **único** effects file que hace esto — el resto usa strings estáticos genéricos.

**Riesgo:** Las respuestas de error del backend pueden filtrar información interna como errores SQL, stack traces, rutas internas del servidor, o detalles del esquema de base de datos. Esto es una **fuga de información** que puede ayudar a atacantes a elaborar ataques más sofisticados.

**Solución recomendada:** Reemplazar la extracción de detalles del error por un mensaje genérico consistente con el resto de effects, y registrar el error completo en consola o en un sistema de monitoreo.

---

### H-04: Store Devtools Incluido en Bundle de Producción

| Atributo | Detalle |
|----------|---------|
| **Archivo** | `src/app/app.config.ts:49-52` |
| **Severidad** | High |
| **CWE** | CWE-200 (Information Exposure) |

**Descripción:** `provideStoreDevtools` está configurado con `logOnly: !isDevMode()`, que es correcto para development, pero el módulo `provideStoreDevtools` **siempre se registra** independientemente del entorno.

**Riesgo:** Aunque `isDevMode()` retorna `false` en producción y `logOnly: true` limita a solo lectura, el código de devtools **sigue cargado en el bundle de producción**. Todo el estado de la aplicación — incluyendo usuarios autenticados, PII de clientes, pedidos, pagos — es inspeccionable vía la extensión Redux DevTools por cualquier usuario que tenga la extensión instalada.

**Solución recomendada:** Registrar `provideStoreDevtools` condicionalmente solo en desarrollo:
```ts
...(isDevMode() ? [provideStoreDevtools({ maxAge: 25, logOnly: false })] : [])
```

---

### H-05: Datos Personales (PII) en NgRx Store

| Atributo | Detalle |
|----------|---------|
| **Archivo** | `src/app/features/customers/store/*`, `src/app/features/orders/store/*`, `src/app/core/services/auth.service.ts:25` |
| **Severidad** | High |
| **CWE** | CWE-200 (Information Exposure) |

**Descripción:** Los datos personales de clientes (nombres completos, correos electrónicos, teléfonos, tipos de cliente), datos de pedidos y del usuario autenticado (`AuthUser` con `email`, `username`, `full_name`) se almacenan en el store de NgRx.

**Riesgo:** Cualquier extensión de navegador con acceso al store, cualquier exploit XSS, o cualquier usuario con Redux DevTools puede leer toda la PII de clientes, pedidos y datos de perfil. Esto representa una **violación masiva de privacidad de datos** y un riesgo de cumplimiento con **GDPR/Ley de Protección de Datos de Colombia**.

**Solución recomendada:** Minimizar el payload del store — almacenar solo IDs y nombres para visualización. Mantener campos sensibles detrás de servicios que no pasen por el store. Si los datos completos deben estar en el store, considerar cifrado o patrones de almacenamiento efímero.

---

## MEDIUM

### M-01: Errores Silenciados en Effects sin Logging

| Atributo | Detalle |
|----------|---------|
| **Archivo** | Todos los effects: `customers.effects.ts`, `orders.effects.ts`, `products.effects.ts`, `ingredients.effects.ts`, `payments.effects.ts` |
| **Severidad** | Medium |
| **CWE** | CWE-778 (Insufficient Logging) |

**Descripción:** Todos los bloques `catchError` en effects retornan una acción de fallo con un string de error estático, pero **nunca registran el error real** en consola ni en un servicio de monitoreo. El objeto de error original se descarta por completo.

**Riesgo:** El fallo silencioso dificulta enormemente la depuración de incidentes de producción. Atacantes que sondeen la API pasarán desapercibidos en los logs del frontend. Los incidentes de seguridad no pueden rastrearse.

**Solución recomendada:** Agregar `console.error` (al menos) en cada `catchError` antes de retornar la acción de fallo. En producción, integrar con un servicio de monitoreo como Sentry o Datadog.

---

### M-02: Headers de Seguridad HTTP Faltantes

| Atributo | Detalle |
|----------|---------|
| **Archivo** | `src/index.html` (y configuración del servidor backend) |
| **Severidad** | Medium |
| **CWE** | CWE-693 (Protection Mechanism Failure) |

**Descripción:** No se configuran `X-XSS-Protection`, `X-Content-Type-Options: nosniff`, `X-Frame-Options`, `Referrer-Policy`, ni `Permissions-Policy`. Estos headers deben establecerse **del lado del servidor** (backend), no mediante meta tags HTML.

**Riesgo:** Navegadores antiguos pueden ser vulnerables a content sniffing, framing (clickjacking) o XSS reflejado. La falta de `Referrer-Policy` puede filtrar la URL completa en peticiones a otros orígenes.

**Solución recomendada:** Asegurar que el servidor backend (Render/casa-torino-back) retorne estos headers en todas las respuestas HTTP, incluyendo la entrega de `index.html`:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

---

### M-03: Recursos Externos sin Subresource Integrity (SRI)

| Atributo | Detalle |
|----------|---------|
| **Archivo** | `src/index.html:8-13` |
| **Severidad** | Medium |
| **CWE** | CWE-345 (Insufficient Verification of Data Authenticity) |

**Descripción:** Google Fonts y Material Icons se cargan desde CDNs externos sin atributos `integrity` (SRI).

**Riesgo:** Si un CDN es comprometido, podrían servirse fuentes CSS maliciosas, potencialmente exfiltrando datos mediante ataques de inyección CSS (ej: `@font-face` con `unicode-range` + `src` apuntando a servidor del atacante para cada carácter escrito en campos de formulario).

**Solución recomendada:** Auto-hospedar estos activos o agregar `crossorigin="anonymous"` con hashes SRI. Alternativamente, restringir con CSP `font-src` y `style-src`.

---

### M-04: Proxy de Desarrollo con `secure: false`

| Atributo | Detalle |
|----------|---------|
| **Archivo** | `proxy.conf.json:5` |
| **Severidad** | Medium |

**Descripción:** El proxy de desarrollo tiene `"secure": false`, que deshabilita la verificación de certificados SSL al hacer proxy a `http://localhost:8080`.

**Riesgo:** Esto es aceptable para desarrollo local (localhost), pero crea un precedente riesgoso. Si alguien modificara las URLs de entorno para usar HTTP en producción, todo el tráfico viajaría en texto plano.

**Solución recomendada:** No es una vulnerabilidad de producción per se, pero documentar que `secure: false` es solo para desarrollo. En producción, la aplicación nunca debe permitir HTTP.

---

## LOW

### L-01: Posible Fuga de Información en Mensajes de Error

| Atributo | Detalle |
|----------|---------|
| **Archivo** | `src/app/features/recipes/store/recipes.effects.ts:17-54` (ya cubierto en H-03) |
| **Severidad** | Low (redundante con H-03, incluido por completitud) |

**Descripción:** Los demás effects usan mensajes de error genéricos (seguro). El componente login solo mapea códigos de error conocidos (`INVALID_CREDENTIALS`, `DUPLICATE_EMAIL`, etc.). El único riesgoso es `recipes.effects.ts`.

---

### L-02: Password Toggle sin Ocultación Automática por Inactividad

| Atributo | Detalle |
|----------|---------|
| **Archivo** | `src/app/features/auth/login.component.ts:36-44` |
| **Severidad** | Low |

**Descripción:** El campo de contraseña puede alternarse visible mediante el ícono del ojo. Una vez visible, permanece así hasta que el usuario lo oculte manualmente.

**Riesgo:** Ataque de shoulder-surfing (observación visual): un atacante mirando la pantalla puede leer la contraseña si el usuario la deja visible y se aleja.

**Solución recomendada:** Agregar un timeout automático (ej: 5 segundos) para re-ocultar la contraseña después de mostrarla.

---

### L-03: Sin Protección contra Fuerza Bruta en el Frontend

| Atributo | Detalle |
|----------|---------|
| **Archivo** | `src/app/features/auth/login.component.ts:141-157` |
| **Severidad** | Low |
| **CWE** | CWE-307 (Improper Restriction of Excessive Authentication Attempts) |

**Descripción:** El formulario de login no tiene rate limiting, CAPTCHA, ni mecanismo de bloqueo de cuenta. La señal `loading` previene doble envío pero no evita ataques de fuerza bruta.

**Riesgo:** Ataque de fuerza bruta contra el endpoint de login. Si bien esto es principalmente responsabilidad del backend, el frontend podría agregar una capa adicional de protección.

**Solución recomendada:** Agregar un delay progresivo del lado del cliente (ej: 1s, 2s, 4s) después de intentos fallidos antes de permitir la siguiente petición.

---

## Prácticas Seguras Identificadas (No Issues)

| Categoría | Hallazgo | Archivo |
|-----------|----------|---------|
| **XSS** | No se usa `innerHTML`, `bypassSecurityTrustHtml` ni `[innerHTML]` | Todos los templates |
| **Sanitización** | La sanitización incorporada de Angular nunca se desactiva | Todos los archivos |
| **Template Injection** | Toda interpolación usa `{{ }}` (seguro) o pipes de Angular (`date`, `currencyCop`, `async`) | Todos los templates |
| **Route Guard** | `authChildGuard` protege todas las rutas lazy-loaded de features | `app.routes.ts:13` |
| **returnUrl Validation** | Correctamente requiere prefijo `/`, bloqueando open redirect a URLs externas | `login.component.ts:161` |
| **Auth Interceptor** | El token Bearer solo se adjunta a peticiones API, no a URLs externas | `auth.interceptor.ts:14-16` |
| **Expiración de Token** | `isExpired` valida correctamente la expiración del token antes de usarlo | `auth.service.ts:118-121` |
| **Store Devtools logOnly** | `logOnly: !isDevMode()` previene time-travel debugging en producción | `app.config.ts:51` |
| **Validación URL Constructor** | `isBackendApiRequest` usa `new URL()` con try/catch | `auth.interceptor.ts:40-48` |
| **TypeScript Strict** | No se usan tipos `any` (excepto manejadores de error en effects) | Todos |
| **OnPush** | Todos los componentes usan ChangeDetectionStrategy.OnPush | Todos los componentes |
| **Autocomplete** | Atributos `autocomplete` correctamente configurados | `login.component.ts:30,36` |
| **ARIA Labels** | Elementos interactivos tienen `aria-label` significativos | Login, shell, tablas |
| **Secretos** | No hay claves de API, tokens, ni secretos en el código fuente | Todos los archivos |

---

## Plan de Acción Recomendado

| Prioridad | Vulnerabilidad | Esfuerzo estimado | Impacto |
|-----------|---------------|-------------------|---------|
| 1 | **C-01**: Migrar token a HttpOnly cookie con refresh token | Alta | Crítico |
| 2 | **H-01**: Agregar CSP a `index.html` | Bajo | Alto |
| 3 | **H-03**: Fix recipes effect para no exponer errores del backend | Bajo | Alto |
| 4 | **H-04**: Registrar provideStoreDevtools solo en dev mode | Bajo | Alto |
| 5 | **H-05**: Minimizar PII en NgRx store | Medio | Alto |
| 6 | **M-01**: Agregar console.error en todos los catchError | Bajo | Medio |
| 7 | **M-02**: Configurar headers de seguridad en backend | Medio | Medio |
| 8 | **M-03**: Agregar SRI o auto-hospedar recursos externos | Medio | Medio |
| 9 | **H-02**: Reforzar validación de returnUrl | Bajo | Medio |
| 10 | **L-03**: Agregar delay progresivo en login | Bajo | Bajo |

---

*Documento generado como parte de una auditoría de seguridad automatizada. Se recomienda revisión manual por un equipo de seguridad antes de implementar cambios en producción.*
