"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  type BaseError,
  useWaitForTransactionReceipt,
  useWriteContract,
  useAccount,
  useReadContracts,
} from "wagmi";
import { parseEther, formatEther, formatUnits, Address } from "viem";
import {
  Loader2,
  Check,
  Plus,
  Info,
  Trash2,
  ThumbsUp,
  CircleX,
} from "lucide-react";
import { SOULBOUND_NFT_ABI } from "./abis";
import {
  CONTRACT_ADDRESS_KAIROS_TESTNET,
  CONTRACT_ADDRESS_KAIA_MAINNET,
} from "./contracts";
import { useChainId } from "wagmi";
import { Label } from "@/components/ui/label"


type AirdropItem = {
  address: string;
  nftId: string;
};

export default function SoulboundNFTMinter() {
  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const chainId = useChainId();
  const [address, setAddress] = useState("");
  const [nftUri, setNftUri] = useState("");

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
  useWaitForTransactionReceipt({
    hash,
  });

  function handleAddressChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAddress(e.target.value);
  }

  function handleNftIdChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNftUri(e.target.value);
  }

  function executeMint() {
    writeContract({
      abi: SOULBOUND_NFT_ABI,
      address:
        chainId === 1001
          ? CONTRACT_ADDRESS_KAIROS_TESTNET
          : CONTRACT_ADDRESS_KAIA_MAINNET,
      functionName: "safeMint",
      args: [address as Address, nftUri],
    });
  }

  function truncateAddress(address: string) {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  }

  return (
    <div className="flex flex-col gap-8">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">Use the form below to mint Soulbound NFT</h2>
      <div className="flex flex-col gap-6">
        <div>
          <Label htmlFor="address">Mint address</Label>
          <Input
            id="address"
            placeholder="Enter an address"
            value={address}
            onChange={handleAddressChange}
          />
        </div>
        <div>
          <Label htmlFor="nftUri">Mint URI for NFT</Label>
          <Input
            id="nftUri"
            placeholder="Enter the NFT URI"
            value={nftUri}
            onChange={handleNftIdChange}
          />
        </div>
        {isPending ? (
          <Button className="w-[300px]" disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please confirm in your wallet
          </Button>
        ) : (
          <Button className="w-[300px]" onClick={executeMint}>
            Airdrop NFTs
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Transaction status
        </h2>
        {isConfirming && (
          <div className="flex flex-row gap-2 text-yellow-500 font-semibold text-lg">
            <Loader2 className="h-6 w-6 animate-spin" />
            Waiting for confirmation...
          </div>
        )}
        {isConfirmed && (
          <div className="flex flex-row gap-2 text-green-500 font-semibold text-lg">
            <Check className="h-6 w-6" />
            Transaction confirmed!
          </div>
        )}
        {
          // if there is an error, show the error message
          error && (
            <div>
              Transaction reverted:{" "}
              {(error as BaseError).shortMessage.split(":")[1]}
            </div>
          )
        }
        {hash ? (
          <div className="flex flex-row gap-2">
            Transaction hash:
            <a
              target="_blank"
              className="text-blue-500 underline"
              href={
                chainId === 1001
                  ? `https://baobab.klaytnfinder.io/tx/${hash}`
                  : `https://klaytnfinder.io/tx/${hash}`
              }
            >
              {truncateAddress(hash)}
            </a>
          </div>
        ) : (
          <>
            <div className="flex flex-row gap-2">Nothing yet :)</div>
          </>
        )}
      </div>
    </div>
  );
}
