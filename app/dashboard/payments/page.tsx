import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { payments, customers } from "@/lib/db/schema";
import PaymentsClient from "./client";

export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  const session = await getAuthSession();
  if (!session) {
    // SSR redirect to auth
    return (
      <div className="py-10 text-center">
        <h2 className="text-lg font-semibold">StripeForge</h2>
        <p className="text-muted-foreground">You must be signed in to view payments.</p>
      </div>
    );
  }

  // Demo: select the first merchant account for now (to be replaced with per-user selection)
  const merchantAccountMember = await db.query.merchantAccountMembers.findFirst({
    where: (m) => m.userId === session.userId,
  });
  if (!merchantAccountMember) {
    return (
      <div className="py-10 text-center">
        <h2 className="text-lg font-semibold">StripeForge</h2>
        <p className="text-muted-foreground">
          You have no merchant accounts. Create one to start accepting payments.
        </p>
      </div>
    );
  }

  // Get all payments for the current merchant account (limit for demo)
  const paymentRows = await db
    .select()
    .from(payments)
    .where((p) => p.merchantAccountId === merchantAccountMember.merchantAccountId)
    .orderBy((p) => p.createdAt.desc())
    .limit(50);

  // Fetch customers for selection in "Create Payment"
  const customerRows = await db
    .select()
    .from(customers)
    .where((c) => c.merchantAccountId === merchantAccountMember.merchantAccountId)
    .orderBy((c) => c.createdAt.desc())
    .limit(100);

  return (
    <div className="h-full w-full px-4 py-8 md:px-8 md:py-8 max-w-6xl mx-auto">
      <PaymentsClient
        session={session}
        merchantAccountId={merchantAccountMember.merchantAccountId}
        payments={paymentRows}
        customers={customerRows}
        canCreate={["owner", "admin"].includes(merchantAccountMember.role)}
      />
    </div>
  );
}