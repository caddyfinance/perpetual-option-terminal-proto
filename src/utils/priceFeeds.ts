interface PriceFeed {
  price: number;
  timestamp: number;
  change24h: number;
  volume24h: number;
}

const priceFeeds: Map<string, PriceFeed> = new Map();

// Initialize with some base prices
priceFeeds.set('stETH', {
  price: 2500,
  timestamp: Date.now(),
  change24h: 0,
  volume24h: 1000000
});

priceFeeds.set('xSTRK', {
  price: 15,
  timestamp: Date.now(),
  change24h: 0,
  volume24h: 500000
});

export const updatePrice = (asset: string, newPrice: number) => {
  const currentFeed = priceFeeds.get(asset);
  if (!currentFeed) return;

  const oldPrice = currentFeed.price;
  const change24h = ((newPrice - oldPrice) / oldPrice) * 100;

  priceFeeds.set(asset, {
    price: newPrice,
    timestamp: Date.now(),
    change24h,
    volume24h: currentFeed.volume24h * (1 + (Math.random() - 0.5) * 0.1) // Simulate volume changes
  });
};

export const getPrice = (asset: string): PriceFeed | undefined => {
  return priceFeeds.get(asset);
};

// Simulate price updates
setInterval(() => {
  priceFeeds.forEach((feed, asset) => {
    const randomChange = (Math.random() - 0.5) * 0.02; // ±1% price change
    const newPrice = feed.price * (1 + randomChange);
    updatePrice(asset, newPrice);
  });
}, 5000); // Update every 5 seconds