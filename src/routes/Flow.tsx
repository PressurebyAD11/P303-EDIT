import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";

export default function Flow() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <h2 className="text-2xl font-semibold">Style flow</h2>
      <p className="text-muted-foreground">
        Occasion → vibe → constraints (coming in Phase 2)
      </p>
      <div className="flex gap-3">
        <Link to="/" className={buttonVariants({ variant: "outline" })}>
          Back
        </Link>
        <Link to="/reveal" className={buttonVariants()}>
          See a look
        </Link>
      </div>
    </div>
  );
}
