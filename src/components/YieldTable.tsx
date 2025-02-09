import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddLSDAssetDialog } from "./AddLSDAssetDialog";
import { StakeAssetDialog } from "./StakeAssetDialog";
import { useState, useEffect } from "react";
import { getCurrentPrice, calculateYields } from "@/utils/priceFeed";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

interface YieldPosition {
  asset: string;
  currentPrice: string;
  stakedAmount: number;
  apy: string;
  yieldUSD: string;
  yieldETH: string;
  optionContracts?: Array<{
    asset: string;
    strike: number;
    call: number;
    put: number;
    timestamp: number;
  }>;
}

const initialPositions: YieldPosition[] = [
  {
    asset: "stETH",
    currentPrice: "$2,500",
    stakedAmount: 10,
    apy: "4.0%",
    yieldUSD: "$175",
    yieldETH: "0.085 ETH",
    optionContracts: []
  },
  {
    asset: "xSTRK",
    currentPrice: "$15",
    stakedAmount: 1000,
    apy: "12.0%",
    yieldUSD: "$84",
    yieldETH: "42 STRK",
    optionContracts: []
  },
];

export const YieldTable = () => {
  const [positions, setPositions] = useState<YieldPosition[]>(initialPositions);
  const [expandedAsset, setExpandedAsset] = useState<string | null>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPositions(currentPositions =>
        currentPositions.map(position => {
          const currentPrice = getCurrentPrice(position.asset);
          const apy = parseFloat(position.apy);
          const yields = calculateYields(position.stakedAmount, currentPrice, apy);
          
          return {
            ...position,
            currentPrice: `$${currentPrice.toFixed(2)}`,
            ...yields
          };
        })
      );
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleAddAsset = (newAsset: YieldPosition) => {
    setPositions([...positions, newAsset]);
  };

  return (
    <div className="space-y-6">
      {/* Boost Section - Now at the top */}
      <div className="bg-blue-50 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-blue-900 mb-2">
              Boost Your Yield Portfolio
            </h3>
            <p className="text-blue-700">
              Add more Liquid Staking Derivatives to increase your passive income
            </p>
          </div>
          <div className="flex gap-4">
            <StakeAssetDialog />
            <AddLSDAssetDialog onAssetAdded={handleAddAsset} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-blue-900">Yield Bearing Assets</h2>
              <p className="text-sm text-gray-500">current staked positions and yields</p>
            </div>
          </div>

          {positions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No yield bearing assets yet</p>
              <AddLSDAssetDialog onAssetAdded={handleAddAsset} />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Current Price</TableHead>
                    <TableHead>Staked Amount</TableHead>
                    <TableHead>APY</TableHead>
                    <TableHead>Yield (USD)</TableHead>
                    <TableHead>Yield (ETH)</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {positions.map((position, index) => (
                    <>
                      <TableRow key={index} className="cursor-pointer hover:bg-gray-50" onClick={() => setExpandedAsset(expandedAsset === position.asset ? null : position.asset)}>
                        <TableCell className="font-medium">{position.asset}</TableCell>
                        <TableCell>{position.currentPrice}</TableCell>
                        <TableCell>{position.stakedAmount}</TableCell>
                        <TableCell className="text-green-600">{position.apy}</TableCell>
                        <TableCell>{position.yieldUSD}</TableCell>
                        <TableCell>{position.yieldETH}</TableCell>
                        <TableCell>
                          <Link to={`/trading?asset=${position.asset}`}>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                              Trade Options <ArrowRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                      {expandedAsset === position.asset && position.optionContracts && position.optionContracts.length > 0 && (
                        <TableRow>
                          <TableCell colSpan={7}>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="text-sm font-semibold mb-2">Available Option Contracts</h4>
                              <div className="grid grid-cols-3 gap-4">
                                {position.optionContracts.map((contract, idx) => (
                                  <div key={idx} className="bg-white p-3 rounded border">
                                    <div className="text-sm font-medium">Strike: ${contract.strike}</div>
                                    <div className="text-xs text-gray-500">Call: ${contract.call.toFixed(2)}</div>
                                    <div className="text-xs text-gray-500">Put: ${contract.put.toFixed(2)}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </div>
      </div>
    </div>
  );
};