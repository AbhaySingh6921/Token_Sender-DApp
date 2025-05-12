"use client";
import InputField from "@/components/ui/InputField";
import { useState, useMemo,useEffect } from "react";
import { chainsToTSender, tsenderAbi, erc20Abi } from "@/constants";
import { useChainId, useConfig, useAccount, useWriteContract } from "wagmi";
import { readContract, writeContract, waitForTransactionReceipt } from "wagmi/actions";
import { calculateTotal } from "@/utils/calculateTotal/calculateTotal";

export default function AirDropForm() {
    const [tokenAddress, setTokenAddress] = useState<string>("");
    const [recipients, setRecipients] = useState<string>("");
    const [amounts, setAmount] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);//for spinner in send token
    const chainId = useChainId();
    const config = useConfig();
    const account = useAccount();

    const[tokenDetails,setTokenDetails]=useState({
        name:"",
        symbol:"",
        decimals:18
    });

    const { data: hash, writeContractAsync } = useWriteContract();

    const total: number = useMemo(() => calculateTotal(amounts), [amounts]);

     // ============ NEW EFFECT TO FETCH TOKEN DETAILS ============
    /**
     * Fetches token details (name, symbol, decimals) when tokenAddress changes
     */
    useEffect(() => {
        if (tokenAddress) {
            const fetchTokenDetails = async () => {
                try {
                    // Fetch all token details in parallel
                    const [name, symbol, decimals] = await Promise.all([
                        readContract(config, {
                            abi: erc20Abi,
                            address: tokenAddress as `0x${string}`,
                            functionName: "name",
                        }),
                        readContract(config, {
                            abi: erc20Abi,
                            address: tokenAddress as `0x${string}`,
                            functionName: "symbol",
                        }),
                        readContract(config, {
                            abi: erc20Abi,
                            address: tokenAddress as `0x${string}`,
                            functionName: "decimals",
                        }),
                    ]);
                    setTokenDetails({
                        name: name as string,
                        symbol: symbol as string,
                        decimals: Number(decimals)
                    });
                } catch (error) {
                    console.error("Error fetching token details:", error);
                    // Set default values if fetch fails
                    setTokenDetails({
                        name: "Unknown Token",
                        symbol: "UNKNOWN",
                        decimals: 18
                    });
                }
            };
            fetchTokenDetails();
        }
    }, [tokenAddress, config]);

     // ============ NEW CALCULATION FOR TOKEN AMOUNT ============
    /**
     * Calculates the human-readable token amount based on decimals
     */
    const tokenAmount = useMemo(() => {
        if (!tokenDetails.decimals || !amounts) return "0";
        const totalWei = calculateTotal(amounts);
        return (totalWei / Math.pow(10, tokenDetails.decimals)).toFixed(tokenDetails.decimals);
    }, [amounts, tokenDetails.decimals]);
    // ==========================================================


    async function getApprovalAmount(tsenderAddress: string | null): Promise<string> {
        if (!tsenderAddress) {
            alert("no address found, use different chain");
            return "0";
        }
        const response = await readContract(config, {
            abi: erc20Abi,
            address: tokenAddress as `0x${string}`,
            functionName: "allowance",
            args: [account.address, tsenderAddress as `0x${string}`]
        });
        return (response as bigint).toString();
    }

    const HandleSummit = async function () {
        setIsLoading(true);
        try {
            const tsenderAddress = chainsToTSender[chainId]["tsender"];
            const approvedAmount = await getApprovalAmount(tsenderAddress);

            if (Number(approvedAmount) < total) {
                const approveHash = await writeContractAsync({
                    abi: erc20Abi,
                    address: tokenAddress as `0x${string}`,
                    functionName: "approve",
                    args: [tsenderAddress as `0x${string}`, BigInt(total)],
                });
                const approvalReceipt = await waitForTransactionReceipt(config, {
                    hash: approveHash,
                });
                console.log("approval confirmed", approvalReceipt);
            }

            await writeContractAsync({
                abi: tsenderAbi,
                address: tsenderAddress as `0x${string}`,
                functionName: "airdropERC20",
                args: [
                    tokenAddress as `0x${string}`,
                    recipients.split(",").map((recipient) => recipient as `0x${string}`),
                    amounts.split(",").map((amount) => BigInt(amount)),
                    BigInt(total),
                ],
            });
        } catch (error) {
            console.error("Transaction failed:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <InputField
                label="Token Address"
                placeholder="0x"
                value={tokenAddress}
                onChange={setTokenAddress}
            />
            <InputField
                label="Recipients"
                placeholder="0x78,0x76,0x75"
                value={recipients}
                onChange={setRecipients}
                large={true}
            />
            <InputField
                label="amount"
                placeholder="10,100,1000"
                value={amounts}
                onChange={setAmount}
                large={true}
            />
            

             {/* ============ NEW TOKEN DETAILS BOX ============ */}
            {tokenAddress && (
    <div className="mt-6 p-4 border-3 border-gray-200 rounded-lg bg-gray-250">
        <h4 className="text-lg text-black font-medium mb-4">Transaction Details</h4>
        <div className="space-y-2">
            <div className="flex justify-between">
                <span className="text-gray-600">Token Name:</span>
                <span className="font-medium text-black">{tokenDetails.name}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-600">Amount (wei):</span>
                <span className="font-mono font-medium text-black">
                    {new Intl.NumberFormat().format(total)}
                </span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-600">Amount (tokens):</span>
                <span className="font-mono font-medium text-black">
                    {new Intl.NumberFormat(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: tokenDetails.decimals
                    }).format(Number(tokenAmount))}
                </span>
            </div>
        </div>
    </div>
)}
            {/* =============================================== */}
            <button
                onClick={HandleSummit}
                disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white font-semibold rounded-2xl shadow-lg
            border-2 border-gray-600
            hover:bg-gradient-to-br hover:from-gray-700 hover:via-gray-800 hover:to-gray-900
            hover:shadow-xl hover:border-gray-500
            active:scale-[0.98] active:shadow-inner
            transform-gpu transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
            flex items-center justify-center
            group relative overflow-hidden"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        sending token...
                    </>
                ) : (
                    "Send Token"
                )}
            </button>
        </div>
    )
}