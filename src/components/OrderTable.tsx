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
import { Search, Check, Copy, ChevronLeft, ChevronRight } from "lucide-react";
import { Order } from "@prisma/client";
import Link from "next/link";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";

export default function OrderTable({
  ordersFromDB,
  isAdminPage,
}: {
  ordersFromDB: Order[];
  isAdminPage?: boolean;
}) {
  const [orders, setOrders] = useState<Order[]>(ordersFromDB);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPaidFilter, setIsPaidFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const filteredOrders = ordersFromDB
      .filter((order) => {
        const matchesSearch = order.eventName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesPaidFilter =
          isPaidFilter === "all"
            ? true
            : isPaidFilter === "true"
            ? order.isPaid
            : isPaidFilter === "false"
            ? !order.isPaid
            : true;
        return matchesSearch && matchesPaidFilter;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    setOrders(filteredOrders);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, isPaidFilter, ordersFromDB]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="space-y-4">
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
        <Select
          value={isPaidFilter}
          onValueChange={(value) => setIsPaidFilter(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">Paid</SelectItem>
            <SelectItem value="false">Unpaid</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[170px]">Order ID</TableHead>
            <TableHead>Event Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Order Total</TableHead>
            <TableHead className="text-right">Tax</TableHead>
            <TableHead>Is Paid</TableHead>
            <TableHead className="text-right">Created At</TableHead>
            <TableHead className="text-right">Paid At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((order) => (
            <IndividualOrder
              isAdminPage={isAdminPage}
              order={order}
              key={order.id}
            />
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between">
        <div>
          Showing {indexOfFirstItem + 1} to{" "}
          {Math.min(indexOfLastItem, orders.length)} of {orders.length} entries
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div>
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

const IndividualOrder = ({
  order,
  isAdminPage = false,
}: {
  order: Order;
  isAdminPage?: boolean;
}) => {
  const [date, setDate] = useState<string>();
  const [datePaid, setDatePaid] = useState<string>();
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
    if (order.PaidAt) {
      setDatePaid(new Date(order.PaidAt).toLocaleString());
    } else {
      setDatePaid(" ");
    }
  }, [order.createdAt, order.PaidAt]);

  return (
    <TableRow className="cursor-pointer">
      <TableCell className="font-light text-xs ">{order.id}</TableCell>
      <TableCell>{order.eventName}</TableCell>
      <TableCell>{order.email}</TableCell>
      <TableCell className="text-right">${order.orderTotal / 100}</TableCell>
      <TableCell className="text-right">${order.tax.toFixed(2)}</TableCell>
      <TableCell className="text-right">
        {order.isPaid ? "Yes" : "No"}
      </TableCell>
      <TableCell className="text-right">{date}</TableCell>
      <TableCell className="text-right">{datePaid}</TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <DotsVerticalIcon className="size-3 hover:text-blue-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                copyToClipboard(order.eventId);
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
            {!order.isPaid && !isAdminPage && (
              <>
                <DropdownMenuSeparator />
                <Link
                  className="w-full"
                  href={`/checkout?orderId=${order.id}&eventId=${order.eventId}`}
                >
                  <DropdownMenuItem className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white dark:text-white rounded-md  hover:cursor-pointer transition-colors">
                    Activate Advertisement
                  </DropdownMenuItem>
                </Link>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
