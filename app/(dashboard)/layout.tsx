import { MainArea } from "./components/main-area";
import { Sidebar } from "./components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />
      <MainArea>{children}</MainArea>
    </div>
  );
}
