import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface TimeFrameSelectorProps {
  timeFrame: string;
  subTimeFrame: string;
  selectedYear: string;
  onTimeFrameChange: (value: string) => void;
  onSubTimeFrameChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onSearch: () => void;
}

export const TimeFrameSelector = ({
  timeFrame,
  subTimeFrame,
  selectedYear,
  onTimeFrameChange,
  onSubTimeFrameChange,
  onYearChange,
  onSearch,
}: TimeFrameSelectorProps) => {
  const { toast } = useToast();
  
  const getCurrentMonth = () => {
    return new Date().toLocaleString('default', { month: 'long' });
  };
  
  const getCurrentYear = () => {
    return new Date().getFullYear().toString();
  };

  const getPreviousYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => (currentYear - i - 1).toString());
  };

  const getDisplayYear = () => {
    if (timeFrame === "previous") {
      return selectedYear;
    }
    return getCurrentYear();
  };

  const renderMonthSelect = () => (
    <div className="flex items-center gap-2">
      <Select value={subTimeFrame} onValueChange={onSubTimeFrameChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="january">January</SelectItem>
          <SelectItem value="february">February</SelectItem>
          <SelectItem value="march">March</SelectItem>
          <SelectItem value="april">April</SelectItem>
          <SelectItem value="may">May</SelectItem>
          <SelectItem value="june">June</SelectItem>
          <SelectItem value="july">July</SelectItem>
          <SelectItem value="august">August</SelectItem>
          <SelectItem value="september">September</SelectItem>
          <SelectItem value="october">October</SelectItem>
          <SelectItem value="november">November</SelectItem>
          <SelectItem value="december">December</SelectItem>
        </SelectContent>
      </Select>
      <span className="text-gray-600">{getDisplayYear()}</span>
    </div>
  );

  const renderSubTimeFrameSelect = () => {
    if (!timeFrame) return null;

    if (timeFrame === "previous") {
      return (
        <div className="flex items-center gap-2">
          <Select value={selectedYear} onValueChange={onYearChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {getPreviousYears().map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedYear && renderMonthSelect()}
        </div>
      );
    }

    switch (timeFrame) {
      case "week":
        return (
          <div className="flex items-center gap-2">
            <Select value={subTimeFrame} onValueChange={onSubTimeFrameChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monday">Monday</SelectItem>
                <SelectItem value="tuesday">Tuesday</SelectItem>
                <SelectItem value="wednesday">Wednesday</SelectItem>
                <SelectItem value="thursday">Thursday</SelectItem>
                <SelectItem value="friday">Friday</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-gray-600">
              {getCurrentMonth()} {getDisplayYear()}
            </span>
          </div>
        );
      case "month":
        return (
          <div className="flex items-center gap-2">
            <Select value={subTimeFrame} onValueChange={onSubTimeFrameChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select week" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week1">Week 1</SelectItem>
                <SelectItem value="week2">Week 2</SelectItem>
                <SelectItem value="week3">Week 3</SelectItem>
                <SelectItem value="week4">Week 4</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-gray-600">
              {getCurrentMonth()} {getDisplayYear()}
            </span>
          </div>
        );
      case "year":
        return renderMonthSelect();
      default:
        return null;
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-700 mb-3">
        Time of Staking
      </h3>
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex gap-4 items-center flex-wrap">
          <Select value={timeFrame} onValueChange={(value) => {
            onTimeFrameChange(value);
            onSubTimeFrameChange("");
            if (value !== "previous") {
              onYearChange("");
            }
          }}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select time frame" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This week</SelectItem>
              <SelectItem value="month">This month</SelectItem>
              <SelectItem value="year">This year</SelectItem>
              <SelectItem value="previous">Previous years</SelectItem>
            </SelectContent>
          </Select>
          {renderSubTimeFrameSelect()}
        </div>
        <Button 
          onClick={onSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Search
        </Button>
      </div>
    </div>
  );
};