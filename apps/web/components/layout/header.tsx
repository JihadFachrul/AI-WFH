"use client";

import { useRouter } from "next/navigation";
import { LogOutIcon } from "lucide-react";
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
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4 md:px-6">
      <div className="text-sm font-medium text-muted-foreground">
        Workspace
      </div>

      <div className="flex items-center gap-1">
        <NotificationDropdown />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2">
              <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {user ? initials(user.name) : "?"}
              </span>
              <span className="hidden text-sm font-medium sm:inline">
                {user?.name ?? "User"}
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
