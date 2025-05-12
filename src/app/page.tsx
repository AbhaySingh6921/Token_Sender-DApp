"use client";
import HomeContent from"@/components/HomeContent";
import{useAccount} from"wagmi";


export default function Home() {
  const {isConnected} =useAccount();
  return (
    <div>
      {isConnected ?(
         <div>
          <HomeContent/>
           </div>
      ):(
        <div className="flex flex-col items-center justify-center min-h-screen text-5xl font-extrabold text-center mb-6">
          plz connect to the wallet..........
          </div>
      )} 
    </div>
  );
}
