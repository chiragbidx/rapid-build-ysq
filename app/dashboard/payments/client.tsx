"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { createPaymentAction, refundPaymentAction } from "./actions";
import TransactionTable from "@/components/dashboard/transaction-table";
import { useState } from "react";
import { toast } from "sonner";

type Session = {
  userId: string;
  email: string;
};

type Payment = {
  id: string;
  customerId: string;
  amount: string;
  currency: string;
  status: string;
  source: string | null;
  reference: string | null;
  captured: boolean;
  refundedAmount: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

type Customer = {
  id: string;
  name: string;
  email: string;
};

type Props = {
  session: Session;
  merchantAccountId: string;
  payments: Payment[];
  customers: Customer[];
  canCreate: boolean;
};

export default function PaymentsClient({
  session,
  merchantAccountId,
  payments: initialPayments,
  customers,
  canCreate,
}: Props) {
  const [open, setOpen] = useState(false);
  const [payments, setPayments] = useState(initialPayments);
  const [loading, setLoading] = useState(false);

  function handlePaymentCreated(p: Payment) {
    setOpen(false);
    setPayments([p, ...payments]);
    toast.success("Payment created.");
  }

  async function handleRefund(paymentId: string) {
    setLoading(true);
    const result = await refundPaymentAction(paymentId);
    setLoading(false);
    if (result && result.success) {
      setPayments(
        payments.map((p) =>
          p.id === paymentId
            ? { ...p, refundedAmount: p.amount, status: "refunded" }
            : p
        )
      );
      toast.success("Payment refunded.");
    } else {
      toast.error("Failed to refund payment.");
    }
  }

  return (
    <div className="w-full space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Payments <span className="text-primary">| StripeForge</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            View and manage your payment transactions.
          </p>
        </div>
        {canCreate && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Create Payment</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Payment</DialogTitle>
                <DialogDescription>
                  Enter details to simulate a payment for this merchant account.
                </DialogDescription>
              </DialogHeader>
              <CreatePaymentForm
                merchantAccountId={merchantAccountId}
                customers={customers}
                onComplete={handlePaymentCreated}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div>
        <TransactionTable
          payments={payments}
          customers={customers}
          onRefund={canCreate ? handleRefund : undefined}
          loading={loading}
        />
      </div>
    </div>
  );
}

function CreatePaymentForm({
  merchantAccountId,
  customers,
  onComplete,
}: {
  merchantAccountId: string;
  customers: Customer[];
  onComplete: (payment: any) => void;
}) {
  const form = useForm<{ customerId: string; amount: string; currency: string; description: string }>({
    defaultValues: {
      customerId: "",
      amount: "",
      currency: "usd",
      description: "",
    },
  });
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(values: { customerId: string; amount: string; currency: string; description: string }) {
    setSubmitting(true);
    const result = await createPaymentAction({
      ...values,
      merchantAccountId,
    });
    setSubmitting(false);
    if (result && result.success) {
      onComplete(result.payment);
      form.reset();
    } else {
      toast.error(result?.message || "Failed to create payment.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        autoComplete="off"
      >
        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.length === 0 ? (
                    <SelectItem value="" disabled>
                      No customers found
                    </SelectItem>
                  ) : (
                    customers.map((c) => (
                      <SelectItem value={c.id} key={c.id}>
                        {c.name} ({c.email})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="Amount in dollars"
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD</SelectItem>
                  <SelectItem value="eur">EUR</SelectItem>
                  <SelectItem value="gbp">GBP</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Payment description"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Processing..." : "Simulate Payment"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}