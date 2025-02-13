import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Sample data for demonstration
const caseHistory = [
  {
    id: "C001",
    clientName: "John Doe",
    caseType: "Civil",
    judgeName: "Hon. Smith",
    result: "Won",
  },
  {
    id: "C002",
    clientName: "Jane Smith",
    caseType: "Criminal",
    judgeName: "Hon. Johnson",
    result: "Lost",
  },
  {
    id: "C003",
    clientName: "Bob Brown",
    caseType: "Family",
    judgeName: "Hon. Williams",
    result: "Won",
  },
  {
    id: "C004",
    clientName: "Alice Green",
    caseType: "Corporate",
    judgeName: "Hon. Davis",
    result: "Won",
  },
  {
    id: "C005",
    clientName: "Charlie Wilson",
    caseType: "Civil",
    judgeName: "Hon. Miller",
    result: "Lost",
  },
];

export default function LawyerCaseHistory() {
  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-4">Case History</h2>
      <Table>
        <TableCaption>A list of your previous cases</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Case ID</TableHead>
            <TableHead>Client Name</TableHead>
            <TableHead>Case Type</TableHead>
            <TableHead>Judge Name</TableHead>
            <TableHead>Result</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {caseHistory.map((caseItem) => (
            <TableRow key={caseItem.id}>
              <TableCell className="font-medium">{caseItem.id}</TableCell>
              <TableCell>{caseItem.clientName}</TableCell>
              <TableCell>{caseItem.caseType}</TableCell>
              <TableCell>{caseItem.judgeName}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    caseItem.result === "Won" ? "default" : "destructive"
                  }
                >
                  {caseItem.result}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
