"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  ArrowUpDown,
  Check,
  Copy,
  ChevronDownIcon,
} from "lucide-react";
import { Order } from "@prisma/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import Link from "next/link";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function OrderTable({
  ordersFromDB,
}: {
  ordersFromDB: Order[];
}) {
  const [orders, setOrders] = useState<Order[]>(ordersFromDB);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPaidFilter, setIsPaidFilter] = useState<string | null>(null);

  useEffect(() => {
    const filteredOrders = ordersFromDB
      .filter(
        (order) =>
          order.eventName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (isPaidFilter === null || order.isPaid === (isPaidFilter === "true"))
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    setOrders(filteredOrders);
  }, [searchTerm, isPaidFilter, ordersFromDB]);

  return (
    <div className="space-y-4  ">
      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by event name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select onValueChange={(value) => setIsPaidFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem defaultChecked value=" ">
              Default
            </SelectItem>
            <SelectItem value="true">Paid</SelectItem>
            <SelectItem value="false">Unpaid</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Order ID</TableHead>
            <TableHead>Event Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Order Total</TableHead>
            <TableHead className="text-right">Tax</TableHead>
            <TableHead>Is Paid</TableHead>
            <TableHead className="text-right">Created At</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <IndividualOrder order={order} key={order.id} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
const IndividualOrder = ({ order }: { order: Order }) => {
  const [date, setDate] = useState<string>();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id).then(() => {
      setCopiedId(id);
      toast({
        title: "Copied!",
        description: `Order ID ${id} copied to clipboard`,
      });
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  useEffect(() => {
    setDate(new Date(order.createdAt).toLocaleString());
  }, [order.createdAt]);
  return (
    <TableRow className="cursor-pointer">
      <TableCell className="font-light text-xs ">{order.id}</TableCell>
      <TableCell>{order.eventName}</TableCell>
      <TableCell>{order.email}</TableCell>
      <TableCell className="text-right">
        ${order.orderTotal.toFixed(2)}
      </TableCell>
      <TableCell className="text-right">${order.tax.toFixed(2)}</TableCell>
      <TableCell className="text-right">
        {order.isPaid ? "Yes" : "No"}
      </TableCell>
      <TableCell className="text-right">{date}</TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <ChevronDownIcon className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                copyToClipboard(order.id);
              }}
            >
              {copiedId === order.id ? (
                <div className="flex gap-2">
                  <span>Copied event Id</span>
                  <Check className="h-4 w-4" />
                </div>
              ) : (
                <div className="flex gap-2">
                  <span>Copy event Id</span>
                  <Copy className="h-4 w-4" />
                </div>
              )}
              <span className="sr-only">Copy order ID</span>
            </DropdownMenuItem>
            {!order.isPaid && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="bg-green-600">
                  <Link
                    href={`/checkout?orderId=${order.id}&eventId=${order.eventId}`}
                  >
                    Activate Advertisement
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
