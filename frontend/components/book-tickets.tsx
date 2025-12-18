"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Elements,
  useElements,
  useStripe,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { bookingAPI, paymentAPI } from "@/lib/api";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

type Props = {
  eventId: string;
  maxTickets: number;
  price: number;
};

function BookTicketsForm({ eventId, maxTickets, price }: Props) {
  const [count, setCount] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [idempotencyKey, setIdempotencyKey] = useState<string | null>(null);
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const generateIdempotencyKey = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!stripe || !elements) return;
    if (count < 1) {
      setError("Please select at least 1 ticket.");
      return;
    }

    if (maxTickets === 0) {
      setError("Sold out");
      return;
    }

    setLoading(true);
    try {
      // Create intent if not already
      let secret = clientSecret;
      let intentId = paymentIntentId;
      if (!secret) {
        const key = idempotencyKey || generateIdempotencyKey();
        const intentRes = await paymentAPI.createIntent({ eventId, numberOfTickets: count, idempotencyKey: key });
        secret = intentRes.data.data.clientSecret;
        intentId = intentRes.data.data.paymentIntentId;
        setClientSecret(secret);
        setPaymentIntentId(intentId);
        setIdempotencyKey(key);
      }

      if (!secret || !intentId) {
        throw new Error("Payment intent not available");
      }

      const cardNumber = elements.getElement(CardNumberElement);
      if (!cardNumber) {
        setError("Payment form is not ready.");
        return;
      }

      const confirmation = await stripe.confirmCardPayment(secret, {
        payment_method: { card: cardNumber },
      });

      if (confirmation.error) {
        setError(confirmation.error.message || "Payment failed");
        return;
      }

      if (confirmation.paymentIntent?.status === "succeeded") {
        await bookingAPI.create({
          eventId,
          numberOfTickets: count,
          paymentIntentId: confirmation.paymentIntent.id,
        });
        router.push("/bookings");
        router.refresh();
      } else {
        setError("Payment not completed.");
      }
    } catch (err: any) {
      if (err?.response?.status === 401) {
        router.push(`/login?callbackUrl=/events/${eventId}`);
        return;
      }
      setError(err?.response?.data?.error || err?.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="space-y-2">
        <div>
          <p className="text-sm font-medium text-gray-700">Tickets</p>
          <p className="text-xs text-gray-500">Available: {maxTickets}</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setCount((c) => Math.max(1, c - 1))}
            className="h-10 rounded-lg border border-gray-200 text-lg font-semibold text-gray-700 hover:bg-gray-50"
            disabled={count <= 1}
          >
            –
          </button>
          <input
            type="number"
            min={1}
            max={maxTickets}
            value={count}
            onChange={(e) => setCount(Math.min(maxTickets, Math.max(1, Number(e.target.value))))}
            className="h-10 rounded-lg border border-gray-200 text-center text-sm"
          />
          <button
            type="button"
            onClick={() => setCount((c) => Math.min(maxTickets, c + 1))}
            className="h-10 rounded-lg border border-gray-200 text-lg font-semibold text-gray-700 hover:bg-gray-50"
            disabled={count >= maxTickets}
          >
            +
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-700">
        <span>Total</span>
        <span className="text-lg font-semibold text-purple-700">${(price * count).toFixed(2)}</span>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">Payment</p>
        <div className="space-y-2">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <CardNumberElement
              options={{
                placeholder: "Card number",
                style: { base: { fontSize: "16px", color: "#111827" } },
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <CardExpiryElement
                options={{
                  placeholder: "MM / YY",
                  style: { base: { fontSize: "16px", color: "#111827" } },
                }}
              />
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <CardCvcElement
                options={{
                  placeholder: "CVC",
                  style: { base: { fontSize: "16px", color: "#111827" } },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading || maxTickets === 0 || !stripe}
        className="w-full rounded-lg bg-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {loading ? "Processing..." : maxTickets === 0 ? "Sold out" : "Pay & book"}
      </button>
    </form>
  );
}

export function BookTickets(props: Props) {
  if (!stripePromise) {
    return <p className="text-sm text-red-600">Payment is not available right now.</p>;
  }

  return (
    <Elements stripe={stripePromise}>
      <BookTicketsForm {...props} />
    </Elements>
  );
}
