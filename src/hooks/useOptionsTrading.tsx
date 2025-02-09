import { useState, useEffect } from 'react';
import { addOrder, getOrderBook, matchOrders } from '@/utils/orderBook';
import { getPrice, updatePrice } from '@/utils/priceFeeds';
import { calculateOptionPrice, createNewContract } from '@/utils/pricingModel';
import { settleContract, exerciseOption } from '@/utils/contractSettlement';
import { useToast } from "@/components/ui/use-toast";

interface OptionPosition {
  contractId: string;
  asset: string;
  strike: number;
  optionType: 'call' | 'put';
  side: 'buy' | 'sell';
  price: number;
  size: number;
}

export const useOptionsTrading = (asset: string) => {
  const [positions, setPositions] = useState<OptionPosition[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const { toast } = useToast();

  // Subscribe to price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const priceFeed = getPrice(asset);
      if (priceFeed) {
        setCurrentPrice(priceFeed.price);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [asset]);

  const createPosition = async (
    strike: number,
    optionType: 'call' | 'put',
    side: 'buy' | 'sell',
    size: number
  ) => {
    try {
      // Create new contract
      const contract = createNewContract(
        asset,
        currentPrice,
        strike,
        0.3, // Default volatility
        0.05  // Default risk-free rate
      );

      // Add order to the book
      const order = addOrder({
        price: optionType === 'call' ? contract.call : contract.put,
        size,
        side,
        asset,
        optionType,
        strike,
      });

      // Match orders if possible
      const orderBookId = `${asset}-${strike}-${optionType}`;
      matchOrders(orderBookId);

      // Add to positions
      const newPosition: OptionPosition = {
        contractId: order.id,
        asset,
        strike,
        optionType,
        side,
        price: order.price,
        size: order.size,
      };

      setPositions(prev => [...prev, newPosition]);

      toast({
        title: "Position Created",
        description: `Successfully created ${side} position for ${asset} ${optionType} @ ${strike}`,
      });

      return newPosition;
    } catch (error) {
      console.error('Error creating position:', error);
      toast({
        title: "Error",
        description: "Failed to create position",
        variant: "destructive",
      });
      return null;
    }
  };

  const settlePosition = async (position: OptionPosition) => {
    try {
      const result = settleContract(
        position.contractId,
        currentPrice,
        position.strike,
        position.optionType,
        position.side,
        position.price
      );

      if (result.status === 'success') {
        setPositions(prev => prev.filter(p => p.contractId !== position.contractId));
        
        toast({
          title: "Position Settled",
          description: `PnL: ${result.pnl.toFixed(2)}`,
        });
      }

      return result;
    } catch (error) {
      console.error('Error settling position:', error);
      toast({
        title: "Error",
        description: "Failed to settle position",
        variant: "destructive",
      });
      return null;
    }
  };

  const exercisePosition = async (position: OptionPosition) => {
    try {
      const result = exerciseOption(
        position.contractId,
        currentPrice,
        position.strike,
        position.optionType
      );

      if (result.status === 'success') {
        setPositions(prev => prev.filter(p => p.contractId !== position.contractId));
        
        toast({
          title: "Option Exercised",
          description: `Value: ${result.pnl.toFixed(2)}`,
        });
      }

      return result;
    } catch (error) {
      console.error('Error exercising option:', error);
      toast({
        title: "Error",
        description: "Failed to exercise option",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    positions,
    currentPrice,
    createPosition,
    settlePosition,
    exercisePosition,
  };
};