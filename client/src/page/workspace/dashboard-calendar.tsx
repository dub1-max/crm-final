import { Calendar as CalendarIcon } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";

export const DashboardCalendar = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <CalendarIcon className="h-4 w-4" />
        <h3 className="font-medium">Calendar</h3>
      </div>
      <DatePicker />
    </div>
  );
};