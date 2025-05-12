"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { FaGithub } from "react-icons/fa"
import Image from "next/image"

export default function Header() {
    return (
        <nav className="px-8 py-4.5 border-b-[1px] border-zinc-100 flex flex-row justify-between items-center bg-slate-400 xl:min-h-[77px]">
            <div className="flex items-center gap-2.5 md:gap-6">
               
                    <img src="https://th.bing.com/th/id/OIP.LAKXlrEZpn6GeZAUbPd8bwHaHa?pid=ImgDet&w=178&h=178&c=7&dpr=1.5" alt="TSender" width={36} height={36}  />
                    <h1 className="font-bold text-2xl hidden md:block text-black">TSender</h1>
                
                <a
                    href="https://github.com/AbhaySingh6921/Token_Sender-DApp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors border-2 border-zinc-600 hover:border-zinc-500 cursor-alias hidden md:block"
                >
                    <FaGithub className="h-5 w-5 text-white" />
                </a>
            </div>
            <h3 className="italic text-left hidden md:block text-black">
                The most gas efficient airdrop contract on earth, built in huff 🐎
            </h3>
            <div className="flex items-center gap-4 ">
                <ConnectButton />
            </div>
        </nav>
    )
}