interface PricingInputs {
  underlyingPrice: number;
  strike: number;
  volatility: number;
  riskFreeRate: number;
  timeToExpiry?: number; // Optional for perpetuals
}

// Modified Black-Derman-Toy for perpetual options
export const calculateOptionPrice = ({
  underlyingPrice,
  strike,
  volatility,
  riskFreeRate,
}: PricingInputs): { call: number; put: number } => {
  // Simplified perpetual option pricing model
  // Using a modified approach for options without expiry
  const sigma = volatility;
  const S = underlyingPrice;
  const K = strike;
  const r = riskFreeRate;

  // For perpetual options, we use a modified formula that doesn't depend on time
  const d1 = (Math.log(S / K) + (r + Math.pow(sigma, 2) / 2)) / sigma;
  const d2 = d1 - sigma;

  const callPrice = S * normalCDF(d1) - K * Math.exp(-r) * normalCDF(d2);
  const putPrice = K * Math.exp(-r) * normalCDF(-d2) - S * normalCDF(-d1);

  return {
    call: Math.max(0, callPrice),
    put: Math.max(0, putPrice)
  };
};

// Standard normal cumulative distribution function
const normalCDF = (x: number): number => {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const probability = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - probability : probability;
};

// Dynamic contract creation
export const createNewContract = (
  asset: string,
  currentPrice: number,
  strike: number,
  volatility: number = 0.3,
  riskFreeRate: number = 0.05
) => {
  const prices = calculateOptionPrice({
    underlyingPrice: currentPrice,
    strike,
    volatility,
    riskFreeRate,
  });

  return {
    asset,
    strike,
    call: prices.call,
    put: prices.put,
    timestamp: Date.now(),
  };
};