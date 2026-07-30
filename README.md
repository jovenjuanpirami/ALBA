# ALBA — landing de validación (fake-door test)

Sitio de una sola página que se ve como una tienda real. Al dar clic en comprar no hay
checkout: se abre un modal que dice **"Todavía no está a la venta"** y pide el correo.

**No procesa pagos y no existe ningún campo de tarjeta en todo el código.**

La métrica que importa: clics en el botón de compra sobre visitantes únicos, y de ésos,
cuántos dejan su correo. Todo lo demás existe para producir ese número de forma honesta.

## El producto

Un solo SKU, dos sabores.

| | |
|---|---|
| Producto | Bolsa de 2.3 kg · 20 porciones |
| Sabores | Chocolate, Vainilla · misma fórmula |
| Precio variante A | **$990** ($50 por porción) |
| Precio variante B | **$1,190** ($60 por porción) |
| Envío | Gratis en todos los pedidos |

**Sobre el A/B:** la variante A es el precio que pediste. Dejé una B a $1,190 porque la
elasticidad de precio es lo más valioso que puede medir esta landing y no cuesta nada de UI
—cada visitante ve un solo precio y no sabe que existe el otro. Si quieres precio único,
iguala `B` a `A` en [lib/pricing.ts](lib/pricing.ts) y todo lo demás sigue funcionando.

**Dos cosas que cambiaron al pasar a un solo SKU:** el umbral de envío gratis a $999 era
inalcanzable con un producto de $990, así que ahora el envío es gratis siempre y quité los
MSI del copy (los 6 meses necesitan ~$1,500). Y desapareció la señal de suscripción, que era
una de las seis métricas de decisión del brief: este test ya no te va a decir si la gente se
compromete a un hábito mensual, solo si compra una bolsa.

---

## Arrancar en local

```bash
npm install
cp .env.example .env.local     # llena las variables (ver abajo)
npm run dev                    # http://localhost:3000
```

El sitio **corre sin credenciales**. Si faltan las de Supabase o Resend, los eventos se
imprimen en la consola del servidor en lugar de guardarse, y el formulario responde con
éxito para que puedas probar el flujo completo. En producción sin Supabase, `/api/waitlist`
responde 503 en lugar de perder registros en silencio.

## Qué tienes que dar de alta para capturar correos de verdad

No falta instalar ningún paquete de npm — todo el código ya está. Lo que falta son **dos
cuentas**. Sin ellas el botón funciona pero el correo no se guarda en ningún lado.

### 1. Supabase — guarda los correos y los eventos (gratis)

1. Entra a [supabase.com](https://supabase.com) → **New project**. Región: `us-east-1` o
   `us-west-1`. Guarda la contraseña de la base aunque no la vayas a usar.
2. En el proyecto, ve a **SQL Editor** → **New query**, pega **todo** el contenido de
   [supabase/schema.sql](supabase/schema.sql) y corre **Run**. Debe decir "Success".
3. Ve a **Project Settings → API** y copia dos cosas:
   - **Project URL** → va en `NEXT_PUBLIC_SUPABASE_URL`
   - **`service_role` secret** (no la `anon`) → va en `SUPABASE_SERVICE_ROLE_KEY`

La `service_role` es una llave de administrador. Nunca la pongas en una variable que empiece
con `NEXT_PUBLIC_` y nunca la pegues en un mensaje o en el frontend.

### 2. Resend — manda el correo de confirmación (gratis hasta 3,000/mes)

1. Entra a [resend.com](https://resend.com) → crea cuenta → **API Keys** → **Create API Key**
   con permiso *Sending access*. Cópiala a `RESEND_API_KEY`.
2. **Para probar hoy mismo:** deja `RESEND_FROM="Alba <onboarding@resend.dev>"`. Funciona sin
   configurar nada, pero **solo te manda correos a ti mismo** (la dirección con la que te
   registraste).
3. **Para el lanzamiento real:** **Domains** → **Add Domain** con tu dominio, y agrega los
   registros DNS que te da (SPF, DKIM y DMARC) donde tengas el dominio. Cuando quede
   *Verified*, pon `RESEND_FROM="Alba <hola@tudominio.mx>"`. Sin esto, los correos se van a
   spam.

### 3. `.env.local`

Crea el archivo en la raíz del proyecto (no se sube a git):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
RESEND_API_KEY=re_...
RESEND_FROM=Alba <onboarding@resend.dev>
ADMIN_DASHBOARD_TOKEN=inventa-algo-largo-y-aleatorio
```

Reinicia `npm run dev` — las variables de entorno solo se leen al arrancar.

### 4. Comprobar que sí está guardando

1. Abre el sitio, da clic en **Comprar**, escribe tu correo, marca la casilla y envía.
2. En Supabase → **Table Editor → waitlist**: debe haber un renglón con tu correo, el sabor,
   la variante de precio y el precio exacto que viste.
3. Abre `http://localhost:3000/admin?token=TU_TOKEN`: los contadores deben moverse.
4. Revisa tu bandeja: debe llegar el correo de confirmación.

Si el renglón no aparece, la consola donde corre `npm run dev` te dice exactamente por qué.

### 5. Para publicarlo

```bash
npm i -g vercel     # el CLI no está instalado en esta máquina
vercel link
vercel --prod
```

Las mismas variables van en **Vercel → Project → Settings → Environment Variables**. Las de
Supabase y Resend se pueden provisionar desde el Vercel Marketplace
(`vercel integration add supabase`) y quedan inyectadas sin copiarlas a mano.

## Variables de entorno

| Variable | Obligatoria | Para qué |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | sí | Base de datos |
| `SUPABASE_SERVICE_ROLE_KEY` | sí | Inserts desde el servidor. **Sin prefijo `NEXT_PUBLIC_`: nunca llega al bundle del cliente** |
| `RESEND_API_KEY` | sí | Correo de confirmación |
| `RESEND_FROM` | sí | Remitente verificado en Resend, ej. `Alba <hola@tudominio.mx>` |
| `RESEND_REPLY_TO` | no | Para que las bajas lleguen a un buzón real |
| `NEXT_PUBLIC_META_PIXEL_ID` | no | Pixel. Si falta, no se inyecta nada |
| `NEXT_PUBLIC_GA4_ID` | no | GA4. Si falta, no se inyecta nada |
| `ADMIN_DASHBOARD_TOKEN` | sí | Protege `/admin?token=...`. Sin token configurado, la ruta responde 404 |

## Base de datos

Corre [`supabase/schema.sql`](supabase/schema.sql) completo en el SQL editor de Supabase.
Crea las dos tablas, los índices, activa RLS **sin políticas** y revoca permisos a `anon`
y `authenticated`: la única forma de escribir o leer es el service role desde el servidor.

---

## Sistema visual

Tokens tomados del kit de identidad (`ALBA Supplement Logo Design/ALBA Logo.dc.html`), no del
brief original — el brief pedía papel gris frío y ultramar, y la marca real es papel cálido y
sol ámbar. Manda la marca.

| Token | Valor | Uso |
|---|---|---|
| `paper` | `#F5F2ED` | fondo base |
| `card` | `#FFFDFA` | superficies elevadas |
| `paper-deep` | `#EFEAE1` | bandas |
| `ink` | `#1C1A17` | texto, CTAs, footer |
| `slate` | `#6B6157` | texto secundario (5.5:1 sobre paper) |
| `rule` | `#DDD6CA` | hairlines |
| `amber` | `#E8A340` | sol, badges, hover de CTA |
| `ember` | `#C9762B` | sol (base del gradiente), foco |
| `ember-deep` | `#8A5A1F` | acento en texto pequeño (5.3:1 sobre paper) |

Tipografía: **Jost** (display y wordmark, 300), **Inter Tight** (cuerpo), **JetBrains Mono**
(precios, panel de nutrientes, etiquetas).

**Nota de contraste:** el ámbar y el ember no llegan a AA con texto papel encima (3.07:1), así
que los CTAs hacen hover a `amber` **invirtiendo el texto a tinta** (8.2:1). Por eso el footer
usa `tone="invert"` en `BuyButton` en lugar de sobreescribir clases: en Tailwind el orden de
clases en el JSX no decide qué utilidad gana.

### Logo

[components/Logo.tsx](components/Logo.tsx) reconstruye la marca en SVG desde el kit: arco con
gradiente `#E8A340 → #C9762B` sobre una regla de tinta 1.27× más ancha. Exporta `SunMark`
(con `animate` para que el sol amanezca en la primera pintura), `Wordmark` y `LogoLockup`.
`app/icon.svg` es el favicon con la misma construcción.

### Imágenes

Los tres renders viven en [media/](media/) y se importan estáticamente, así que next/image
genera el `blurDataURL` y el blur-up sale gratis.

| Archivo | Nativo | Dónde |
|---|---|---|
| `hero-package.png` | 566×552 | hero (`priority`) y tarjeta de la oferta |
| `lifestyle-vainilla.png` | 431×611 | sección de sabores |
| `lifestyle-chocolate.png` | 431×607 | sección de sabores |
| `ingredients-vainilla.png` | 415×297 | sección de sabores |
| `ingredients-chocolate.png` | 409×295 | sección de sabores |

Las cuatro de sabores viven apiladas y hacen **cross-fade** al cambiar el toggle: no se
recarga nada, se cruzan las opacidades. Cada cambio dispara `sku_toggle`, así que la
preferencia de sabor es un dato medido, no una suposición.

**Están al límite de resolución.** Los muestro a un ancho igual o menor que el nativo para que
se vean nítidos en 1×, pero en pantallas retina van a verse suaves. Vale la pena volver a
renderizarlos a 2× (≥1200 px de ancho) — es el cambio de mayor impacto visual que queda.

### Animación

Más de la que pedía el brief original ("casi nada"), por decisión tuya. Todo es entrada, nunca
bucle: `dawn-rise` en el hero escalonado, el arco del logo dibujándose, y `Reveal`
(IntersectionObserver, una sola vez por elemento) en cada sección. Sin listeners de scroll
salvo el header y la barra pegajosa. `prefers-reduced-motion` neutraliza todo y deja el
contenido visible.

## Arquitectura

```
middleware.ts              asigna session_id, variante de precio y atribución de primer toque
media/                     los tres renders, importados estáticamente por next/image
app/page.tsx               landing (server component + islas de cliente)
app/aviso-de-privacidad/   página estática (LFPDPPP)
app/gracias/               confirmación post-registro (noindex)
app/admin/                 dashboard interno, protegido por token
app/api/waitlist/          POST guarda el correo · PATCH guarda el WTP
app/api/track/             POST guarda eventos (valida contra lista blanca)
app/api/admin/export/      CSV de ambas tablas
lib/pricing.ts             ÚNICA fuente de verdad de precios (variantes A y B)
lib/product.ts             sabores, macros y los datos del hero
lib/nutrients.ts           los 26 nutrientes
lib/events.ts              lista blanca de los 11 eventos, compartida cliente/servidor
lib/attribution.ts         cookie de atribución: UTMs, click_id de anuncios, primera visita
```

Ocho bloques en la página, en este orden: hero con la oferta → los 3 pasos → el problema y la
tabla de costo → sabores → panel nutricional → comprar → banda anti-MLM → FAQ.

### Cómo se decide la variante de precio

El middleware corre antes que cualquier render, asigna 50/50, la guarda en una cookie
`HttpOnly` de 90 días y la reinyecta en el header de la petición actual. Por eso el HTML
del servidor ya sale con el precio correcto en la primera pintura — no hay parpadeo ni
riesgo de que un usuario vea dos precios distintos.

| SKU | Variante A | Variante B |
|---|---|---|
| Suscripción (30 porciones) | $1,990/mes | $2,390/mes |
| Bolsa (15 porciones) | $1,290 | $1,490 |
| Kit inicial (7 sobres) | $490 | $590 |
| Trío (45 porciones) | $3,290 | $3,890 |

Para cambiar cualquier precio se edita **sólo** `lib/pricing.ts`. El precio por porción se
calcula, y los labels de los botones y del correo se arman desde ahí.

### Cómo se mide quién entra y quién da clic

Cuatro capas, en orden de confiabilidad:

1. **Tabla `events` de primera parte** — la fuente de verdad. No la bloquea ningún adblocker
   porque el POST va a tu propio dominio.
2. **Vercel Web Analytics** — visitantes, páginas y fuentes, sin cookies. Se activa solo al
   deployar en Vercel (pestaña *Analytics* del proyecto). Cero configuración.
3. **Meta Pixel** — opcional. `InitiateCheckout` en el clic de compra, `Lead` en el registro.
   Sirve para optimizar campañas, no para contar.
4. **GA4** — opcional.

Entre bloqueadores y ATT, el pixel va a perder 20-40% de los eventos. Por eso las decisiones
se toman con la tabla, no con el pixel.

El cliente sólo manda `event_name` y `properties`. El servidor agrega desde la cookie el
`session_id`, la variante de precio, los UTM, el device, el `click_id` del anuncio
(`fbclid` / `gclid` / `ttclid` / `msclkid`) y si es visitante **nuevo o recurrente**. Nada de
eso se puede falsear desde el navegador ni depende de que cargue el pixel.

**Para que la atribución funcione**, tus anuncios tienen que llevar UTMs en el destino:

```
https://tudominio.mx/?utm_source=meta&utm_medium=paid&utm_campaign=panel&utm_content=creativo_1
```

`utm_content` es el que te dice **qué creativo** funciona. Meta agrega `fbclid` solo y el
sitio lo captura sin que hagas nada.

`purchase_intent_click` es el evento central y lleva `{ sku, tier, price_shown, position }`.
`position` distingue `hero` / `pricing_table` / `sticky_bar` / `footer` para saber qué
sección convierte.

`nutrient_panel_open` incluye `viewport`: en móvil lo dispara el botón "Ver los 26"; en
desktop, donde el panel ya viene abierto, lo dispara la visibilidad de la tabla. Sepáralos
al analizar.

`position: "sticky_bar"` cubre dos superficies, así que lleva además `ui`: `header` (el CTA
del header pegajoso en desktop) o `bottom_bar` (la barra inferior en móvil).

### Dashboard

`/admin?token=EL_TOKEN`. Sin login, sólo el token; server-side, la service key nunca sale.

- **Tres columnas** — total, variante A, variante B — con las tasas semaforizadas contra los
  umbrales de decisión (matar / iterar / adelante). Los de WTP están recalibrados al precio de
  la bolsa: matar <$800, iterar $800–1,100, adelante >$1,100.
- **Quién está entrando** — sesiones únicas por `utm_source`, `utm_campaign`, device, si vienen
  de un clic de anuncio, y nuevos vs recurrentes. Esto es tráfico, no registros.
- **Quién dio clic** — desglose por sabor y por posición del botón.
- **Quién dejó su correo** — registros por campaña, creativo y device.
- Profundidad de scroll y exportar CSV de las dos tablas.

**El costo por registro no sale de aquí**: ese número lo tienes que cruzar con el gasto real
en Meta.

---

## Reglas que el código sostiene a propósito

- Cero campos de tarjeta, cero integraciones de pago, cero mención de checkout.
- El modal dice que el producto no está a la venta **antes** de pedir el correo.
- Cero reseñas, testimonios, logos de prensa, conteos de clientes o contadores de inventario.
- Cero claims de pérdida de peso, curación, tratamiento o prevención.
- Producto etiquetado como "suplemento alimenticio", con la leyenda "Este producto no es un
  medicamento". Se usa "tu primera comida del día", nunca "sustituye una comida".
- Casilla de consentimiento **sin premarcar**, con enlace al aviso de privacidad. El servidor
  rechaza el registro si `consent !== true`.
- `/api/track` valida `event_name` contra lista blanca y sanitiza `properties` (sólo
  primitivos, tope de 12 llaves y 200 caracteres) antes de tocar `jsonb`.
- El precio guardado en `waitlist` se deriva de la cookie de variante en el servidor, no se
  acepta del cliente.
- `unique(email)`: un correo duplicado responde éxito y no manda un segundo correo.
- Modal con trampa de foco, cierre con Escape, `aria-modal`, y foco devuelto al botón que lo
  abrió. `prefers-reduced-motion` respetado.

## Pendientes antes de correr tráfico pagado

1. **Datos del responsable en el aviso de privacidad.** Están marcados con `TODO(legal)` en
   [app/aviso-de-privacidad/page.tsx](app/aviso-de-privacidad/page.tsx): razón social,
   domicilio fiscal y correo de privacidad. La LFPDPPP exige identificar al responsable.
2. **Dominio verificado en Resend** y `RESEND_FROM` con ese dominio, o los correos caen en spam.
3. **Permiso de publicidad de COFEPRIS.** El brief lo marca como riesgo abierto: verifícalo
   con abogado antes de gastar en creativos.
4. **Lighthouse en móvil.** El bundle de la landing es ~111 kB de JS de primera carga y no hay
   imágenes, pero mídelo contra el deploy real, no en local.
5. **Re-renderizar las tres imágenes a 2×** (≥1200 px de ancho). Es lo que más va a mover la
   percepción de calidad en pantallas retina.

## Deploy

```bash
npm i -g vercel        # el CLI no está instalado en esta máquina
vercel link
vercel env pull        # o configura las variables en el dashboard
vercel --prod
```

Supabase y Resend se pueden provisionar desde el Vercel Marketplace
(`vercel integration add supabase`, `vercel integration add resend`), lo que inyecta las
variables en el proyecto sin copiarlas a mano.
