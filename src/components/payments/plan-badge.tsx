"use client";

import { useCustomer } from "autumn-js/react";
import { useSession } from "@/lib/auth-client";
import { Crown, Loader2 } from "lucide-react";
import Link from "next/link";

export const PlanBadge = () => {
  const { data: session } = useSession();
  const { customer, isLoading } = useCustomer();
  
  if (!session) return null;
  
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-full">
        <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  const currentPlan = customer?.products?.at(-1);
  const planName = currentPlan?.name || "Hotzy Basic";
  const isPremium = currentPlan?.id === "hotzy_premium";
  const isPro = currentPlan?.id === "hotzy_pro";
  
  return (
    <Link href="/pricing" className="group">
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
        isPremium
          ? "bg-gradient-to-r from-primary/20 to-[#9ACD32]/20 border-primary/50 hover:border-primary"
          : isPro
          ? "bg-primary/10 border-primary/30 hover:border-primary/50"
          : "bg-card border-border hover:border-primary/30"
      }`}>
        {(isPremium || isPro) && (
          <Crown className={`w-3.5 h-3.5 ${isPremium ? "text-primary" : "text-primary/80"}`} />
        )}
        <span className={`text-xs font-semibold ${
          isPremium || isPro ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
        }`}>
          {planName}
        </span>
      </div>
    </Link>
  );
};
