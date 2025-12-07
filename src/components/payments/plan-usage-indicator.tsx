"use client";

import { useCustomer } from "autumn-js/react";
import { useSession } from "@/lib/auth-client";
import { Loader2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const PlanUsageIndicator = () => {
  const { data: session } = useSession();
  const { customer, isLoading } = useCustomer();
  
  if (!session) return null;
  
  if (isLoading) {
    return (
      <div className="p-6 border border-border rounded-2xl bg-card">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }
  
  const planName = customer?.products?.at(-1)?.name || "Hotzy Basic";
  const features = Object.values(customer?.features || {});
  
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
          {planName}
        </span>
      </div>
      
      <div className="space-y-4">
        {features.length === 0 ? (
          <p className="text-sm text-muted-foreground">No usage limits on basic features</p>
        ) : (
          features.map((feature: any) => {
            const hasLimit = typeof feature.included_usage === 'number' && feature.included_usage < 999999;
            const usage = feature.usage || 0;
            const limit = feature.included_usage;
            const percentage = hasLimit ? Math.min(100, (usage / limit) * 100) : 0;
            
            // Skip features with unlimited usage (999999)
            if (!hasLimit) return null;
            
            return (
              <div key={feature.feature_id}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white font-medium">
                    {feature.feature_id === 'design_previews' && 'Design Previews'}
                    {feature.feature_id === 'design_saves' && 'Design Saves'}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {usage}/{limit}
                  </span>
                </div>
                
                <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-primary/20">
                  <div 
                    className={cn(
                      "h-2 rounded-full transition-all duration-500",
                      percentage > 90 ? "bg-destructive" : 
                      percentage > 75 ? "bg-yellow-500" : "bg-primary"
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                
                {feature.next_reset_at && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Resets {new Date(feature.next_reset_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
      
      <Link 
        href="/pricing"
        className="block w-full mt-4 text-sm text-center text-primary hover:text-[#9ACD32] transition-colors font-medium"
      >
        Manage Plan →
      </Link>
    </div>
  );
};
