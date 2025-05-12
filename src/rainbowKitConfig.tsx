"use client"
import {getDefaultConfig} from '@rainbow-me/rainbowkit';
import{anvil, zksync, sepolia} from "wagmi/chains";
export default  getDefaultConfig({
    appName: 'Token_Sender',
    projectId: 'process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!',
    chains: [anvil,sepolia, zksync],
    ssr:false
})