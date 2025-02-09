import { Header } from "@/components/layout/Header";
import { MetricsOverview } from "@/components/dashboard/MetricsOverview";
import { OptionsTable } from "@/components/OptionsTable";
import { YieldTable } from "@/components/YieldTable";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-900 mb-8">Portfolio Overview</h1>
          <MetricsOverview />
          <div className="space-y-8">
            <OptionsTable />
            <YieldTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;