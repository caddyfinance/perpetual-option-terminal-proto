interface Order {
  id: string;
  price: number;
  size: number;
  side: 'buy' | 'sell';
  timestamp: number;
  asset: string;
  optionType: 'call' | 'put';
  strike: number;
}

interface OrderBook {
  bids: Order[];
  asks: Order[];
}

const orderBooks: Map<string, OrderBook> = new Map();

export const createOrderBookId = (asset: string, strike: number, optionType: 'call' | 'put'): string => {
  return `${asset}-${strike}-${optionType}`;
};

export const addOrder = (order: Omit<Order, 'id' | 'timestamp'>): Order => {
  const orderBookId = createOrderBookId(order.asset, order.strike, order.optionType);
  const orderBook = orderBooks.get(orderBookId) || { bids: [], asks: [] };
  
  const newOrder: Order = {
    ...order,
    id: Math.random().toString(36).substring(7),
    timestamp: Date.now(),
  };

  if (order.side === 'buy') {
    orderBook.bids.push(newOrder);
    orderBook.bids.sort((a, b) => b.price - a.price);
  } else {
    orderBook.asks.push(newOrder);
    orderBook.asks.sort((a, b) => a.price - b.price);
  }

  orderBooks.set(orderBookId, orderBook);
  return newOrder;
};

export const getOrderBook = (asset: string, strike: number, optionType: 'call' | 'put'): OrderBook => {
  const orderBookId = createOrderBookId(asset, strike, optionType);
  return orderBooks.get(orderBookId) || { bids: [], asks: [] };
};

export const matchOrders = (orderBookId: string): void => {
  const orderBook = orderBooks.get(orderBookId);
  if (!orderBook) return;

  while (orderBook.bids.length > 0 && orderBook.asks.length > 0) {
    const topBid = orderBook.bids[0];
    const topAsk = orderBook.asks[0];

    if (topBid.price >= topAsk.price) {
      const matchSize = Math.min(topBid.size, topAsk.size);
      topBid.size -= matchSize;
      topAsk.size -= matchSize;

      if (topBid.size === 0) orderBook.bids.shift();
      if (topAsk.size === 0) orderBook.asks.shift();
    } else {
      break;
    }
  }
};