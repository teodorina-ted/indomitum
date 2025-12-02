// pages/_document.js (V1 - Updated: 2025-07-29)
import { Html, Head, Main, NextScript } from 'next/document';

export default function MyDocument() {
  return (
    <Html lang="en">
      <Head>
        {/* DO NOT put <title> or <meta name="description"> here. */}
        {/* These should be in pages/_app.js or individual pages using next/head. */}
        {/* This Head is for elements like <link> tags for fonts, favicons, etc. that are needed for initial server rendering. */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
