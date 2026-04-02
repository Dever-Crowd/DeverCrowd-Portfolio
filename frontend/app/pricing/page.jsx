import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

async function fetchPlans() {
  const base =
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) || "http://localhost:3001";
  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/api/pricing`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data?.plans || [];
  } catch {
    return [];
  }
}

export default async function PricingPage() {
  const plans = await fetchPlans();

  return (
    <section className="relative px-4 py-16 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">Pricing</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Plans that scale with you
          </h1>
          <p className="mt-4 text-muted-foreground">
            Choose a starting point — we tailor every engagement to your goals. All plans are managed from the admin
            dashboard.
          </p>
        </header>

        {plans.length === 0 ? (
          <div className="mx-auto mt-16 max-w-lg rounded-2xl border border-dashed border-border bg-card/50 px-8 py-14 text-center">
            <p className="font-medium text-foreground">Plans coming soon</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Our team hasn&apos;t published pricing yet.{" "}
              <Link href="/contact" className="text-primary underline-offset-4 hover:underline">
                Contact us
              </Link>{" "}
              for a custom quote.
            </p>
          </div>
        ) : (
          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan._id || plan.slug}
                className={cn(
                  "flex flex-col rounded-2xl border border-border bg-card p-8 shadow-sm transition hover:shadow-md",
                  plan.highlighted && "ring-2 ring-primary lg:scale-[1.02]"
                )}
              >
                {plan.highlighted ? (
                  <span className="mb-4 inline-flex w-fit rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
                    Popular
                  </span>
                ) : (
                  <span className="mb-4 h-6" aria-hidden />
                )}
                <h2 className="text-xl font-semibold text-foreground">{plan.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                <p className="mt-6 text-4xl font-bold text-foreground">
                  {plan.currency} {plan.priceMonthly}
                  <span className="text-base font-normal text-muted-foreground">/mo</span>
                </p>
                <ul className="mt-8 flex flex-1 flex-col gap-3 text-sm text-muted-foreground">
                  {(plan.features || []).map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button className="mt-8 w-full" asChild>
                  <Link href="/contact">Get started</Link>
                </Button>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
