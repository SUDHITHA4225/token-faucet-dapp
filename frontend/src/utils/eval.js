import { connectWallet } from "./wallet";
import { getTokenContract, getFaucetContract } from "./contracts";

window.__EVAL__ = {
  connectWallet: async () => {
    return await connectWallet();
  },

  requestTokens: async () => {
    const faucet = await getFaucetContract();
    const tx = await faucet.requestTokens();
    await tx.wait();
    return tx.hash;
  },

  getBalance: async (address) => {
    const token = await getTokenContract();
    const bal = await token.balanceOf(address);
    return bal.toString();
  },

  canClaim: async (address) => {
    const faucet = await getFaucetContract();
    return await faucet.canClaim(address);
  },

  getRemainingAllowance: async (address) => {
    const faucet = await getFaucetContract();
    const remaining = await faucet.remainingAllowance(address);
    return remaining.toString();
  },

  getContractAddresses: async () => {
    return {
      token: import.meta.env.VITE_TOKEN_ADDRESS,
      faucet: import.meta.env.VITE_FAUCET_ADDRESS,
    };
  },
};
