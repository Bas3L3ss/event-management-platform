import Container from "@/components/Container";
import OrderTable from "@/components/OrderTable";
import Title from "@/components/Title";
import { authenticateAndRedirect } from "@/utils/actions/clerkFunc";
import { getOrderByClerkId } from "@/utils/actions/ordersActions";
import React from "react";

async function EventOrdersPage() {
  const clerkId = authenticateAndRedirect();
  const orders = await getOrderByClerkId(clerkId);
  return (
    <Container>
      <Title title="My orders" className="mt-10" />
      <OrderTable ordersFromDB={orders} />
    </Container>
  );
}

export default EventOrdersPage;
