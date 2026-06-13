"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboardIcon,
  KanbanSquareIcon,
  ListChecksIcon,
  CalendarClockIcon,
  CalendarRangeIcon,
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
  { label: "Kanban", href: "/kanban", icon: KanbanSquareIcon },
  { label: "Tasks", href: "/tasks", icon: ListChecksIcon },
  { label: "Meetings", href: "/meetings", icon: CalendarClockIcon },
  { label: "Calendar", href: "/calendar", icon: CalendarRangeIcon },
  { label: "Notifications", href: "/notifications", icon: BellIcon },
  { label: "Departments", href: "/departments", icon: Building2Icon },
  { label: "Users", href: "/users", icon: UsersIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-card md:flex">
      <div className="flex h-16 items-center gap-3 px-5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary font-display text-base font-bold text-primary-foreground shadow-sm shadow-primary/30">
          A
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-display text-base font-bold tracking-tight text-foreground">
            AWOS
          </span>
          <span className="mt-1 text-[11px] font-medium text-muted-foreground">
            Workforce OS
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-primary" />
              )}
              <Icon
                className={cn(
                  "size-4 transition-colors",
                  active
                    ? "text-secondary-foreground"
                    : "text-muted-foreground/80 group-hover:text-foreground",
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mx-3 mb-4 rounded-xl border border-border bg-muted/50 px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Internal Operations
        </p>
        <p className="mt-0.5 text-[11px] text-muted-foreground/80">
          Work From Anywhere, accountable.
        </p>
      </div>
    </aside>
  );
}
