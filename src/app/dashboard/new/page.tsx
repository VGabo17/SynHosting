import { ServiceType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { NewServiceForm } from "@/components/new-service-form";
import { serviceTypeFromSlug } from "@/lib/services";

export const dynamic = "force-dynamic";

export default async function NewServicePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const plans = await prisma.plan.findMany({
    where: { isActive: true },
    orderBy: [{ type: "asc" }, { priceCents: "asc" }],
  });

  return (
    <div className="max-w-4xl">
      <NewServiceForm
        plans={plans}
        defaultType={
          (type ? serviceTypeFromSlug(type) : null) ?? ServiceType.MINECRAFT
        }
      />
    </div>
  );
}
