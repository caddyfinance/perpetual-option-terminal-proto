interface SettlementResult {
  pnl: number;
  settlementPrice: number;
  status: 'success' | 'failed';
  message: string;
}

export const settleContract = (
  contractId: string,
  currentPrice: number,
  strike: number,
  optionType: 'call' | 'put',
  side: 'buy' | 'sell',
  entryPrice: number
): SettlementResult => {
  let pnl = 0;
  let settlementPrice = currentPrice;

  if (optionType === 'call') {
    if (side === 'buy') {
      pnl = Math.max(0, currentPrice - strike) - entryPrice;
    } else {
      pnl = entryPrice - Math.max(0, currentPrice - strike);
    }
  } else {
    if (side === 'buy') {
      pnl = Math.max(0, strike - currentPrice) - entryPrice;
    } else {
      pnl = entryPrice - Math.max(0, strike - currentPrice);
    }
  }

  return {
    pnl,
    settlementPrice,
    status: 'success',
    message: `Contract settled successfully. PnL: ${pnl.toFixed(2)}`,
  };
};

export const exerciseOption = (
  contractId: string,
  currentPrice: number,
  strike: number,
  optionType: 'call' | 'put'
): SettlementResult => {
  const intrinsicValue = optionType === 'call' 
    ? Math.max(0, currentPrice - strike)
    : Math.max(0, strike - currentPrice);

  return {
    pnl: intrinsicValue,
    settlementPrice: currentPrice,
    status: 'success',
    message: `Option exercised successfully. Intrinsic value: ${intrinsicValue.toFixed(2)}`,
  };
};