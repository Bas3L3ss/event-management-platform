"use client";

import { useFormState } from "react-dom";
import { useEffect } from "react";

import { useToast } from "@/hooks/use-toast";

export type actionFunction = (
  prevState: any,
  formData: FormData
) => Promise<{ message: string }>;

const initialState = {
  message: "",
};

function FormContainer({
  action,
  children,
}: {
  action: actionFunction;
  children: React.ReactNode;
}) {
  const [state, formAction] = useFormState(action, initialState);
  const { toast } = useToast();
  useEffect(() => {
    if (state.message) {
      toast({ description: state.message });
    }
  }, [state, toast]);
  return <form action={formAction}>{children}</form>;
}
export default FormContainer;
