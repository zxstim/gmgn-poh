import { ConnectButton } from "@rainbow-me/rainbowkit";
import SoulboundNFTMinter from "@/components/soulbound-nft-minter";

export default function Home() {
  return (
    <div className="flex flex-col gap-16 text-left">
      <ConnectButton />
      <div className="flex flex-col gap-2">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Proof Of Human</h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6">Mint Soulbound NFT</p>
      </div>
      <div className="flex flex-col gap-8">
        <SoulboundNFTMinter />
      </div>
    </div>
  );
}