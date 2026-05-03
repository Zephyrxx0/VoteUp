"use client";

import { Button } from "@/components/ui/button";

interface MergeConflictDialogProps {
  open: boolean;
  localConstituency: string;
  cloudConstituency: string;
  onChoose: (choice: "keep-cloud" | "overwrite-local") => void;
}

export function MergeConflictDialog({
  open,
  localConstituency,
  cloudConstituency,
  onChoose,
}: MergeConflictDialogProps) {
  if (!open) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-label="Merge conflict"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
    >
      <div className="w-full max-w-md rounded-xl border bg-background p-5 shadow-xl">
        <h2 className="text-lg font-semibold">Constituency mismatch detected</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your local progress belongs to <strong>{localConstituency}</strong>, but cloud data belongs to{" "}
          <strong>{cloudConstituency}</strong>.
        </p>
        <div className="mt-4 flex gap-2">
          <Button variant="outline" onClick={() => onChoose("keep-cloud")}>Keep Cloud Data</Button>
          <Button onClick={() => onChoose("overwrite-local")}>Overwrite with Local Progress</Button>
        </div>
      </div>
    </div>
  );
}
