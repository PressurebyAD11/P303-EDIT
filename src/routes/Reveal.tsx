import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";

export default function Reveal() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <h2 className="text-2xl font-semibold">Your look</h2>
      <p className="text-muted-foreground">
        Layered figure + why-it-works (coming in Phases 3 & 5)
      </p>
      <div className="flex gap-3">
        <Link to="/style" className={buttonVariants({ variant: "outline" })}>
          Style again
        </Link>
        <Link to="/saved" className={buttonVariants()}>
          Love it
        </Link>
      </div>
    </div>
  );
}
