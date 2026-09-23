-- CreateEnum
CREATE TYPE "public"."PlanTier" AS ENUM ('BUDGET', 'PREMIUM');

-- AlterTable
ALTER TABLE "public"."Plan" ADD COLUMN     "tier" "public"."PlanTier" NOT NULL DEFAULT 'BUDGET';
