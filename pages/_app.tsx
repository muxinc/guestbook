import Head from "next/head";

import "styles/globals.css";
import GlobalStore from "contexts/GlobalStore";

import type { AppProps } from "next/app";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          rel="preload"
          href="/fonts/Aeonik-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="true"
        />
      </Head>
      <GlobalStore>
        <Component {...pageProps} />
      </GlobalStore>
    </>
  );
}

export default App;
