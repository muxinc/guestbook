import "../styles/globals.css";
import Store from "contexts/Store";

import type { AppProps } from "next/app";

function App({ Component, pageProps }: AppProps) {
  return (
    <Store>
      <Component {...pageProps} />
    </Store>
  );
}

export default App;
