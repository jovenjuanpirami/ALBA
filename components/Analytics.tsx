import Script from "next/script";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";

/**
 * Cuatro capas de medición:
 *  1. tabla `events` de primera parte — la fuente de verdad
 *  2. Vercel Web Analytics — visitantes y fuentes, sin cookies, cero config
 *  3. Meta Pixel — opcional, para optimizar campañas
 *  4. GA4 — opcional
 * Si falta un ID, esa capa simplemente no se inyecta.
 */
export function Analytics() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID;

  return (
    <>
      <VercelAnalytics />
      {pixelId ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${pixelId}');fbq('track','PageView');`}
        </Script>
      ) : null}

      {ga4Id ? (
        <>
          <Script
            id="ga4-src"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
window.gtag=gtag;
gtag('js', new Date());
gtag('config','${ga4Id}');`}
          </Script>
        </>
      ) : null}
    </>
  );
}
