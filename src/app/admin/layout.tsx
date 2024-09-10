import Container from "@/components/Container";
import React, { ReactNode } from "react";

function layout({ children }: { children: ReactNode }) {
  return <Container>{children}</Container>;
}

export default layout;
