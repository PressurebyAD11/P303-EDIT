import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";

export default function Saved() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <h2 className="text-2xl font-semibold">Saved looks</h2>
      <p className="text-muted-foreground">
        Your saved outfits will appear here (coming in Phase 6)
      </p>
      <Link to="/" className={buttonVariants({ variant: "outline" })}>
        Home
      </Link>
    </div>
  );
}
