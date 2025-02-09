import { Header } from "@/components/layout/Header";
import { OptionsChainTable } from "@/components/OptionsChainTable";
import { TimeFrameSelector } from "@/components/trading/TimeFrameSelector";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const Trading = () => {
  const [searchParams] = useSearchParams();
  const assetFromParams = searchParams.get('asset');
  const [timeFrame, setTimeFrame] = useState<string>("");
  const [subTimeFrame, setSubTimeFrame] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [appliedTimeFrame, setAppliedTimeFrame] = useState<string>("");
  const [appliedSubTimeFrame, setAppliedSubTimeFrame] = useState<string>("");
  const [appliedYear, setAppliedYear] = useState<string>("");
  const { toast } = useToast();

  const handleSearch = () => {
    if (!timeFrame) {
      toast({
        title: "Please select a time frame",
        variant: "destructive",
      });
      return;
    }

    if (timeFrame === "previous" && !selectedYear) {
      toast({
        title: "Please select a year for previous contracts",
        variant: "destructive",
      });
      return;
    }

    if (!subTimeFrame) {
      toast({
        title: "Please select a sub time frame",
        variant: "destructive",
      });
      return;
    }

    setAppliedTimeFrame(timeFrame);
    setAppliedSubTimeFrame(subTimeFrame);
    setAppliedYear(selectedYear);

    toast({
      title: "Search applied",
      description: "Options chain updated with selected time frame",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Perpetual American Options Trading
            </h1>
            {assetFromParams && (
              <p className="text-gray-600 mt-2">
                Trading options for {assetFromParams}
              </p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Option Chain - Perpetual American Options
            </h2>

            <div className="space-y-6">
              <TimeFrameSelector 
                timeFrame={timeFrame}
                subTimeFrame={subTimeFrame}
                selectedYear={selectedYear}
                onTimeFrameChange={setTimeFrame}
                onSubTimeFrameChange={setSubTimeFrame}
                onYearChange={setSelectedYear}
                onSearch={handleSearch}
              />

              <OptionsChainTable 
                timeFrame={appliedTimeFrame}
                subTimeFrame={appliedSubTimeFrame}
                selectedYear={appliedYear}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trading;