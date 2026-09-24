import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Morning";
  if (h < 18) return "Afternoon";
  return "Evening";
}

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-3xl font-semibold tracking-tight">
        {greeting()}, Amber
      </h1>
      <p className="text-muted-foreground">What are we wearing today?</p>
      <div className="flex gap-3">
        <Link to="/style" className={buttonVariants()}>
          Style Me
        </Link>
        <Link to="/saved" className={buttonVariants({ variant: "outline" })}>
          Saved looks
        </Link>
      </div>
    </div>
  );
}
