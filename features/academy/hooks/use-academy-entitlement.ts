"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { SUPER_ADMIN_EMAILS } from "@/lib/permissions";

export type ProductSlug = "diagnostic" | "essencial" | "profissional" | "enterprise";

const PRODUCT_HIERARCHY: Record<ProductSlug, number> = {
  diagnostic: 0,
  essencial: 1,
  profissional: 2,
  enterprise: 3,
};

interface AcademyEntitlement {
  id: string;
  user_id: string;
  product_slug: ProductSlug;
  status: "active" | "expired" | "cancelled" | "trial";
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  starts_at: string;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

interface UseAcademyEntitlementResult {
  entitlement: AcademyEntitlement | null;
  product: ProductSlug;
  canAccessCourses: boolean;
  canAccessCertificates: boolean;
  isLoading: boolean;
}

// Supabase query builder cast — table added via migration 20260325_academy_entitlements.sql
// Types will be updated after running: pnpm supabase gen types typescript
interface SupabaseAny {
  from: (table: string) => {
    select: (cols: string) => {
      eq: (
        col: string,
        val: string,
      ) => {
        eq: (
          col: string,
          val: string,
        ) => {
          order: (
            col: string,
            opts: { ascending: boolean },
          ) => {
            limit: (n: number) => {
              maybeSingle: () => Promise<{
                data: AcademyEntitlement | null;
                error: { message: string } | null;
              }>;
            };
          };
        };
      };
    };
  };
}

const SUPER_ADMIN_ENTITLEMENT: AcademyEntitlement = {
  id: "super-admin",
  user_id: "super-admin",
  product_slug: "enterprise",
  status: "active",
  stripe_subscription_id: null,
  stripe_customer_id: null,
  starts_at: new Date(0).toISOString(),
  expires_at: null,
  created_at: new Date(0).toISOString(),
  updated_at: new Date(0).toISOString(),
};

async function fetchEntitlement(): Promise<AcademyEntitlement | null> {
  const supabase = createClient();

  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;

  // Super-admins always have enterprise access — no DB check needed
  const userEmail = session.session.user.email ?? "";
  if (SUPER_ADMIN_EMAILS.includes(userEmail)) {
    return { ...SUPER_ADMIN_ENTITLEMENT, user_id: session.session.user.id };
  }

  // Check preview mode (anonymous browsing after diagnostic)
  if (typeof window !== "undefined") {
    const isPreview = sessionStorage.getItem("academy_preview") === "true";
    if (isPreview) return null;
  }

  const { data, error } = await (supabase as unknown as SupabaseAny)
    .from("academy_entitlements")
    .select("*")
    .eq("user_id", session.session.user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export function useAcademyEntitlement(): UseAcademyEntitlementResult {
  const { data: entitlement, isLoading } = useQuery({
    queryKey: ["academy-entitlement"],
    queryFn: fetchEntitlement,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const product: ProductSlug = entitlement?.product_slug ?? "diagnostic";
  const tier = PRODUCT_HIERARCHY[product];

  return {
    entitlement: entitlement ?? null,
    product,
    canAccessCourses: tier >= PRODUCT_HIERARCHY.essencial,
    canAccessCertificates: tier >= PRODUCT_HIERARCHY.essencial,
    isLoading,
  };
}
