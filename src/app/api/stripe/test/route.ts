// src/app/api/stripe/test/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

// Force this route to be dynamic (never statically exported)
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const account = await stripe.accounts.retrieve();

    return NextResponse.json(
      {
        ok: true,
        account: {
          id: account.id,
          email: (account as any).email ?? null,
          business_type: (account as any).business_type ?? null,
          default_currency: (account as any).default_currency ?? null,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Stripe test endpoint error:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Failed to connect to Stripe",
        error: error?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
