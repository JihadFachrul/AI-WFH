"use client";

import { useRouter } from "next/navigation";
import { LogOutIcon, SearchIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { NotificationDropdown } from "@/components/notifications/notification-dropdown";
import { useAuthStore } from "@/stores/auth.store";
import { useLogout } from "@/hooks/use-auth";
import { useNotificationRealtime } from "@/hooks/use-notification-realtime";

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Header() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  // Realtime notifikasi app-wide: badge & list ter-update otomatis.
  useNotificationRealtime();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border bg-card/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex max-w-sm flex-1 items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-muted-foreground focus-within:border-primary/40 focus-within:bg-card">
        <SearchIcon className="size-4 shrink-0" />
        <input
          type="search"
          placeholder="Cari di AWOS…"
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          aria-label="Cari"
        />
      </div>

      <div className="flex items-center gap-1">
        <NotificationDropdown />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-auto gap-2.5 px-2 py-1.5">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {user ? initials(user.name) : "?"}
              </span>
              <span className="hidden flex-col items-start leading-tight sm:flex">
                <span className="text-sm font-semibold text-foreground">
                  {user?.name ?? "User"}
                </span>
                <span className="text-[11px] font-medium text-muted-foreground">
                  {user?.role ?? "—"}
                </span>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.name}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {user?.email}
                </span>
                <span className="mt-1 w-fit rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-secondary-foreground">
                  {user?.role}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
              <LogOutIcon className="size-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
