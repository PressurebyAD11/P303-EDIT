import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/state/authStore";
import BottomNav from "./BottomNav";

export default function Layout() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return (
    <>
      <main className="pb-16 min-h-svh">
        <Outlet />
      </main>
      <BottomNav />
    </>
  );
}
