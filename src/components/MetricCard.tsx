interface MetricCardProps {
  label: string;
  value: string;
  sublabel?: string;
}

export const MetricCard = ({ label, value, sublabel }: MetricCardProps) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-4xl font-bold text-green-600 mt-2">{value}</div>
      {sublabel && <div className="text-sm text-gray-500 mt-1">{sublabel}</div>}
    </div>
  );
};