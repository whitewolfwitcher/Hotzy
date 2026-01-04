import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center text-muted-foreground">
          Loading checkout...
        </div>
      }
    >
      <CheckoutClient />
    </Suspense>
  );
}
