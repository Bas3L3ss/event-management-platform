"use client";

import { useFormState } from "react-dom";
import { useEffect } from "react";

import { useToast } from "@/hooks/use-toast";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type actionFunction = (
  prevState: any,
  formData: FormData
) => Promise<{ message: string; isError: boolean }>;

const initialState = {
  message: "",
  isError: false,
};

function FormEditContainer({
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
      if (state.isError == true) {
        toast({
          title: "Warning",
          variant: "destructive",
          description: state.message,
        });
      } else {
        toast({
          title: "notice",
          description: state.message,
        });
      }
    }
  }, [state, toast]);
  return <form action={formAction}>{children}</form>;
}
export default FormEditContainer;
