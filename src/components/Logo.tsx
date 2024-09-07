import Link from "next/link";
import { Button } from "./ui/button";
import { IconJarLogoIcon } from "@radix-ui/react-icons";

function Logo() {
  return (
    <Button size="icon" asChild>
      <Link href="/">
        <IconJarLogoIcon />
      </Link>
    </Button>
  );
}
export default Logo;
