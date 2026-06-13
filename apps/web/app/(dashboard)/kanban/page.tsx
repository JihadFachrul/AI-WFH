"use client";

import { PageHeader } from "@/components/shared/page-header";
import { KanbanBoard } from "@/features/kanban/components/kanban-board";

export default function KanbanPage() {
  return (
    <div>
      <PageHeader
        title="Kanban Workspace"
        description="Pandangan visual task per status. Geser kartu untuk mengubah status."
      />
      <KanbanBoard />
    </div>
  );
}
