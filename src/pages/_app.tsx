import type { AppProps } from "next/app";
import { useRegisterServiceWorker } from "../modules/serviceWorkerHooks";

const MyApp = ({ Component, pageProps }: AppProps) => {
  useRegisterServiceWorker();

  return <Component {...pageProps} />;
};

export default MyApp;
