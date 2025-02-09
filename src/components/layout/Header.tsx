import { Link } from "react-router-dom";
import { WalletConnectButton } from "@/components/WalletConnectButton";

export const Header = () => {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-xl font-bold">
            LST AMM Terminal
          </Link>
          <nav className="flex items-center space-x-4">
            <Link to="/" className="text-sm font-medium">
              Dashboard
            </Link>
            <Link to="/trading" className="text-sm font-medium">
              Trading
            </Link>
          </nav>
        </div>
        <div className="ml-auto">
          <WalletConnectButton />
        </div>
      </div>
    </header>
  );
};