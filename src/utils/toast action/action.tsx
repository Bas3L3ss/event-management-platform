import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/hooks/use-toast";
import { SignUpButton } from "@clerk/nextjs";

export const toastPrint = (
  title?: string,
  description?: string,
  variant?: "default" | "destructive" | null | undefined,
  isAuthError: boolean = false
) => {
  if (!isAuthError) {
    toast({
      variant: variant,
      title: title,
      description: description,
    });
  } else {
    toast({
      variant: "destructive",
      title: "Please Login",

      description: "Login to send reviews",
      action: (
        <ToastAction altText="Try again">
          <SignUpButton>Log In</SignUpButton>
        </ToastAction>
      ),
    });
  }
};
