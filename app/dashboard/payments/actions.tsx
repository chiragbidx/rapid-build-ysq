"use server";

import { z } from "zod";
import { db } from "@/lib/db/client";
import { payments, activityLogs } from "@/lib/db/schema";
import { createId } from "@/lib/utils";
import { getAuthSession } from "@/lib/auth/session";

// Payment creation schema/validation
const createPaymentSchema = z.object({
  merchantAccountId: z.string().min(1),
  customerId: z.string().min(1),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/).refine((val) => parseFloat(val) > 0, {
    message: "Amount must be positive.",
  }),
  currency: z.string().min(1),
  description: z.string().optional(),
});

export async function createPaymentAction(input: any) {
  const session = await getAuthSession();
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  const parsed = createPaymentSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0].message };
  }

  const { merchantAccountId, customerId, amount, currency, description } = parsed.data;

  // Simulate processing: insert payment, initial status 'succeeded'
  const paymentId = createId();

  await db.insert(payments).values({
    id: paymentId,
    merchantAccountId,
    customerId,
    amount,
    currency,
    status: "succeeded",
    captured: true,
    refundedAmount: "0.00",
    description: description || null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Log activity
  await db.insert(activityLogs).values({
    id: createId(),
    merchantAccountId,
    userId: session.userId,
    entity: "payment",
    entityId: paymentId,
    action: "created",
    metadata: {},
    createdAt: new Date(),
  });

  const paymentRow = await db.query.payments.findFirst({
    where: (p) => p.id === paymentId,
  });

  return {
    success: true,
    payment: paymentRow,
  };
}

export async function refundPaymentAction(paymentId: string) {
  const session = await getAuthSession();
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  // Only allow refund for succeeded payment
  const payment = await db.query.payments.findFirst({ where: (p) => p.id === paymentId });
  if (!payment) {
    return { success: false, message: "Payment not found" };
  }
  if (payment.status !== "succeeded" || payment.refundedAmount !== "0.00") {
    return { success: false, message: "Payment already refunded or not eligible" };
  }

  await db
    .update(payments)
    .set({
      status: "refunded",
      refundedAmount: payment.amount,
      updatedAt: new Date(),
    })
    .where((p) => p.id === paymentId);

  // Log refund activity
  await db.insert(activityLogs).values({
    id: createId(),
    merchantAccountId: payment.merchantAccountId,
    userId: session.userId,
    entity: "payment",
    entityId: paymentId,
    action: "refunded",
    metadata: {},
    createdAt: new Date(),
  });

  return { success: true };
}