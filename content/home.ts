// ─── ...types omitted for brevity; see unchanged content above ───

export const defaultHomeContent: HomeContent = {
  hero: {
    badgeInner: "Launch",
    badgeOuter: "StripeForge is live",
    titleBefore: "The Modern Payment Platform for ",
    titleHighlight: "Developers & Businesses",
    titleAfter: "",
    subtitle:
      "StripeForge gives you developer-first payments, customer management, invoicing, and merchant tools — all in one secure, extensible dashboard.",
    primaryCta: { label: "Get Started with StripeForge", href: "#pricing" },
    secondaryCta: { label: "See Platform Features", href: "#features" },
    heroImageLight: "/hero-image-light.jpeg",
    heroImageDark: "/hero-image-dark.jpeg",
    heroImageAlt: "StripeForge dashboard preview",
  },
  sponsors: {
    heading: "Trusted by Fintech Innovators",
    items: [
      { icon: "Crown", name: "Vercel" },
      { icon: "Vegan", name: "Stripe" },
      { icon: "Wallet", name: "Plaid" },
      { icon: "Drama", name: "Sentry" },
      { icon: "FolderGit2", name: "OpenAI" },
      { icon: "Puzzle", name: "Supabase" }
    ],
  },

  benefits: {
    eyebrow: "Why StripeForge",
    heading: "All-in-One Merchant Platform for Modern SaaS",
    description:
      "Reliability, transparency, developer speed. StripeForge abstracts the complexity of payments, invoicing, and merchant management — so you can launch, scale, and grow with confidence.",
    items: [
      {
        icon: "CreditCard",
        title: "Streamlined Payments",
        description:
          "Simulate, track, and manage transactions in seconds. Accept cards and handle refunds—all with clear payment flow states.",
      },
      {
        icon: "Users",
        title: "Customer Management",
        description:
          "Create and manage your customer directory, view payment history, and keep billing details in sync effortlessly.",
      },
      {
        icon: "FileText",
        title: "Flexible Invoicing",
        description:
          "Issue invoices, control line items, and update statuses—then share with your customers securely. PDF & export support built-in.",
      },
      {
        icon: "Banknote",
        title: "Automated Payouts",
        description:
          "Track payouts by account or destination. See settlement status and payout history automatically.",
      },
    ],
  },

  features: {
    eyebrow: "Features",
    heading: "StripeForge Dashboard Powers Your Payments",
    subtitle:
      "All the merchant tools you need—payments, customers, invoices, payouts, reporting—use a secure, role-based SaaS dashboard that grows with you.",
    items: [
      {
        icon: "CreditCard",
        title: "Realistic Payment Simulation",
        description:
          "Create, refund, and manage payments — complete with status tracking and audit log.",
      },
      {
        icon: "Users",
        title: "Multi-Tenant Merchant Accounts",
        description:
          "Role-based permissions (Owner/Admin/Viewer) and safe scoping for all team operations.",
      },
      {
        icon: "UserCheck",
        title: "Customer Self-Serve Portal",
        description:
          "Demo customer portal with read-only invoice & payment views (secure token access).",
      },
      {
        icon: "FileText",
        title: "Invoice Manager",
        description:
          "Draft, send, and manage invoices. Lock after payment, export as PDF, and link to payments.",
      },
      {
        icon: "Table2",
        title: "Payout Reconciliation",
        description:
          "Simulated daily settlements for your merchant account — historical record at a glance.",
      },
      {
        icon: "BarChart3",
        title: "Transaction Reporting",
        description:
          "Review revenue, volume, fees, and payouts. Filter and export as your business grows.",
      },
    ],
  },

  services: {
    eyebrow: "API-First. Extensible By Design.",
    heading: "Core StripeForge Capabilities",
    subtitle:
      "Built for integration and rapid change—powerful merchant data with developer hooks ready for custom flows.",
    items: [
      {
        title: "Production-Grade Security",
        description:
          "Never store raw card data. Test PCI-like flows; audit logs and role permissions on every action.",
        pro: true,
      },
      {
        title: "Built for SaaS Platforms",
        description:
          "Multi-tenant, scalable, and ready for complex account scenarios out of the box.",
        pro: false,
      },
      {
        title: "Lightning-Fast Integration",
        description:
          "Typed API & event hooks for future expansion—webhooks, notifications, and real payment providers.",
        pro: false,
      },
      {
        title: "Transparent Activity Log",
        description:
          "Track every action in your dashboard, from payment to payout—and remain audit-ready.",
        pro: false,
      },
    ],
  },
  testimonials: {
    eyebrow: "Trusted By Modern Businesses",
    heading: "Why Developers Choose StripeForge",
    reviews: [
      {
        image: "/demo-img.jpg",
        name: "Jamie Rivers",
        role: "CTO, Finstack",
        comment:
          "StripeForge’s dashboard got us live in record time. The payments simulation is perfect for MVPs.",
        rating: 5.0,
      },
      {
        image: "/demo-img.jpg",
        name: "Priya Kumar",
        role: "Founder, SaaSbox",
        comment:
          "Multi-tenant support and role-based access were critical. StripeForge nailed the workflow.",
        rating: 4.9,
      },
      {
        image: "/demo-img.jpg",
        name: "Mikhail Ivanov",
        role: "Engineer, Cashverse",
        comment:
          "The code structure made building custom billing flows feel effortless. Highly recommended.",
        rating: 5.0,
      },
      {
        image: "/demo-img.jpg",
        name: "Melissa Chan",
        role: "Developer Advocate, IndiePay",
        comment:
          "Love the extensibility and production sanity out of the box. Real reporting and empty states.",
        rating: 4.9,
      },
    ],
  },
  team: {
    eyebrow: "Team",
    heading: "StripeForge Founders",
    members: [
      {
        imageUrl: "/team1.jpg",
        firstName: "Chirag",
        lastName: "Dodiya",
        positions: ["Founder", "Product Architect"],
        socialNetworks: [
          { name: "LinkedIn", url: "https://www.linkedin.com/in/chiragdodiya/" },
          { name: "Github", url: "https://github.com/chiragd" },
        ],
      },
      {
        imageUrl: "/team2.jpg",
        firstName: "Zara",
        lastName: "Patel",
        positions: ["Lead Engineer"],
        socialNetworks: [
          { name: "LinkedIn", url: "https://www.linkedin.com/in/zara-stripeforge/" },
        ],
      },
    ],
  },
  pricing: {
    eyebrow: "Pricing",
    heading: "Simple Pricing. No Hidden Fees.",
    subtitle:
      "Pay as you grow — get started for free, then unlock more when you’re ready for scale.",
    priceSuffix: "/month",
    plans: [
      {
        title: "Developer",
        popular: false,
        price: 0,
        description:
          "Simulate payments, test customer flows, and evaluate StripeForge with no cost.",
        buttonText: "Start Free",
        benefits: [
          "All core dashboard features",
          "Unlimited demo payments",
          "Access to customer portal",
          "Basic multi-tenant support",
        ],
      },
      {
        title: "Business",
        popular: true,
        price: 49,
        description:
          "For SaaS and fintech startups ready to accept live payments (production, coming soon).",
        buttonText: "Request Early Access",
        benefits: [
          "All Developer features",
          "Export and PDF support",
          "Priority support",
          "Beta production gateway (invite)",
        ],
      },
      {
        title: "Enterprise",
        popular: false,
        price: 199,
        description:
          "All-in, with advanced reporting, enhanced export + support, and compliance partner onboarding.",
        buttonText: "Contact for Demo",
        benefits: [
          "Advanced reporting",
          "White-glove onboarding",
          "SLAs and support contracts",
          "Enterprise SSO (coming soon)",
        ],
      },
    ],
  },
  contact: {
    eyebrow: "Contact",
    heading: "Connect With StripeForge",
    description:
      "Questions about billing, developer support, or partnership programs? Reach out. We reply personally.",
    mailtoAddress: "hi@chirag.co",
    info: {
      address: { label: "Headquarters", value: "Remote-first • Singapore" },
      phone: { label: "Phone", value: "" },
      email: { label: "Email", value: "hi@chirag.co" },
      hours: { label: "Support", value: ["Monday - Friday", "All Timezones"] },
    },
    formSubjects: [
      "Demo Request",
      "Billing/Account Help",
      "Enterprise Access",
      "Integration Partner",
    ],
    formSubmitLabel: "Send Message",
  },
  faq: {
    eyebrow: "FAQ",
    heading: "Common Questions",
    items: [
      {
        question: "Can I process real payments with StripeForge?",
        answer:
          "For MVP, all flows are in simulation mode — no real money moves. Production payments (Stripe/other) are coming soon.",
      },
      {
        question: "Do you support invoices and customer billing?",
        answer:
          "Yes! The dashboard supports invoice creation, customer assignment, simulated payment, and read-only customer portal.",
      },
      {
        question: "How do roles and permissions work?",
        answer:
          "Owner/Admin/Viewer roles — enforced everywhere. All access scoped to your merchant account(s).",
      },
      {
        question: "Is StripeForge PCI compliant?",
        answer:
          "No real card data is handled for MVP. When gateways launch, PCI DSS will be strictly followed. All flows use tokenized/test data only for now.",
      },
      {
        question: "Do you offer PDF export and reporting?",
        answer:
          "Yes. Exporting invoices, payouts, and transaction history copies (as demo/stub for MVP) are included.",
      },
    ],
  },
  footer: {
    brandName: "StripeForge",
    columns: [
      {
        heading: "Contact",
        links: [
          { label: "hi@chirag.co", href: "mailto:hi@chirag.co" },
        ],
      },
      {
        heading: "Product",
        links: [
          { label: "Features", href: "#features" },
          { label: "Pricing", href: "#pricing" },
          { label: "Contact", href: "#contact" },
        ],
      },
      {
        heading: "Help",
        links: [
          { label: "FAQ", href: "#faq" },
          { label: "Docs", href: "https://stripeforge.com/docs" },
        ],
      },
      {
        heading: "Socials",
        links: [
          { label: "GitHub", href: "https://github.com/chiragd" },
          { label: "LinkedIn", href: "https://linkedin.com/in/chiragdodiya" },
        ],
      },
    ],
    copyright: "© 2026 StripeForge. All rights reserved.",
    attribution: { label: "Powered by Next.js", href: "https://nextjs.org" },
  },
  navbar: {
    brandName: "StripeForge",
    routes: [
      { href: "/#features", label: "Features" },
      { href: "/#pricing", label: "Pricing" },
      { href: "/#testimonials", label: "Testimonials" },
      { href: "/#contact", label: "Contact" },
      { href: "/#faq", label: "FAQ" },
    ],
    featureDropdownLabel: "Platform Features",
    featureImage: {
      src: "/hero-image-light.jpeg",
      alt: "StripeForge dashboard preview",
    },
    features: [
      {
        title: "Payments, Invoicing, Customers",
        description: "End-to-end simulation for modern SaaS platforms.",
      },
      {
        title: "Role-Based Access & Multi-Tenant",
        description: "Merchant accounts, strict access, and safe scoping.",
      },
      {
        title: "API-First & Extensible",
        description: "Built for integration, not lock-in.",
      },
    ],
    signInLabel: "Sign in",
    signUpLabel: "Sign up",
    dashboardLabel: "Dashboard",
    githubLink: {
      href: "https://github.com/chiragd",
      ariaLabel: "View StripeForge on Github",
    },
  },
};

export function getHomeContent(): HomeContent {
  return defaultHomeContent;
}