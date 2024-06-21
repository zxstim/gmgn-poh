"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  type BaseError,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { Address } from "viem";
import { Loader2, Check, ScanLine, Trash2, ThumbsUp, Hourglass } from "lucide-react";
import { SOULBOUND_NFT_ABI } from "./abis";
import {
  CONTRACT_ADDRESS_KAIROS_TESTNET,
  CONTRACT_ADDRESS_KAIA_MAINNET,
} from "./contracts";
import { useChainId } from "wagmi";
import { Label } from "@/components/ui/label";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function SoulboundNFTMinter() {
  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const chainId = useChainId();
  const [address, setAddress] = useState("");
  const [nftUri, setNftUri] = useState("");
  const NFT_URI =
    "https://copper-realistic-flamingo-211.mypinata.cloud/ipfs/QmZac2Mv8jH6qR211FHZGubPLtVZXwiGZwpf28Ss7Ha5gq";
  const NFT_METADATA =
    "https://copper-realistic-flamingo-211.mypinata.cloud/ipfs/QmYqGFr2yzRjrYCw8inDHhxW3k1o3wHRM4pLrWba9pkUeq";
  const [qrScanSuccess, setQrScanSuccess] = useState(false);

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

  function handleUsePresetOne() {
    if (nftUri !== NFT_URI) {
      setNftUri(NFT_URI);
    }
    if (nftUri === NFT_URI) {
      setNftUri("");
    }
  }

  function handleUsePresetTwo() {
    if (nftUri !== NFT_METADATA) {
      setNftUri(NFT_METADATA);
    }
    if (nftUri === NFT_METADATA) {
      setNftUri("");
    }
  }

  function handleClearNftUri() {
    setNftUri("");
  }

  function handleQrScan(data: string) {
    if (data.includes(":")) {
      const splitData = data.split(":");
      setAddress(splitData[1]);
      setQrScanSuccess(true);
      // delay the success message for 2 seconds
      setTimeout(() => {
        setQrScanSuccess(false);
      }, 5000);
    } else {
      setAddress(data);
      setQrScanSuccess(true);
      // delay the success message for 2 seconds
      setTimeout(() => {
        setQrScanSuccess(false);
      }, 5000);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Use the form below to mint Soulbound NFT
      </h2>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <Label htmlFor="address">Mint address</Label>
          <div className="flex flex-row gap-4">
            <Input
              id="address"
              placeholder="Enter an address"
              value={address}
              onChange={handleAddressChange}
            />
            <Dialog>
              <DialogTrigger>
                <ScanLine className="w-6 h-6" />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>QR Scanner</DialogTitle>
                  <DialogDescription>
                    Scan the QR code to autofill the mint address
                  </DialogDescription>
                </DialogHeader>
                <Scanner
                  onScan={(result) => handleQrScan(result[0].rawValue)}
                />
                <DialogFooter>
                  <div className="flex flex-col items-center justify-center">
                    {qrScanSuccess ? (
                      <p className="flex flex-row gap-2 text-blue-600">
                        <ThumbsUp className="h-6 w-6" />
                        Scan completed
                      </p>
                    ) : (
                      <p className="flex flex-row gap-2 text-yellow-600">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        Scanning...
                      </p>
                    )}
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="nftId">Mint NFT ID</Label>
            <Input
              id="nftId"
              placeholder="Enter the NFT ID"
              value={nftUri}
              onChange={handleNftIdChange}
            />
          </div>
          <div className="flex flex-row gap-2">
            <Button
              className="w-fit"
              variant="outline"
              onClick={handleUsePresetOne}
            >
              Preset 1
            </Button>
            <Button
              className="w-fit"
              variant="outline"
              onClick={handleUsePresetTwo}
            >
              Preset 2
            </Button>
            <Button variant="outline" size="icon" onClick={handleClearNftUri}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
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
