import { ServiceType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { NewServiceForm } from "@/components/new-service-form";
import { serviceTypeFromSlug } from "@/lib/services";

export const dynamic = "force-dynamic";

export default async function NewServicePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; plan?: string }>;
}) {
  const { type, plan } = await searchParams;
  const plans = await prisma.plan.findMany({
    where: { isActive: true },
    orderBy: [{ type: "asc" }, { priceCents: "asc" }],
  });

  const selectedPlan = plan ? plans.find((item) => item.id === plan) : undefined;
  const defaultType =
    selectedPlan?.type ??
    (type ? serviceTypeFromSlug(type) : null) ??
    ServiceType.MINECRAFT;

  return (
    <div className="max-w-4xl">
      <NewServiceForm
        plans={plans}
        defaultType={defaultType}
        defaultPlanId={selectedPlan?.id}
      />
    </div>
  );
}
