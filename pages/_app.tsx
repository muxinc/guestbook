import Head from "next/head";

import "../styles/globals.css";
import Store from "contexts/Store";

import type { AppProps } from "next/app";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          rel="preload"
          href="/fonts/lineto-akkuratmono-regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="true"
        />
      </Head>
      <Store>
        <Component {...pageProps} />
      </Store>
    </>
  );
}

export default App;
