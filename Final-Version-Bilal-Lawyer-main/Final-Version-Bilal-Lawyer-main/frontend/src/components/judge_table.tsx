"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { type Judge, judges } from "./data/judge";

export function JudgeTable() {
  const [data, setData] = useState<Judge[]>(judges);
  const [sortColumn, setSortColumn] = useState<keyof Judge | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const sortData = (column: keyof Judge) => {
    const newDirection =
      sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    const sortedData = [...data].sort((a, b) => {
      if (a[column] < b[column]) return newDirection === "asc" ? -1 : 1;
      if (a[column] > b[column]) return newDirection === "asc" ? 1 : -1;
      return 0;
    });

    setData(sortedData);
    setSortColumn(column);
    setSortDirection(newDirection);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">
            <Button variant="ghost" onClick={() => sortData("name")}>
              Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>
            <Button variant="ghost" onClick={() => sortData("court")}>
              Court
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead className="text-right">
            <Button variant="ghost" onClick={() => sortData("assignedCases")}>
              Assigned Cases
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead className="text-right">
            <Button variant="ghost" onClick={() => sortData("totalCases")}>
              Total Cases
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((judge) => (
          <TableRow key={judge.id}>
            <TableCell className="font-medium">{judge.name}</TableCell>
            <TableCell>{judge.court}</TableCell>
            <TableCell className="text-right">{judge.assignedCases}</TableCell>
            <TableCell className="text-right">{judge.totalCases}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(judge.id)}
                  >
                    Copy judge ID
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>View details</DropdownMenuItem>
                  <DropdownMenuItem>Edit judge</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
