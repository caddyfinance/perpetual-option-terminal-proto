# LSD Options Trading Platform

## Project Overview

Decentralized options trading platform for Liquid Staking Derivatives (LSDs) assets. Features include:
- Create & trade LSD options contracts
- Risk management tools
- Real-time pricing feeds
- Portfolio management

## Development Setup

### Requirements
- Node.js 18+
- npm 9+

### Installation
```sh
git clone <YOUR_REPO_URL>
cd lsd-options-platform
npm install
npm run dev
```

### Key Technologies
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Hardhat (Smart Contracts)
- Wagmi/viem (Blockchain interactions)

## Deployment

### Smart Contracts
```sh
npx hardhat compile
npx hardhat deploy --network <network_name>
```

### Frontend
```sh
npm run build
# Deploy dist/ folder to your preferred hosting provider
```

## Contributing
1. Create feature branch
2. Commit changes
3. Open pull request
4. Code review
5. Merge to main
