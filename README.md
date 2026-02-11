# ERC-20 Token Faucet DApp (Sepolia)

## Project Overview

This project is a simple ERC-20 Token Faucet DApp deployed on the **Sepolia test network**.
Users can connect their wallet, claim test tokens, and view balances.
All rules like cooldowns and limits are handled **on-chain**, making the faucet secure and trustless.

---

## Features (Simple)
- ERC-20 token with fixed supply
- Faucet gives a fixed number of tokens per claim
- 24-hour cooldown per wallet
- Maximum lifetime claim limit
- Admin can pause or unpause the faucet
- Clear error messages for failed actions
- MetaMask wallet support
- React-based frontend
- Dockerized frontend with health check

---

## Project Structure
### Smart Contracts
- FaucetToken.sol
  - ERC-20 token
  - Fixed supply
  - Only faucet can mint tokens
- TokenFaucet.sol
  - Handles token distribution
  - Enforces cooldown and limits
  - Allows admin pause/unpause

---

## Deployed Contracts (Sepolia)
- ERC-20 Token Contract
https://sepolia.etherscan.io/address/0xA7AAd90B683Fd541fAB952D1f3603621a2403AB8

- Faucet Contract
https://sepolia.etherscan.io/address/0x99EfeCf8D7CBEaB70897347DcA3FD8D8975C925C

Both contracts are verified on Etherscan.

---

## Evaluation Interface

The frontend exposes simple functions for testing:
```
window.__EVAL__ = {
  connectWallet(),
  requestTokens(),
  getBalance(address),
  canClaim(address),
  getRemainingAllowance(address),
  getContractAddresses()
}
```
- All values are returned as strings
- Errors are clearly shown

---

## Screenshots
Screenshots are available in the screenshots/ folder:
- Wallet connection
- Token balance
- Successful claim
- Cooldown error
- Transaction confirmation

---

## Testing
Smart contracts are tested using Hardhat.

Run tests using:
```
npx hardhat test
```

---

## Docker Setup

Run the frontend using Docker:
```
cp .env.example .env
docker compose up --build
```
- App runs at: http://localhost:3000
- Health check: http://localhost:3000/health

---

## Environment Variables

Create a `.env` file:
```
SEPOLIA_RPC_URL=
PRIVATE_KEY=
ETHERSCAN_API_KEY=
VITE_TOKEN_ADDRESS=
VITE_FAUCET_ADDRESS=
```
 Never upload real keys to GitHub.

---

## Security (Basic)
- Only faucet can mint tokens
- Admin-only controls
- Cooldowns and limits enforced on-chain
- Safe Solidity version (0.8+)

---

## Future Improvements
- Admin UI
- Support for more networks
- Better UI design
- Transaction history display