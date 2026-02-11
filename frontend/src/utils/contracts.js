import { ethers } from "ethers";
import TokenArtifact from "./FaucetToken.json";
import FaucetArtifact from "./TokenFaucet.json";

const TokenABI = TokenArtifact.abi;
const FaucetABI = FaucetArtifact.abi;

export function getProvider() {
  return new ethers.BrowserProvider(window.ethereum);
}

export async function getSigner() {
  const provider = getProvider();
  return provider.getSigner();
}

export async function getTokenContract() {
  return new ethers.Contract(
    import.meta.env.VITE_TOKEN_ADDRESS,
    TokenABI,
    await getSigner()
  );
}

export async function getFaucetContract() {
  return new ethers.Contract(
    import.meta.env.VITE_FAUCET_ADDRESS,
    FaucetABI,
    await getSigner()
  );
}
