export interface Judge {
  id: string;
  name: string;
  court: string;
  assignedCases: number;
  totalCases: number;
}

export const judges: Judge[] = [
  {
    id: "1",
    name: "Hon. Sarah Johnson",
    court: "Supreme Court",
    assignedCases: 15,
    totalCases: 45,
  },
  {
    id: "2",
    name: "Hon. Michael Chen",
    court: "District Court",
    assignedCases: 22,
    totalCases: 78,
  },
  {
    id: "3",
    name: "Hon. Emily Rodriguez",
    court: "Appeals Court",
    assignedCases: 18,
    totalCases: 56,
  },
  {
    id: "4",
    name: "Hon. David Thompson",
    court: "Family Court",
    assignedCases: 30,
    totalCases: 92,
  },
  {
    id: "5",
    name: "Hon. Lisa Patel",
    court: "Juvenile Court",
    assignedCases: 25,
    totalCases: 68,
  },
];
