"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Home,
  Hammer,
  Users,
  CreditCard,
  DollarSign,
  User2,
  FileText,
  TrendingUp,
  Activity,
  Banknote
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
};

const sections: { title: string; items: NavItem[] }[] = [
  {
    title: "StripeForge",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: Home },
      { label: "Payments", href: "/dashboard/payments", icon: DollarSign },
      { label: "Customers", href: "/dashboard/customers", icon: User2 },
      { label: "Invoices", href: "/dashboard/invoices", icon: FileText },
      { label: "Payouts", href: "/dashboard/payouts", icon: Banknote },
      { label: "Reports", href: "/dashboard/reports", icon: TrendingUp },
      { label: "Activity Log", href: "/dashboard/activity", icon: Activity }
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Merchant Accounts", href: "/dashboard/merchant", icon: Hammer },
      { label: "Team", href: "/dashboard/team", icon: Users },
      { label: "Billing", href: "#", icon: CreditCard, disabled: true },
      { label: "Settings", href: "/dashboard/settings", icon: Users },
    ],
  },
];

function NavLink({
  href,
  label,
  icon: Icon,
  isActive,
  disabled,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <span className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground/40 cursor-not-allowed select-none">
        <Icon className="size-4" />
        {label}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
        isActive
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      }`}
    >
      <Icon className="size-4" />
      {label}
    </Link>
  );
}

function NavSection({
  title,
  items,
  pathname,
  defaultOpen,
}: {
  title: string;
  items: NavItem[];
  pathname: string;
  defaultOpen: boolean;
}) {
  function checkActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href === "#") return false;
    return pathname.startsWith(href);
  }

  return (
    <Collapsible defaultOpen={defaultOpen}>
      <CollapsibleTrigger className="group flex w-full items-center justify-between px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 hover:text-muted-foreground transition-colors">
        {title}
        <ChevronDown className="size-3.5 transition-transform group-data-[state=closed]:-rotate-90" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-1 space-y-0.5">
          {items.map((item) => (
            <NavLink
              key={item.label}
              {...item}
              isActive={checkActive(item.href)}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-1 flex-col">
      <nav className="flex-1 space-y-4">
        {sections.map((section) => (
          <NavSection
            key={section.title}
            title={section.title}
            items={section.items}
            pathname={pathname}
            defaultOpen
          />
        ))}
      </nav>
    </div>
  );
}