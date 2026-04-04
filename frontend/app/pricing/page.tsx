"use client";

import { PricingPlan, usePublicPricingPlans } from "@/hooks/usePricing";
import { Check, Star, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Link from "next/link";
import { useLenis } from "@/hooks/useLenis";

function PlanCard({ plan, index }: { plan: PricingPlan; index: number }) {
  const hasDiscount = plan.discountPercent && plan.discountPercent > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
      className={cn(
        "relative flex flex-col rounded-2xl border border-border bg-card p-7 overflow-visible",
        plan.highlighted && "border-primary/40 shadow-[0_0_0_1px_rgba(56,101,248,0.2)]"
      )}
    >
      {/* Most Popular badge */}
      {plan.highlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold text-white"
            style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))" }}>
            <Star style={{ width: 10, height: 10, fill: "white" }} />
            Most Popular
          </span>
        </div>
      )}

      {/* Discount ribbon */}
      {hasDiscount && (
        <div className="absolute top-4 -right-0.5 z-10">
          <div className="relative">
            <div className="rounded-l-xl px-3 py-1 text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg, #e53e3e, #c53030)" }}>
              {plan.discountPercent}% off
            </div>
            <div className="absolute -bottom-2 right-0 w-0 h-0"
              style={{ borderLeft: "4px solid #9b2c2c", borderBottom: "4px solid transparent" }} />
          </div>
        </div>
      )}

      {/* Title & description */}
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-foreground">{plan.title}</h3>
        {plan.description && (
          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{plan.description}</p>
        )}
      </div>

      {/* Price */}
      <div className="mb-2">
        {hasDiscount ? (
          <>
            <p className="text-sm text-muted-foreground line-through mb-1">
              {plan.currency} {plan.originalPrice}
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-foreground">
                {plan.currency} {plan.realPrice ?? plan.originalPrice}
              </span>
            </div>
          </>
        ) : (
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-foreground">
              {plan.originalPrice === 0 ? "Free" : `${plan.currency} ${plan.realPrice ?? plan.originalPrice}`}
            </span>
          </div>
        )}
      </div>

      {/* Billing cycle badge */}
      <div className="mb-5">
        <span className="inline-block text-xs text-muted-foreground border border-border rounded-full px-2.5 py-0.5">
          {plan.billingCycle === "monthly" && "Billed monthly"}
          {plan.billingCycle === "yearly" && "Billed yearly"}
          {plan.billingCycle === "one-time" && "One-time payment"}
        </span>
      </div>

      {/* Divider */}
      <div className="h-px bg-border mb-5" />

      {/* Features */}
      {plan.features.length > 0 && (
        <ul className="mb-7 flex-1 space-y-3">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                style={{ background: "rgba(56,101,248,0.12)" }}>
                <Check style={{ width: 9, height: 9, color: "var(--primary)", strokeWidth: 2.5 }} />
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}

      {/* CTA */}
      <Link
        href="/contact"
        className={cn(
          "mt-auto block w-full rounded-xl px-4 py-2.5 text-center text-sm font-semibold transition-all duration-200",
          plan.highlighted
            ? "text-white hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(146,56,248,0.35)]"
            : "border border-border bg-background text-foreground hover:bg-muted"
        )}
        style={plan.highlighted ? {
          background: "linear-gradient(135deg, var(--primary), var(--accent))",
          boxShadow: "0 2px 12px rgba(146,56,248,0.25)"
        } : {}}
      >
        Get started
      </Link>
    </motion.div>
  );
}

export default function PricingPage() {
  useLenis();
  const { data: plans = [], isLoading, isError } = usePublicPricingPlans();

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      {/* Header */}
      <motion.div
        className="mb-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Simple,{" "}
          <span style={{
            background: "linear-gradient(135deg, var(--primary), var(--accent))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            transparent
          </span>{" "}
          pricing
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Choose the plan that works for you. No hidden fees.
        </p>
      </motion.div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading plans…
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="flex items-center justify-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Failed to load pricing plans. Please try again later.
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && plans.length === 0 && (
        <p className="py-20 text-center text-muted-foreground">
          No pricing plans available yet.
        </p>
      )}

      {/* Plans grid */}
      {!isLoading && !isError && plans.length > 0 && (
        <div className={cn(
          "grid gap-8 pt-6",
          plans.length === 1 && "mx-auto max-w-sm",
          plans.length === 2 && "sm:grid-cols-2",
          plans.length >= 3 && "sm:grid-cols-2 lg:grid-cols-3"
        )}>
          {plans.map((plan, index) => (
            <PlanCard key={plan._id} plan={plan} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}