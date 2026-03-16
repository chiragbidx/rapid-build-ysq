"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

type Payment = {
  id: string;
  customerId: string;
  amount: string;
  currency: string;
  status: string;
  refundedAmount: string;
  description: string | null;
  createdAt: string;
};

type Customer = {
  id: string;
  name: string;
  email: string;
};

type Props = {
  payments: Payment[];
  customers: Customer[];
  onRefund?: (paymentId: string) => void;
  loading?: boolean;
};

export default function TransactionTable({ payments, customers, onRefund, loading }: Props) {
  return (
    <div className="w-full overflow-x-auto border rounded-md">
      <table className="min-w-full text-sm">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            <th className="px-3 py-2 text-left">Date</th>
            <th className="px-3 py-2 text-left">Customer</th>
            <th className="px-3 py-2 text-left">Amount</th>
            <th className="px-3 py-2 text-left">Currency</th>
            <th className="px-3 py-2 text-left">Status</th>
            <th className="px-3 py-2 text-left">Description</th>
            <th className="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {payments.length === 0 && (
            <tr>
              <td colSpan={7} className="py-8 text-center text-muted-foreground">
                No payments found.
              </td>
            </tr>
          )}
          {payments.map((payment) => {
            const customer = customers.find((c) => c.id === payment.customerId);
            return (
              <tr key={payment.id} className="border-b last:border-none">
                <td className="px-3 py-2 whitespace-nowrap">{formatDate(payment.createdAt)}</td>
                <td className="px-3 py-2">
                  {customer ? (
                    <>
                      {customer.name}
                      <span className="block text-xs text-muted-foreground">{customer.email}</span>
                    </>
                  ) : (
                    <span className="italic text-muted-foreground">Unknown</span>
                  )}
                </td>
                <td className="px-3 py-2 font-semibold">{payment.amount}</td>
                <td className="px-3 py-2 uppercase">{payment.currency}</td>
                <td className="px-3 py-2">
                  <StatusLabel status={payment.status} />
                </td>
                <td className="px-3 py-2">{payment.description || <span className="text-muted-foreground italic">—</span>}</td>
                <td className="px-3 py-2 text-right w-24">
                  {onRefund &&
                  payment.status === "succeeded" &&
                  payment.refundedAmount === "0.00" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      disabled={loading}
                      onClick={() => onRefund(payment.id)}
                    >
                      {loading ? "Processing..." : "Refund"}
                    </Button>
                  ) : payment.status === "refunded" ? (
                    <span className="block text-xs text-green-600 font-semibold">Refunded</span>
                  ) : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function StatusLabel({ status }: { status: string }) {
  if (status === "succeeded") {
    return <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Succeeded</span>;
  }
  if (status === "created") {
    return <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">Created</span>;
  }
  if (status === "refunded") {
    return <span className="inline-block px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">Refunded</span>;
  }
  if (status === "failed") {
    return <span className="inline-block px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">Failed</span>;
  }
  return <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">{status}</span>;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}