import Container from "@/components/Container";
import OrderTable from "@/components/OrderTable";
import Title from "@/components/Title";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { authenticateAndRedirect } from "@/utils/actions/clerkFunc";
import { getOrderByClerkId } from "@/utils/actions/ordersActions";
import React from "react";

async function EventOrdersPage() {
  const clerkId = authenticateAndRedirect();
  const orders = await getOrderByClerkId(clerkId);
  return (
    <Container className="mt-10 flex flex-col gap-2">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/events">Events</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Orders</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Title title="My orders" className="mt-10" />
      <OrderTable ordersFromDB={orders} />
    </Container>
  );
}

export default EventOrdersPage;
