import Container from "@/components/Container";
import OrderTable from "@/components/OrderTable";
import { getAllOderInAdminPage } from "@/utils/actions/ordersActions";
import { Order } from "@prisma/client";
import React from "react";

async function AdminOrdersPage() {
  const orders: Order[] = await getAllOderInAdminPage();
  return (
    <Container className="mt-10">
      <OrderTable isAdminPage ordersFromDB={orders} />
    </Container>
  );
}

export default AdminOrdersPage;
