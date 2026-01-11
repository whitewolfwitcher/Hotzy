"use client";

import { useSession } from "@/lib/auth-client";
import Link from "next/link";

export const PlanBadge = () => {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <Link href="/pricing" className="group">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all bg-card border-border hover:border-primary/30">
        <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground">
          Hotzy Basic
        </span>
      </div>
    </Link>
  );
};
