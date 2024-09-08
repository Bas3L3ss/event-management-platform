import Link from "next/link";
import { Button } from "./ui/button";
import { IconJarLogoIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

function Logo({ className }: { className?: string }) {
  return (
    <Link
      href={"/"}
      className={cn("flex justify-center items-center  ", className)}
    >
      <Button size="icon" asChild>
        <span>
          <IconJarLogoIcon />
        </span>
      </Button>
      <span className=" inline-flex h-9 w-max items-center justify-center rounded-md bg-background text-sm font-medium  px-4 py-2  ">
        @EventManager
      </span>
    </Link>
  );
}
export default Logo;
