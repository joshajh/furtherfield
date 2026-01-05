"use client";

import { useTransition } from "react";

export function DeletePersonButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this person?")) return;

    startTransition(async () => {
      await fetch(`/api/admin/people/${id}`, { method: "DELETE" });
      window.location.reload();
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="admin-link admin-link-danger disabled:opacity-50"
    >
      {isPending ? "..." : "Delete"}
    </button>
  );
}
