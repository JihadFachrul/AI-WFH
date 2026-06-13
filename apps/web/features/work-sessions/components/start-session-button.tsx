"use client";

import { PlayIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStartSession } from "@/hooks/use-work-sessions";

export function StartSessionButton() {
  const start = useStartSession();
  return (
    <Button size="sm" onClick={() => start.mutate()} disabled={start.isPending}>
      <PlayIcon className="size-4" />
      {start.isPending ? "Memulai…" : "Start Working"}
    </Button>
  );
}
