import { MetricCard } from "../MetricCard";

export const MetricsOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <MetricCard
        label="Total P&L"
        value="$470"
      />
      <MetricCard
        label="Yield Earned"
        value="$259"
        sublabel="average APY"
      />
      <MetricCard
        label="Total Return"
        value="$729"
        sublabel="total investment"
      />
    </div>
  );
};