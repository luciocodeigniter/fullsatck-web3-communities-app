import type { AppProps } from "next/app";
import RainbowKitUIProvider from "@/providers/RainbowKit";

export default function App({ Component, pageProps }: AppProps) {
  return <RainbowKitUIProvider><Component {...pageProps} /></RainbowKitUIProvider>
}
