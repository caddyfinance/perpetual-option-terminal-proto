import { Button } from "@/components/ui/button";
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { toast } from "@/components/ui/use-toast";

export const WalletConnectButton = () => {
  const { address, isConnected } = useAccount()
  const { connect, connectors, status } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <Button 
        variant="outline" 
        onClick={() => disconnect()}
      >
        {address?.slice(0, 6)}...{address?.slice(-4)}
      </Button>
    )
  }

  return (
    <Button
      onClick={() => {
        const connector = connectors[0] // MetaMask connector
        if (connector) {
          connect({ connector })
          toast({
            title: "Connecting to MetaMask",
            description: "Please approve the connection in your wallet",
          })
        } else {
          toast({
            title: "MetaMask not found",
            description: "Please install MetaMask to connect",
            variant: "destructive",
          })
        }
      }}
      disabled={status === 'pending'}
    >
      Connect MetaMask
      {status === 'pending' && '...'}
    </Button>
  )
}