"use client";

import { useFormState } from "react-dom";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { redirect } from "next/navigation";

export type actionFunction = (
  prevState: any,
  formData: FormData
) => Promise<{ message: string; isError: boolean }>;

// Initial state for the form
const initialState = {
  message: "",
  isError: false,
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
    // Log the current state for debugging purposes

    // Check for errors and show toast notifications
    if (state.message) {
      if (state.isError) {
        toast({
          title: "Warning",
          variant: "destructive",
          description: state.message,
        });
      } else {
        // Only redirect if there's no error
        redirect("/events/myevents");
      }
    }
  }, [state, toast]);

  return <form action={formAction}>{children}</form>;
}

export default FormContainer;
