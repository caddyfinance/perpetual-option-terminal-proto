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
import { ArrowUpCircle } from "lucide-react";

const formSchema = z.object({
  protocol: z.string().min(1, "Protocol is required"),
});

const stakingProtocols = [
  { 
    value: "lido", 
    label: "Lido Finance", 
    apy: "4.0%",
    url: "https://stake.lido.fi/"
  },
  { 
    value: "rocketpool", 
    label: "Rocket Pool", 
    apy: "3.8%",
    url: "https://stake.rocketpool.net/"
  },
  { 
    value: "coinbase", 
    label: "Coinbase", 
    apy: "3.5%",
    url: "https://www.coinbase.com/earn"
  },
  { 
    value: "strike", 
    label: "Strike Protocol", 
    apy: "12.0%",
    url: "https://app.strike.org/"
  },
];

export const StakeAssetDialog = () => {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      protocol: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const selectedProtocol = stakingProtocols.find(p => p.value === values.protocol);
    if (selectedProtocol) {
      // Open in new tab
      window.open(selectedProtocol.url, '_blank');
      toast({
        title: "Redirecting to Staking Protocol",
        description: `You are being redirected to ${selectedProtocol.label}`,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <ArrowUpCircle className="mr-2 h-4 w-4" />
          Stake Assets
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Choose Staking Protocol</DialogTitle>
          <DialogDescription>
            Select a trusted protocol partner to stake your assets
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="protocol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Staking Protocol</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a staking protocol" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {stakingProtocols.map((protocol) => (
                        <SelectItem key={protocol.value} value={protocol.value}>
                          {protocol.label} - APY: {protocol.apy}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Continue to Protocol</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};