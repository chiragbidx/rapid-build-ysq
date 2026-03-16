# Changelog

## 2024-06-09 - StripeForge Initial Data Models, Migration, and Dashboard Nav

- Introduced core StripeForge data models:
  - Merchant Accounts (`merchant_accounts`)
  - Merchant Account Members (`merchant_account_members`)
  - Customers (`customers`)
  - Payments (`payments`)
  - Invoices (`invoices`)
  - Payouts (`payouts`)
  - Activity Logs (`activity_logs`)
- Created migration for new StripeForge tables in `drizzle/0002_stripeforge_core_tables.sql`.
- Updated migration journal to include new migration.
- Updated dashboard sidebar navigation: Added StripeForge sections (Dashboard, Payments, Customers, Invoices, Payouts, Reports, Activity Log), Merchant Accounts, and restructured for clarity and branding.