"use client"
import{QueryClient,QueryClientProvider} from "@tanstack/react-query"; 
import config from "../rainbowKitConfig";



import{type ReactNode} from "react";

import{WagmiProvider}  from "wagmi";
import { RainbowKitProvider,ConnectButton } from "@rainbow-me/rainbowkit";
import{useState,useEffect} from "react";
import "@rainbow-me/rainbowkit/styles.css";

export default function Provider({children}:{children:ReactNode}) {
    const [queryclient] = useState(() => new QueryClient());
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryclient}>
                
            <RainbowKitProvider>
               

                {children}
            </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}