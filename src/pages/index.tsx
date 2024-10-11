import CustomConnectButton from "@/components/CustomConnectButton";
import MainPanel from "@/components/MainPanel";
import Head from "next/head";
import Image from "next/image";



export default function Home() {
  return (
    <>
      <Head>
        <title>Web3Communities</title>
        <meta name="description" content="A gated web3 community" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
         <CustomConnectButton/>
         <MainPanel />
      </div>

    </>
  );
}
