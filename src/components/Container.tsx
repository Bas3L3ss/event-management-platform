import { cn } from "@/lib/utils";

function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mx-auto max-w-6xl xl:max-w-7xl px-8  ", className)}>
      {children}
    </section>
  );
}

export default Container;
