"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  addDays,
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import axios from "axios";

interface CalendarProps {
  className?: string;
}

interface Case {
  id: string;
  clientName: string;
  date: Date;
  type: string;
  outcome: "Pending" | "Won" | "Lost";
}

export function LawyerCalendar({ className }: CalendarProps) {
  const [cases, setCases] = React.useState<Case[]>([]);
  console.log("🚀 ~ cases:", cases);
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());

  // Color function for status
  const getStatusColor = (outcome: string) => {
    switch (outcome) {
      case "Pending":
        return "bg-yellow-500 text-white";
      case "Won":
        return "bg-green-500 text-white";
      case "Lost":
        return "bg-red-500 text-white";
      default:
        return "bg-blue-500 text-white";
    }
  };

  React.useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await axios.get("/api/api/getAllCases");
        if (Array.isArray(response.data.data)) {
          const formattedCases = response.data.data.map((caseItem: any) => ({
            id: caseItem._id,
            clientName: caseItem.clientName,
            date: new Date(caseItem.assignedDate),
            type: caseItem.type || "Hearing",
            outcome: caseItem.outcome || "Pending",
          }));
          setCases(formattedCases);
        } else {
          console.error("Expected an array but got:", response.data.data);
        }
      } catch (error: any) {
        console.error("Error fetching cases:", error.message);
      }
    };

    fetchCases();
  }, []);

  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  const days = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const previousMonth = () => {
    setCurrentDate(addDays(firstDayOfMonth, -1));
  };

  const nextMonth = () => {
    setCurrentDate(addDays(lastDayOfMonth, 1));
  };

  const getCasesForDate = (date: Date) => {
    return cases.filter((c: Case) => isSameDay(c.date, date));
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
       Calander
      </h1>
      <div className="flex justify-center">
      <Card className={cn("w-full max-w-4xl bg-white", className)}>
        <CardHeader className="px-6 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {format(currentDate, "MMMM yyyy")}
            </h2>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="h-8 px-2"
                onClick={goToToday}
              >
                Today
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={previousMonth}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={nextMonth}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-7 border-b border-t">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="px-4 py-3 text-center text-sm font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {days.map((day: Date, index: number) => {
              const casesOnDay = getCasesForDate(day);
              const isToday = isSameDay(day, new Date());
              const isSelected = isSameDay(day, selectedDate);

              return (
                <div
                  key={day.toString()}
                  className={cn(
                    "relative min-h-[120px] border-b border-r p-2",
                    index % 7 === 0 && "border-l",
                    !isSameMonth(day, currentDate) && "bg-muted/50"
                  )}
                  onClick={() => setSelectedDate(day)}
                >
                  <div
                    className={cn(
                      "relative z-10 flex h-6 w-6 items-center justify-center rounded-full text-sm",
                      isToday ? "bg-yellow-100" : isSelected && "bg-muted"
                    )}
                  >
                    {format(day, "d")}
                  </div>
                  <div className="mt-1 space-y-1">
                    {casesOnDay.map((caseItem: Case) => (
                      <div
                        key={caseItem.id}
                        className={cn(
                          "rounded px-2 py-1 text-xs font-medium",
                          getStatusColor(caseItem.outcome)
                        )}
                      >
                        {caseItem.clientName}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      </div>
    </>
  );
}
