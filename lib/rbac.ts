import type { AuthUser } from "@/types";

export type SidebarItem = {
  label: string;
  href: string;
};

export function getSidebarItems(role: AuthUser["role"]): SidebarItem[] {
  if (role === "ADMIN") {
    return [
      { label: "Overview", href: "/overview" },
      { label: "Add a visitor", href: "/add-visitor" },
      { label: "View all visitor", href: "/visitors" },
      { label: "Add follow ups", href: "/follow-ups" },
    ];
  }

  return [
    { label: "Overview", href: "/overview" },
    { label: "Personal details", href: "/personal-details" },
  ];
}

export function canAccessPath(role: AuthUser["role"], pathname: string) {
  if (pathname === "/") return true;
  if (pathname === "/login") return true;

  if (role === "ADMIN") return true;

  if (pathname === "/overview") return true;
  if (pathname === "/personal-details") return true;
  if (pathname.startsWith("/personal-details/")) return false;

  return false;
}

export function getRedirectForRole(role: AuthUser["role"]) {
  return role === "ADMIN" || role === "VISITOR" ? "/overview" : "/login";
}
