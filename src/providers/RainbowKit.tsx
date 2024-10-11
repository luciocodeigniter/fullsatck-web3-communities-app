import React from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import {getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {arbitrum, base, Chain, localhost, hardhat } from 'wagmi/chains';
import {  QueryClientProvider, QueryClient } from "@tanstack/react-query";

export const localChain = {
    // pego todas as configurações de 'localhost'
    // e sobrescrevo o `id`
    ...localhost,
    id: 31337 // id da blockchain local do hardhat
} as const satisfies Chain

const config = getDefaultConfig({
    appName: 'Web3Community',
    projectId: '79b2d0d985468b4bd947e60bef28e30d', //! aqui devo colocar o `projectId` gerado em: https://cloud.walletconnect.com/
    chains: [arbitrum, base, localChain],
    ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

// o que está acontecendo aqui?
type RainbowKitProps = {
    children: React.ReactNode
}


export default function RainbowKitUIProvider({ children }: RainbowKitProps) {

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}