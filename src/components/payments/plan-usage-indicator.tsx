"use client";

import { useSession } from "@/lib/auth-client";
import { TrendingUp } from "lucide-react";
import Link from "next/link";

export const PlanUsageIndicator = () => {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <div className="p-6 border border-primary/20 rounded-2xl bg-gradient-to-br from-card to-black shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-bold text-white">Your Plan</h3>
        </div>
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/30">
          Hotzy Basic
        </span>
      </div>

      <p className="text-sm text-muted-foreground">
        Usage limits are currently unavailable.
      </p>

      <Link
        href="/pricing"
        className="block w-full mt-4 text-sm text-center text-primary hover:text-[#9ACD32] transition-colors font-medium"
      >
        Manage Plan ƒÅ'
      </Link>
    </div>
  );
};
