import { authenticateAndRedirect } from "@/utils/actions/clerkFunc";
import React from "react";

function AdminPage() {
  console.log(authenticateAndRedirect());
  return <div></div>;
}

export default AdminPage;
