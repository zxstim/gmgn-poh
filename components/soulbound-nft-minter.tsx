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
import { CONTRACT_ADDRESS_KAIA_MAINNET } from "./contracts";
import { useChainId } from "wagmi";

type AirdropItem = {
  address: string;
  nftId: string;
};

export default function SoulboundNFTMinter() {
  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const [address, setAddress] = useState("");
  const [nftUri, setNftUri] = useState("");

  function handleAddressChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAddress(e.target.value);
  }

  function handleNftIdChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNftUri(e.target.value);
  }

  return (
    <div>
      <h2>Fill out this form</h2>
      <div className="flex flex-col gap-4">
        <Input
          placeholder="Enter an address"
          value={address}
          onChange={handleAddressChange}
        />
        <Input
          placeholder="Enter the NFT URI"
          value={nftUri}
          onChange={handleNftIdChange}
        />
      </div>
    </div>
  );
}
