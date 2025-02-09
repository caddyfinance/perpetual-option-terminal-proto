import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { getCurrentPrice } from "@/utils/priceFeed";
import { useEffect, useState } from "react";
import { createNewContract } from "@/utils/pricingModel";

const formSchema = z.object({
  asset: z.string().min(1, "Asset is required"),
  amount: z.string().min(1, "Amount is required"),
  currentPrice: z.string().min(1, "Current price is required"),
  totalValue: z.string().optional(),
});

const lsdOptions = [
  { value: "stETH", label: "Lido stETH" },
  { value: "rETH", label: "Rocket Pool rETH" },
  { value: "cbETH", label: "Coinbase cbETH" },
  { value: "ankrETH", label: "Ankr ankrETH" },
  { value: "xSTRK", label: "Strike xSTRK" },
];

// Function to generate strike prices around current price
const generateStrikes = (currentPrice: number): number[] => {
  const strikes = [];
  const range = 0.1; // 10% range above and below current price
  const steps = 5; // Number of strikes above and below current price
  
  for (let i = -steps; i <= steps; i++) {
    const strike = currentPrice * (1 + (range * i) / steps);
    strikes.push(Math.round(strike));
  }
  
  return strikes;
};

export const AddLSDAssetDialog = ({ onAssetAdded }: { onAssetAdded: (asset: any) => void }) => {
  const { toast } = useToast();
  const [totalValue, setTotalValue] = useState<string>("0.00");
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      asset: "",
      amount: "",
      currentPrice: "",
      totalValue: "0.00",
    },
  });

  // Watch for asset changes to update the current price
  const selectedAsset = form.watch("asset");
  const amount = form.watch("amount");
  const currentPrice = form.watch("currentPrice");
  
  useEffect(() => {
    if (selectedAsset) {
      const price = getCurrentPrice(selectedAsset);
      form.setValue("currentPrice", price.toString());
    }
  }, [selectedAsset, form]);

  // Calculate total value when amount or price changes
  useEffect(() => {
    if (amount && currentPrice) {
      const calculatedTotal = (parseFloat(amount) * parseFloat(currentPrice)).toFixed(2);
      setTotalValue(calculatedTotal);
      form.setValue("totalValue", calculatedTotal);
    } else {
      setTotalValue("0.00");
      form.setValue("totalValue", "0.00");
    }
  }, [amount, currentPrice, form]);

  const createOptionContracts = (asset: string, currentPrice: number) => {
    const strikes = generateStrikes(currentPrice);
    const volatility = 0.3; // 30% volatility
    const riskFreeRate = 0.05; // 5% risk-free rate

    return strikes.map(strike => {
      return createNewContract(
        asset,
        currentPrice,
        strike,
        volatility,
        riskFreeRate
      );
    });
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const price = parseFloat(values.currentPrice);
    const contracts = createOptionContracts(values.asset, price);
    
    const newAsset = {
      asset: values.asset,
      currentPrice: `$${values.currentPrice}`,
      stakedAmount: parseFloat(values.amount),
      totalValue: `$${values.totalValue}`,
      apy: "4.0%",
      yieldUSD: `$${(parseFloat(values.amount) * price * 0.04).toFixed(2)}`,
      yieldETH: `${(parseFloat(values.amount) * 0.04).toFixed(3)} ETH`,
      optionContracts: contracts
    };

    // Store the asset in localStorage for the trading terminal
    const storedAssets = localStorage.getItem('portfolioAssets');
    const currentAssets = storedAssets ? JSON.parse(storedAssets) : [];
    const assetExists = currentAssets.some((a: any) => a.value === values.asset);
    
    if (!assetExists) {
      const assetOption = lsdOptions.find(opt => opt.value === values.asset);
      if (assetOption) {
        currentAssets.push(assetOption);
        localStorage.setItem('portfolioAssets', JSON.stringify(currentAssets));
      }
    }

    onAssetAdded(newAsset);
    
    toast({
      title: "Asset Added",
      description: `Successfully added ${values.amount} ${values.asset} to your portfolio with ${contracts.length} option contracts`,
    });
    
    form.reset();
    setTotalValue("0.00");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">Add LSD Asset</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add LSD Asset</DialogTitle>
          <DialogDescription>
            Add a new Liquid Staking Derivative asset to your portfolio
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="asset"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an LSD asset" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {lsdOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Price (USD)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      {...field} 
                      readOnly 
                      className="bg-gray-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Value (USD)</FormLabel>
                  <FormControl>
                    <Input 
                      type="text" 
                      value={`$${totalValue}`}
                      readOnly 
                      className="bg-gray-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Add Asset</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};