
# Token Faucet DApp

This repository contains a complete ERC-20 Token Faucet decentralized application developed using **Solidity, Hardhat, React (Vite), Ethers.js, Docker, and MetaMask**.  
The application enables users to connect their wallet and receive test tokens from a faucet deployed on the **Sepolia Ethereum test network**.  
All faucet restrictions such as cooldown periods and limits are enforced directly through smart contracts.

---

## Features

- Custom ERC-20 token contract
- Faucet distributes a predefined amount of tokens per request
- One claim allowed per wallet within a 24-hour window
- Total claim limit applied per address
- Admin-controlled pause and resume functionality
- Clear on-chain revert messages for invalid actions
- MetaMask wallet integration
- React-based user interface
- Frontend packaged and served using Docker
- Health endpoint available for verification

---

## Architecture Overview

User (Browser + MetaMask)  
→ React Frontend (Vite + Ethers.js)  
→ TokenFaucet Smart Contract (Sepolia)  
→ ERC-20 FaucetToken

---

## Smart Contracts

### FaucetToken
- Implements the ERC-20 standard
- Token minting is restricted to approved addresses
- Faucet contract is the only authorized minter
- Built using OpenZeppelin libraries for security

### TokenFaucet
- Provides token distribution functionality
- Tracks claim timestamps to enforce cooldowns
- Applies lifetime limits per wallet
- Admin can pause or unpause the faucet at any time

---

## Deployed Contracts (Sepolia)

| Contract Name | Address | Etherscan Link |
|--------------|---------|----------------|
| ERC-20 Token | `0xA7AAd90B683Fd541fAB952D1f3603621a2403AB8` | https://sepolia.etherscan.io/address/0xA7AAd90B683Fd541fAB952D1f3603621a2403AB8 |
| Token Faucet | `0x99EfeCf8D7CBEaB70897347DcA3FD8D8975C925C` | https://sepolia.etherscan.io/address/0x99EfeCf8D7CBEaB70897347DcA3FD8D8975C925C |

Both contracts are deployed and verified on Etherscan.

---

## Evaluation Interface

For evaluation purposes, the frontend exposes a set of helper functions:

```js
window.__EVAL__ = {
  connectWallet(),
  requestTokens(),
  getBalance(address),
  canClaim(address),
  getRemainingAllowance(address),
  getContractAddresses()
}
````

* All outputs are returned as string values
* Errors are surfaced clearly for debugging and validation

---

## Screenshots

Application screenshots are stored in the `screenshots/` directory and showcase:

* Wallet connection flow
* Display of token balance
* Successful token request
* Cooldown restriction message
* Transaction confirmation screen

---

## Testing

Smart contract logic is tested using **Hardhat**.

Execute tests using:

```bash
npx hardhat test
```

---

## Docker Setup

The frontend can be started using Docker:

```bash
docker compose up --build
```

Access points:

* Application: [http://localhost:3000](http://localhost:3000)
* Health endpoint: [http://localhost:3000/health](http://localhost:3000/health)

Expected health response:

```
OK
```

---

## Environment Configuration

Create a `.env` file with the following variables:

```env
SEPOLIA_RPC_URL=
PRIVATE_KEY=
ETHERSCAN_API_KEY=
VITE_TOKEN_ADDRESS=
VITE_FAUCET_ADDRESS=
```

Sensitive keys should never be committed to the repository.

---

## Security Considerations

* Token minting is restricted to the faucet contract
* Administrative actions are protected by access control
* Cooldown and claim limits are enforced on-chain
* Solidity version ^0.8.x ensures built-in overflow checks

---

## Possible Enhancements

* Dedicated admin dashboard
* Support for additional test networks
* Improved frontend design
* Display of claim history and transactions

---

## Summary

This project demonstrates a functional ERC-20 token faucet deployed on the Sepolia test network.
It combines smart contracts, automated tests, a frontend interface, and Docker support to provide a complete and evaluable Web3 application.



