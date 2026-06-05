"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboardIcon,
  ListChecksIcon,
  BellIcon,
  Building2Icon,
  UsersIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboardIcon;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
  { label: "Tasks", href: "/tasks", icon: ListChecksIcon },
  { label: "Notifications", href: "/notifications", icon: BellIcon },
  { label: "Departments", href: "/departments", icon: Building2Icon },
  { label: "Users", href: "/users", icon: UsersIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col bg-slate-900 text-slate-100 md:flex">
      <div className="flex h-14 items-center gap-2 border-b border-slate-800 px-5">
        <div className="flex size-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
          A
        </div>
        <span className="text-sm font-semibold tracking-tight">AWOS</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-slate-800 text-white"
                  : "text-slate-300 hover:bg-slate-800/60 hover:text-white",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 px-5 py-3 text-xs text-slate-400">
        Internal Operations
      </div>
    </aside>
  );
}
