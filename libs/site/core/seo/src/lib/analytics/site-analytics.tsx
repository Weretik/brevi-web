import Script from 'next/script';

import { analyticsId, tagManagerId } from '../metadata/site-codes';

type Props = { googleAnalyticsId: string | null; googleTagManagerId: string | null };

/**
 * Google Analytics 4 and Google Tag Manager with the ids of «Налаштування SEO сайту». Nothing is rendered for
 * an empty id or one of another shape. Scripts load after the page becomes interactive.
 */
export function SiteAnalytics(props: Props) {
  const ga = analyticsId(props.googleAnalyticsId);
  const gtm = tagManagerId(props.googleTagManagerId);
  return (
    <>
      {gtm && (
        <>
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`}
          </Script>
          <noscript>
            <iframe
              title="Google Tag Manager"
              src={`https://www.googletagmanager.com/ns.html?id=${gtm}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        </>
      )}
      {ga && (
        <>
          <Script
            id="ga4-loader"
            src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga}');`}
          </Script>
        </>
      )}
    </>
  );
}
