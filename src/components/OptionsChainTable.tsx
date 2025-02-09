import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo, useEffect } from "react";
import { useOptionsTrading } from "@/hooks/useOptionsTrading";
import { useSearchParams } from "react-router-dom";

interface OptionChainRow {
  strike: number;
  timeFrame: string;
  subTimeFrame: string;
  year: string;
  calls: {
    oi: string;
    ltpChg: number;
    ltp: number;
  };
  puts: {
    oi: string;
    ltpChg: number;
    ltp: number;
  };
}

interface OptionsChainTableProps {
  timeFrame: string;
  subTimeFrame: string;
  selectedYear: string;
}

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "buy" | "sell";
  optionType: "call" | "put";
  price: number;
  strike: number;
  asset: string;
  timeFrame: string;
  subTimeFrame: string;
  selectedYear: string;
}

const usePortfolioAssets = () => {
  const [assets, setAssets] = useState<Array<{value: string, label: string}>>([
    { value: "stETH", label: "Lido stETH" },
    { value: "rETH", label: "Rocket Pool rETH" },
    { value: "cbETH", label: "Coinbase cbETH" },
    { value: "ankrETH", label: "Ankr ankrETH" },
    { value: "xSTRK", label: "Strike xSTRK" },
  ]);

  // This effect simulates loading portfolio assets
  // In a real app, this would fetch from your backend/state management
  useEffect(() => {
    const storedAssets = localStorage.getItem('portfolioAssets');
    if (storedAssets) {
      setAssets(JSON.parse(storedAssets));
    }
  }, []);

  return assets;
};

export const OptionsChainTable = ({ timeFrame, subTimeFrame, selectedYear }: OptionsChainTableProps) => {
  const [searchParams] = useSearchParams();
  const assetFromParams = searchParams.get('asset');
  const portfolioAssets = usePortfolioAssets();
  const [selectedAsset, setSelectedAsset] = useState(assetFromParams || "xSTRK");
  const [tradeModal, setTradeModal] = useState<{
    isOpen: boolean;
    type: "buy" | "sell";
    optionType: "call" | "put";
    price: number;
    strike: number;
  } | null>(null);

  const filteredOptionsData = useMemo(() => {
    const baseData = selectedAsset === "stETH" ? stethOptionsData : xstrkOptionsData;
    
    // If no time frame is selected, return all data
    if (!timeFrame) return baseData;

    // Filter based on time frame and sub time frame
    return baseData.filter(option => {
      // For previous years contracts
      if (timeFrame === "previous") {
        return option.timeFrame === "previous" && 
               (subTimeFrame ? option.subTimeFrame === subTimeFrame : true) && 
               (selectedYear ? option.year === selectedYear : true);
      }
      
      // For current year contracts (week, month, year)
      return option.timeFrame === timeFrame && 
             (subTimeFrame ? option.subTimeFrame === subTimeFrame : true) &&
             option.year === new Date().getFullYear().toString();
    });
  }, [selectedAsset, timeFrame, subTimeFrame, selectedYear]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-xl font-semibold">Asset</h2>
        <Select value={selectedAsset} onValueChange={setSelectedAsset}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select asset" />
          </SelectTrigger>
          <SelectContent>
            {portfolioAssets.map((asset) => (
              <SelectItem key={asset.value} value={asset.value}>
                {asset.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center font-medium text-gray-600">Call</TableHead>
              <TableHead className="text-right font-medium text-gray-600">OI</TableHead>
              <TableHead className="text-right font-medium text-gray-600">LTP Chg%</TableHead>
              <TableHead className="text-right font-medium text-gray-600">LTP</TableHead>
              <TableHead className="text-center font-medium text-gray-600">Strike</TableHead>
              <TableHead className="text-right font-medium text-gray-600">LTP</TableHead>
              <TableHead className="text-right font-medium text-gray-600">LTP Chg%</TableHead>
              <TableHead className="text-right font-medium text-gray-600">OI</TableHead>
              <TableHead className="text-center font-medium text-gray-600">Put</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOptionsData.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="text-center">
                  <div className="flex gap-2 justify-center">
                    <Button
                      size="sm"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-6"
                      onClick={() => setTradeModal({
                        isOpen: true,
                        type: "buy",
                        optionType: "call",
                        price: row.calls.ltp,
                        strike: row.strike
                      })}
                    >
                      Buy
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-500 hover:bg-red-600 text-white font-medium px-6"
                      onClick={() => setTradeModal({
                        isOpen: true,
                        type: "sell",
                        optionType: "call",
                        price: row.calls.ltp,
                        strike: row.strike
                      })}
                    >
                      Sell
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono">{row.calls.oi}</TableCell>
                <TableCell className="text-right font-mono text-emerald-500">
                  +{row.calls.ltpChg.toFixed(2)}%
                </TableCell>
                <TableCell className="text-right font-mono">
                  ${row.calls.ltp.toFixed(2)}
                </TableCell>
                <TableCell className="text-center font-mono font-bold">
                  {row.strike}
                </TableCell>
                <TableCell className="text-right font-mono">
                  ${row.puts.ltp.toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-mono text-red-500">
                  {row.puts.ltpChg.toFixed(2)}%
                </TableCell>
                <TableCell className="text-right font-mono">{row.puts.oi}</TableCell>
                <TableCell className="text-center">
                  <div className="flex gap-2 justify-center">
                    <Button
                      size="sm"
                      className="bg-red-500 hover:bg-red-600 text-white font-medium px-6"
                      onClick={() => setTradeModal({
                        isOpen: true,
                        type: "sell",
                        optionType: "put",
                        price: row.puts.ltp,
                        strike: row.strike
                      })}
                    >
                      Sell
                    </Button>
                    <Button
                      size="sm"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-6"
                      onClick={() => setTradeModal({
                        isOpen: true,
                        type: "buy",
                        optionType: "put",
                        price: row.puts.ltp,
                        strike: row.strike
                      })}
                    >
                      Buy
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {tradeModal && (
          <TradeModal
            isOpen={tradeModal.isOpen}
            onClose={() => setTradeModal(null)}
            type={tradeModal.type}
            optionType={tradeModal.optionType}
            price={tradeModal.price}
            strike={tradeModal.strike}
            asset={selectedAsset}
            timeFrame={timeFrame}
            subTimeFrame={subTimeFrame}
            selectedYear={selectedYear}
          />
        )}
      </div>
    </div>
  );
};

const TradeModal = ({ 
  isOpen, 
  onClose, 
  type, 
  optionType, 
  price, 
  strike, 
  asset,
  timeFrame,
  subTimeFrame,
  selectedYear
}: TradeModalProps) => {
  const [quantity, setQuantity] = useState("75");
  const { createPosition } = useOptionsTrading(asset);
  
  const handleTrade = async () => {
    const position = await createPosition(
      strike,
      optionType,
      type,
      Number(quantity)
    );

    if (position) {
      onClose();
    }
  };

  const getTimeDisplay = () => {
    if (timeFrame === "previous") {
      return `${subTimeFrame} ${selectedYear}`;
    } else if (timeFrame === "week") {
      return `${subTimeFrame} - This Week`;
    } else if (timeFrame === "month") {
      return `${subTimeFrame} - This Month`;
    } else if (timeFrame === "year") {
      return `${subTimeFrame} - This Year`;
    }
    return "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-left">
            {asset} {strike} | {optionType.toUpperCase()}
          </DialogTitle>
          <DialogDescription>
            Place your {type} order for {asset} options
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {timeFrame && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Time of Staking</h4>
              <p className="text-sm text-gray-600">{getTimeDisplay()}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label>Qty</Label>
            <Input 
              type="number" 
              value={quantity} 
              onChange={(e) => setQuantity(e.target.value)}
              className="font-mono"
            />
            <div className="text-sm text-gray-500">1 Lot</div>
          </div>
          
          <div className="space-y-2">
            <Label>Price</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <Input 
                type="number" 
                value={price.toFixed(2)} 
                readOnly 
                className="bg-gray-50 font-mono pl-7"
              />
            </div>
            <div className="text-sm text-gray-500">Range: $28.6 - $674</div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="atMarket" />
            <label
              htmlFor="atMarket"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              At Market
            </label>
          </div>

          <Button 
            className={`w-full ${
              type === "buy" 
                ? "bg-emerald-500 hover:bg-emerald-600" 
                : "bg-red-500 hover:bg-red-600"
            } text-white font-medium`}
            onClick={handleTrade}
          >
            {type.toUpperCase()} @ ${price.toFixed(2)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const stethOptionsData: OptionChainRow[] = [
  // This Week Contracts - Monday
  {
    strike: 22450,
    timeFrame: "week",
    subTimeFrame: "monday",
    year: "2024",
    calls: {
      oi: "5.25 L",
      ltpChg: 32.36,
      ltp: 707.15,
    },
    puts: {
      oi: "5.25 L",
      ltpChg: -32.36,
      ltp: 4,
    },
  },
  // This Week Contracts - Tuesday
  {
    strike: 22475,
    timeFrame: "week",
    subTimeFrame: "tuesday",
    year: "2024",
    calls: {
      oi: "4.75 L",
      ltpChg: 30.45,
      ltp: 695.30,
    },
    puts: {
      oi: "4.75 L",
      ltpChg: -30.45,
      ltp: 4.8,
    },
  },
  // This Week Contracts - Wednesday
  {
    strike: 22500,
    timeFrame: "week",
    subTimeFrame: "wednesday",
    year: "2024",
    calls: {
      oi: "4.15 L",
      ltpChg: 28.45,
      ltp: 685.30,
    },
    puts: {
      oi: "4.15 L",
      ltpChg: -28.45,
      ltp: 5.2,
    },
  },
  // This Week Contracts - Thursday
  {
    strike: 22525,
    timeFrame: "week",
    subTimeFrame: "thursday",
    year: "2024",
    calls: {
      oi: "3.95 L",
      ltpChg: 26.45,
      ltp: 675.30,
    },
    puts: {
      oi: "3.95 L",
      ltpChg: -26.45,
      ltp: 5.8,
    },
  },
  // This Week Contracts - Friday
  {
    strike: 22550,
    timeFrame: "week",
    subTimeFrame: "friday",
    year: "2024",
    calls: {
      oi: "3.75 L",
      ltpChg: 24.45,
      ltp: 665.30,
    },
    puts: {
      oi: "3.75 L",
      ltpChg: -24.45,
      ltp: 6.2,
    },
  },
  // This Month Contracts - Week 1
  {
    strike: 22575,
    timeFrame: "month",
    subTimeFrame: "week1",
    year: "2024",
    calls: {
      oi: "3.76 L",
      ltpChg: 25.72,
      ltp: 623,
    },
    puts: {
      oi: "3.76 L",
      ltpChg: -25.72,
      ltp: 7.5,
    },
  },
  // This Month Contracts - Week 2
  {
    strike: 22600,
    timeFrame: "month",
    subTimeFrame: "week2",
    year: "2024",
    calls: {
      oi: "2.85 L",
      ltpChg: 22.15,
      ltp: 598.45,
    },
    puts: {
      oi: "2.85 L",
      ltpChg: -22.15,
      ltp: 9.8,
    },
  },
  // This Month Contracts - Week 3
  {
    strike: 22625,
    timeFrame: "month",
    subTimeFrame: "week3",
    year: "2024",
    calls: {
      oi: "2.65 L",
      ltpChg: 20.15,
      ltp: 578.45,
    },
    puts: {
      oi: "2.65 L",
      ltpChg: -20.15,
      ltp: 10.8,
    },
  },
  // This Month Contracts - Week 4
  {
    strike: 22650,
    timeFrame: "month",
    subTimeFrame: "week4",
    year: "2024",
    calls: {
      oi: "2.45 L",
      ltpChg: 18.15,
      ltp: 558.45,
    },
    puts: {
      oi: "2.45 L",
      ltpChg: -18.15,
      ltp: 11.8,
    },
  },
  // Previous Year Contracts - Each Month
  {
    strike: 22400,
    timeFrame: "previous",
    subTimeFrame: "january",
    year: "2023",
    calls: {
      oi: "1.95 L",
      ltpChg: 18.36,
      ltp: 545.20,
    },
    puts: {
      oi: "1.95 L",
      ltpChg: -18.36,
      ltp: 12.5,
    },
  },
  {
    strike: 22425,
    timeFrame: "previous",
    subTimeFrame: "february",
    year: "2023",
    calls: {
      oi: "1.85 L",
      ltpChg: 17.36,
      ltp: 535.20,
    },
    puts: {
      oi: "1.85 L",
      ltpChg: -17.36,
      ltp: 13.5,
    },
  },
  {
    strike: 22450,
    timeFrame: "previous",
    subTimeFrame: "march",
    year: "2023",
    calls: {
      oi: "1.75 L",
      ltpChg: 16.36,
      ltp: 525.20,
    },
    puts: {
      oi: "1.75 L",
      ltpChg: -16.36,
      ltp: 14.5,
    },
  }
];

const xstrkOptionsData: OptionChainRow[] = [
  // This Week Contracts - Each Day
  {
    strike: 1450,
    timeFrame: "week",
    subTimeFrame: "monday",
    year: "2024",
    calls: {
      oi: "2.15 L",
      ltpChg: 28.45,
      ltp: 125.30,
    },
    puts: {
      oi: "2.15 L",
      ltpChg: -28.45,
      ltp: 2.5,
    },
  },
  {
    strike: 1460,
    timeFrame: "week",
    subTimeFrame: "tuesday",
    year: "2024",
    calls: {
      oi: "2.05 L",
      ltpChg: 27.45,
      ltp: 120.30,
    },
    puts: {
      oi: "2.05 L",
      ltpChg: -27.45,
      ltp: 2.8,
    },
  },
  {
    strike: 1470,
    timeFrame: "week",
    subTimeFrame: "wednesday",
    year: "2024",
    calls: {
      oi: "1.95 L",
      ltpChg: 26.45,
      ltp: 115.30,
    },
    puts: {
      oi: "1.95 L",
      ltpChg: -26.45,
      ltp: 3.1,
    },
  },
  {
    strike: 1475,
    timeFrame: "week",
    subTimeFrame: "thursday",
    year: "2024",
    calls: {
      oi: "1.85 L",
      ltpChg: 25.30,
      ltp: 112.45,
    },
    puts: {
      oi: "1.85 L",
      ltpChg: -25.30,
      ltp: 3.2,
    },
  },
  {
    strike: 1480,
    timeFrame: "week",
    subTimeFrame: "friday",
    year: "2024",
    calls: {
      oi: "1.75 L",
      ltpChg: 24.30,
      ltp: 110.45,
    },
    puts: {
      oi: "1.75 L",
      ltpChg: -24.30,
      ltp: 3.4,
    },
  },
  // This Month Contracts - Each Week
  {
    strike: 1500,
    timeFrame: "month",
    subTimeFrame: "week1",
    year: "2024",
    calls: {
      oi: "1.55 L",
      ltpChg: 22.15,
      ltp: 98.45,
    },
    puts: {
      oi: "1.55 L",
      ltpChg: -22.15,
      ltp: 4.2,
    },
  },
  {
    strike: 1510,
    timeFrame: "month",
    subTimeFrame: "week2",
    year: "2024",
    calls: {
      oi: "1.45 L",
      ltpChg: 21.60,
      ltp: 92.75,
    },
    puts: {
      oi: "1.45 L",
      ltpChg: -21.60,
      ltp: 4.8,
    },
  },
  {
    strike: 1525,
    timeFrame: "month",
    subTimeFrame: "week3",
    year: "2024",
    calls: {
      oi: "1.35 L",
      ltpChg: 20.60,
      ltp: 85.75,
    },
    puts: {
      oi: "1.35 L",
      ltpChg: -20.60,
      ltp: 5.5,
    },
  },
  {
    strike: 1535,
    timeFrame: "month",
    subTimeFrame: "week4",
    year: "2024",
    calls: {
      oi: "1.25 L",
      ltpChg: 19.60,
      ltp: 80.75,
    },
    puts: {
      oi: "1.25 L",
      ltpChg: -19.60,
      ltp: 6.2,
    },
  },
  // Previous Year Contracts - Sample Months
  {
    strike: 1550,
    timeFrame: "previous",
    subTimeFrame: "january",
    year: "2023",
    calls: {
      oi: "1.25 L",
      ltpChg: 35.60,
      ltp: 75.20,
    },
    puts: {
      oi: "1.25 L",
      ltpChg: -35.60,
      ltp: 6.8,
    },
  },
  {
    strike: 1560,
    timeFrame: "previous",
    subTimeFrame: "february",
    year: "2023",
    calls: {
      oi: "1.15 L",
      ltpChg: 34.60,
      ltp: 72.20,
    },
    puts: {
      oi: "1.15 L",
      ltpChg: -34.60,
      ltp: 7.2,
    },
  },
  {
    strike: 1570,
    timeFrame: "previous",
    subTimeFrame: "march",
    year: "2023",
    calls: {
      oi: "1.05 L",
      ltpChg: 33.60,
      ltp: 70.20,
    },
    puts: {
      oi: "1.05 L",
      ltpChg: -33.60,
      ltp: 7.8,
    },
  }
];
