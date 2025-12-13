"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  CreditCard,
  Shield,
  Truck,
  Check,
  ArrowLeft,
  Lock,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCart } from "@/contexts/cart-context";

import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Load Stripe using your publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type ShippingInfo = {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string; // keep name for now; can be postal code in UI
  country: string; // user input; we map to ISO for Stripe
};

function normalizeCountryToISO2(input: string): string | undefined {
  const v = (input || "").trim().toLowerCase();
  if (!v) return undefined;

  // Common cases
  if (v === "ca" || v.includes("canada")) return "CA";
  if (v === "us" || v.includes("united states") || v.includes("usa")) return "US";

  // If user already typed ISO2, accept it
  if (v.length === 2) return v.toUpperCase();

  // Unknown free-text country: omit (Stripe will still process the payment)
  return undefined;
}

function CheckoutPageInner() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } =
    useCart();

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Canada",
  });

  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const subtotal = getTotalPrice();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const countryISO2 = useMemo(
    () => normalizeCountryToISO2(shippingInfo.country),
    [shippingInfo.country]
  );

  const handleQuantityChange = (id: string, change: number) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      updateQuantity(id, item.quantity + change);
    }
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
  };

  const handleCheckout = async () => {
    if (!stripe || !elements) {
      toast.error("Payment system is not ready. Please try again in a moment.");
      return;
    }

    // Validate shipping info
    const requiredFields: (keyof ShippingInfo)[] = [
      "fullName",
      "email",
      "address",
      "city",
      "state",
      "zipCode",
      "country",
    ];

    const missingFields = requiredFields.filter((field) => !shippingInfo[field]);

    if (missingFields.length > 0) {
      toast.error("Please fill in all shipping information");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error("Payment form is not ready. Please reload the page.");
      return;
    }

    try {
      setProcessing(true);
      toast.success("Processing your payment...");

      // 1) Create PaymentIntent on the server
      const res = await fetch("/api/checkout/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
          })),
          shippingInfo,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok || !data.clientSecret) {
        console.error("PaymentIntent error:", data);
        toast.error(
          data?.message || "Failed to start secure payment. Please try again."
        );
        return;
      }

      const clientSecret = data.clientSecret as string;

      // 2) Confirm the card payment with Stripe
      // IMPORTANT:
      // - We hide Stripe's built-in postal/zip field (numeric-only)
      // - We send your own postal code here, which supports letters (e.g., M5V 2T6)
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: shippingInfo.fullName,
            email: shippingInfo.email,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              postal_code: shippingInfo.zipCode,
              country: countryISO2, // "CA" / "US" (or undefined)
            },
          },
        },
      });

      if (result.error) {
        console.error("Payment error:", result.error);
        toast.error(result.error.message || "Payment failed. Please try again.");
        return;
      }

      if (result.paymentIntent?.status === "succeeded") {
        toast.success("Order placed successfully!");
        clearCart();
        router.push("/checkout/success");
      } else {
        toast.error("Payment was not completed. Please try again.");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-border bg-[#0a0a0a]">
        <div className="container py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Secure Checkout
            </h1>
            <p className="text-muted-foreground">
              Complete your order with confidence
            </p>
          </motion.div>

          {items.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Your cart is empty
              </h2>
              <p className="text-muted-foreground mb-6">
                Add some mugs to get started!
              </p>
              <Link
                href="/#design-gallery"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-[#9ACD32] transition-all"
              >
                Browse Designs
              </Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Shipping & Payment */}
              <div className="lg:col-span-2 space-y-6">
                {/* Shipping Information */}
                <motion.div
                  className="bg-gradient-to-br from-[#1A1A1A] to-black border border-primary/20 rounded-2xl p-6"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Truck className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      Shipping Information
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.fullName}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            fullName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-black border border-border rounded-lg text-white focus:border-primary focus:outline-none"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-black border border-border rounded-lg text-white focus:border-primary focus:outline-none"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.address}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            address: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-black border border-border rounded-lg text-white focus:border-primary focus:outline-none"
                        placeholder="123 Main St"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.city}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            city: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-black border border-border rounded-lg text-white focus:border-primary focus:outline-none"
                        placeholder="Toronto"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        State / Province
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.state}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            state: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-black border border-border rounded-lg text-white focus:border-primary focus:outline-none"
                        placeholder="ON"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.zipCode}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            zipCode: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-black border border-border rounded-lg text-white focus:border-primary focus:outline-none"
                        placeholder="M5V 2T6"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.country}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            country: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-black border border-border rounded-lg text-white focus:border-primary focus:outline-none"
                        placeholder="Canada"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Payment Method */}
                <motion.div
                  className="bg-gradient-to-br from-[#1A1A1A] to-black border border-primary/20 rounded-2xl p-6"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      Payment Method
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 border border-primary rounded-lg">
                      <div className="flex-1">
                        <div className="font-semibold text-white">
                          Credit/Debit Card
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Secure payment via Stripe
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {["Visa", "MC", "Amex"].map((card) => (
                          <div
                            key={card}
                            className="px-2 py-1 bg-card border border-border rounded text-xs text-white"
                          >
                            {card}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stripe CardElement lives here */}
                    <div className="p-4 bg-black border border-border rounded-lg">
                      <CardElement
                        options={{
                          hidePostalCode: true, // IMPORTANT: allow alphanumeric postal codes via your own input
                          style: {
                            base: {
                              fontSize: "16px",
                              color: "#ffffff",
                              "::placeholder": { color: "#888888" },
                            },
                            invalid: {
                              color: "#ff4d4f",
                            },
                          },
                        }}
                      />
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Your card details are encrypted and processed securely by
                      Stripe. We do not store your card information.
                    </p>
                  </div>
                </motion.div>

                {/* Trust Badges */}
                <motion.div
                  className="grid sm:grid-cols-3 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {[
                    { icon: Shield, text: "SSL Secured" },
                    { icon: Lock, text: "Encrypted Payment" },
                    { icon: Check, text: "Money-Back Guarantee" },
                  ].map((badge, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg"
                    >
                      <badge.icon className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium text-white">
                        {badge.text}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Right Column - Order Summary */}
              <motion.div
                className="lg:col-span-1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="sticky top-24 bg-gradient-to-br from-[#1A1A1A] to-black border border-primary/20 rounded-2xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Order Summary
                  </h2>

                  {/* Cart Items */}
                  <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 pb-4 border-b border-border"
                      >
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.thumbnail}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white text-sm truncate">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => handleQuantityChange(item.id, -1)}
                              className="w-6 h-6 bg-card border border-border rounded flex items-center justify-center hover:border-primary transition-colors"
                            >
                              -
                            </button>
                            <span className="text-white font-mono">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, 1)}
                              className="w-6 h-6 bg-card border border-border rounded flex items-center justify-center hover:border-primary transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-primary">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-xs text-destructive hover:underline mt-1"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6 pt-4 border-t border-border">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span>
                        {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-white pt-3 border-t border-border">
                      <span>Total</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={items.length === 0 || processing}
                    className="w-full bg-gradient-to-r from-primary via-[#9ACD32] to-primary text-primary-foreground font-bold py-4 rounded-xl hover:shadow-[0_0_30px_rgba(118,185,0,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Lock className="w-5 h-5" />
                    {processing ? "Processing..." : "Complete Order"}
                  </button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    By completing your purchase, you agree to our Terms of
                    Service
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Wrap the inner component with Stripe Elements provider
export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutPageInner />
    </Elements>
  );
}
