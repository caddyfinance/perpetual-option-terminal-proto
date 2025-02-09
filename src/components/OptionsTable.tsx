import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface OptionsPosition {
  type: string;
  asset: string;
  strike: string;
  quantity: number;
  avgPrice: string;
  current: string;
  pnl: string;
}

const positions: OptionsPosition[] = [
  {
    type: "Call",
    asset: "stETH",
    strike: "$2,500",
    quantity: 5,
    avgPrice: "$125.5",
    current: "$132.2",
    pnl: "$350",
  },
  {
    type: "Put",
    asset: "xSTRK",
    strike: "$15",
    quantity: -3,
    avgPrice: "$2.6",
    current: "$2.2",
    pnl: "$120",
  },
];

export const OptionsTable = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-900">Active Options Positions</h2>
            <p className="text-sm text-gray-500">current options positions</p>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search positions..."
              className="pl-9"
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Asset</TableHead>
              <TableHead>Strike</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Avg Price</TableHead>
              <TableHead>Current</TableHead>
              <TableHead>P&L</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions.map((position, index) => (
              <TableRow key={index}>
                <TableCell>{position.type}</TableCell>
                <TableCell className="font-medium">{position.asset}</TableCell>
                <TableCell>{position.strike}</TableCell>
                <TableCell>{position.quantity}</TableCell>
                <TableCell>{position.avgPrice}</TableCell>
                <TableCell>{position.current}</TableCell>
                <TableCell className="text-green-600">{position.pnl}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};