"use client";

import { SquareIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEndSession } from "@/hooks/use-work-sessions";

export function EndSessionButton() {
  const end = useEndSession();
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => end.mutate()}
      disabled={end.isPending}
    >
      <SquareIcon className="size-4" />
      {end.isPending ? "Mengakhiri…" : "End Working"}
    </Button>
  );
}
