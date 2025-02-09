// Mock price feed with price fluctuation simulation
const mockPrices: Record<string, number> = {
  stETH: 2500,
  rETH: 2550,
  cbETH: 2480,
  ankrETH: 2490,
};

let priceMultiplier = 1;

// Simulate price fluctuations
setInterval(() => {
  priceMultiplier = 1 + (Math.random() * 0.1 - 0.05); // ±5% fluctuation
}, 5000); // Update every 5 seconds

export const getCurrentPrice = (asset: string): number => {
  const basePrice = mockPrices[asset] || 0;
  return basePrice * priceMultiplier;
};

export const calculateYields = (
  stakedAmount: number,
  currentPrice: number,
  apy: number
) => {
  const annualYieldUSD = stakedAmount * currentPrice * (apy / 100);
  const annualYieldETH = stakedAmount * (apy / 100);
  
  return {
    yieldUSD: `$${annualYieldUSD.toFixed(2)}`,
    yieldETH: `${annualYieldETH.toFixed(3)} ETH`,
  };
};