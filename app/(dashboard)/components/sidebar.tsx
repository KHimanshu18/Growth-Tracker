"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { getSidebarItems } from "@/lib/rbac";
import { LogoutButton } from "@/components/logout-button";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const items = user ? getSidebarItems(user.role) : [];

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r bg-background p-4">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Visitor CRM</h1>
        <p className="text-sm text-muted-foreground">Role based dashboard</p>
      </div>

      <Separator className="my-4" />

      <nav className="flex flex-1 flex-col gap-2">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "rounded-md px-3 py-2 text-sm transition-colors",
                active ?
                  "bg-primary text-primary-foreground"
                : "hover:bg-muted",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4">
        <LogoutButton />
      </div>

      <Separator className="my-4" />

      <div className="space-y-2">
        <div className="text-sm font-medium">{user?.name ?? "Guest"}</div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{user?.role ?? "Unknown"}</Badge>
        </div>
      </div>
    </aside>
  );
}
