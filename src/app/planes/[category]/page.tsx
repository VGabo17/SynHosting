import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PlanCard } from "@/components/plan-card";
import { SiteHeader } from "@/components/site-header";
import { PLAN_CATEGORIES, planCategoryFromSlug } from "@/lib/services";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return PLAN_CATEGORIES.map((category) => ({ category: category.slug }));
}

export default async function PlanCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = planCategoryFromSlug(slug);

  if (!category) {
    notFound();
  }

  const [session, plans] = await Promise.all([
    auth(),
    prisma.plan.findMany({
      where: {
        isActive: true,
        type: category.type,
        ...(category.tier ? { tier: category.tier } : {}),
      },
      orderBy: { priceCents: "asc" },
    }),
  ]);

  return (
    <div className="glow-grid min-h-screen">
      <SiteHeader isAuthenticated={Boolean(session?.user)} />

      <main className="mx-auto max-w-6xl px-6 py-16">
        <nav className="flex flex-wrap gap-2 text-sm">
          {PLAN_CATEGORIES.map((item) => (
            <Link
              key={item.slug}
              href={`/planes/${item.slug}`}
              className={`rounded-full px-4 py-1.5 transition ${
                item.slug === category.slug
                  ? "bg-gradient-to-r from-cyan-400 to-violet-500 font-semibold text-slate-950"
                  : "border border-white/10 text-slate-300 hover:bg-white/5"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <h1 className="mt-10 text-4xl font-bold tracking-tight">
          {category.title}
        </h1>
        <p className="mt-3 max-w-2xl text-slate-400">{category.description}</p>

        {plans.length === 0 ? (
          <p className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-slate-400">
            Todavía no hay planes publicados en esta categoría.
          </p>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {plans.map((plan, index) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                highlighted={plans.length > 1 && index === plans.length - 1}
                href={
                  session?.user
                    ? `/dashboard/new?type=${category.type}&plan=${plan.id}`
                    : "/register"
                }
                ctaLabel={session?.user ? "Desplegar ahora" : "Contratar"}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
