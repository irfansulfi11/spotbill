/**
 * SINGLE SOURCE OF TRUTH FOR ALL USER-FACING COPY.
 *
 * Hard rule for this codebase: no string literal that a customer will read
 * lives inside a component. Copy edits are a one-file change — this file.
 *
 * `icon` values are lucide-react icon names, resolved in `lib/icons.ts`.
 */

export type IconName = string;

/* ------------------------------------------------------------------ nav */

export const nav = {
  links: [
    { label: 'Features', href: '/#features' },
    { label: 'Restaurant POS', href: '/#restaurant-pos' },
    { label: 'Reports', href: '/#reports' },
    { label: 'Offline', href: '/#offline' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Support', href: '/support' },
  ],
  cta: 'Get it on Google Play',
};

/* ----------------------------------------------------------------- hero */

export const hero = {
  eyebrow: 'Smart Billing. Instant Growth.',
  headline: [
    { text: 'Smart Billing.', accent: false },
    { text: 'Simple Business.', accent: true },
    { text: 'Better Growth.', accent: false },
  ],
  sub: 'SpotBill is the all-in-one billing and POS app for modern businesses. Bill in seconds, track your stock, and grow with confidence — all from your Android phone or tablet.',
  ctaPrimary: 'Get it on Google Play',
  ctaSecondary: 'Talk to us on WhatsApp',
  trust: [
    'Works offline',
    'GST ready',
    'Thermal printer support',
    'Kerala support team',
  ],
  offerRibbon: {
    kicker: 'App Launching Offer',
    amount: '₹5,000/-',
    note: 'Lifetime License',
  },
};

/* -------------------------------------------------------------- marquee */

export const marquee = [
  'Retail Shops',
  'Supermarkets',
  'Grocery Stores',
  'Medical Stores',
  'Restaurants',
  'Cafés',
  'Salons',
  'Wholesalers',
  'Distributors',
  'Service Businesses',
];

/* ------------------------------------------------------------- why grid */

export type WhyItem = {
  icon: IconName;
  title: string;
  body: string;
  /** Cell weight in the bento grid. */
  size: 'lg' | 'md' | 'sm';
};

export const why = {
  eyebrow: 'Why SpotBill',
  heading: 'Everything a growing business needs.',
  sub: 'One app for billing, stock, customers and reports — built for how Indian shops actually run.',
  items: [
    {
      icon: 'Zap',
      title: 'Fast & easy billing',
      body: 'Bill a customer in a few taps.',
      size: 'lg',
    },
    {
      icon: 'Boxes',
      title: 'Complete inventory management',
      body: 'Every product, batch and price in one place.',
      size: 'lg',
    },
    {
      icon: 'Smartphone',
      title: 'Android phones & tablets',
      body: 'Your billing counter fits in your pocket.',
      size: 'md',
    },
    {
      icon: 'WifiOff',
      title: 'Offline billing support',
      body: 'Keep billing when the network drops.',
      size: 'md',
    },
    {
      icon: 'ReceiptText',
      title: 'GST & tax invoices',
      body: 'Proper tax invoices your auditor will accept.',
      size: 'md',
    },
    {
      icon: 'ChartColumnBig',
      title: 'Powerful business reports',
      body: 'See exactly where the money went.',
      size: 'md',
    },
    {
      icon: 'CloudUpload',
      title: 'Secure cloud backup & sync',
      body: 'Your data survives a lost phone.',
      size: 'sm',
    },
    {
      icon: 'ScanBarcode',
      title: 'Barcode product management',
      body: 'Scan to bill, scan to stock.',
      size: 'sm',
    },
    {
      icon: 'Printer',
      title: 'Thermal printer support',
      body: 'Bluetooth and USB printers, out of the box.',
      size: 'sm',
    },
    {
      icon: 'Wallet',
      title: 'Multiple payment methods',
      body: 'Cash, UPI, card or split payment.',
      size: 'sm',
    },
    {
      icon: 'HandCoins',
      title: 'Customer & credit management',
      body: 'Track every rupee of udhaar.',
      size: 'sm',
    },
    {
      icon: 'ShieldCheck',
      title: 'Staff & role-based access',
      body: 'Staff bill. Only you see profit.',
      size: 'sm',
    },
  ] satisfies WhyItem[],
};

/* ------------------------------------------------------- feature modules */

export type FeatureModule = {
  id: string;
  index: string;
  title: string;
  body: string;
  bullets: string[];
  /** Key for the matching phone screen component. */
  screen: 'billing' | 'inventory' | 'credit' | 'kot' | 'reports' | 'staff';
};

export const features = {
  eyebrow: 'Inside the app',
  heading: 'Six tools. One billing counter.',
  sub: 'Scroll through what SpotBill actually does on your device.',
  modules: [
    {
      id: 'billing',
      index: '01',
      title: 'Fast Billing & Invoicing',
      body: 'Create professional bills within seconds.',
      bullets: [
        'Quick Sale',
        'Detailed Invoices',
        'Discounts & Taxes',
        'Split Payments',
        'Custom Invoice Numbering',
        'Sales & Purchase Returns',
        'WhatsApp Bill Sharing',
        'PDF / Image Bill Sharing',
        'UPI QR on Invoices',
      ],
      screen: 'billing',
    },
    {
      id: 'inventory',
      index: '02',
      title: 'Smart Inventory Management',
      body: 'Know exactly what is happening with your stock.',
      bullets: [
        'Product & Category Management',
        'Barcode Support',
        'Automatic Stock Updates',
        'Low Stock Alerts',
        'Opening Stock',
        'Stock Adjustments',
        'Barcode Label Printing',
        'Product Search',
      ],
      screen: 'inventory',
    },
    {
      id: 'credit',
      index: '03',
      title: 'Customer & Credit Management',
      body: 'Keep your customer transactions organized.',
      bullets: [
        'Customer Database',
        'Credit / Udhaar Billing',
        'Payment Collection',
        'Transaction History',
        'Payment Receipts',
      ],
      screen: 'credit',
    },
    {
      id: 'restaurant-pos',
      index: '04',
      title: 'Restaurant POS',
      body: 'A dedicated workflow for restaurants and cafés.',
      bullets: [
        'KOT Management',
        'Table-wise Ordering',
        'Kitchen KOT Printing',
        'Fast Order Entry',
      ],
      screen: 'kot',
    },
    {
      id: 'reports',
      index: '05',
      title: 'Powerful Business Reports',
      body: 'Understand your business performance with clear reports.',
      bullets: [
        'Daily Sales Report',
        'Daybook',
        'Payment Reports',
        'Tax / GST Reports',
        'Expense Reports',
        'HSN Reports',
        'Stock Information',
        'Excel Export',
        'WhatsApp Report Sharing',
      ],
      screen: 'reports',
    },
    {
      id: 'staff',
      index: '06',
      title: 'Staff Management',
      body: 'Manage your team with better control.',
      bullets: [
        'Staff Accounts',
        'Role-Based Access',
        'Super Admin Controls',
        'Staff Activity Tracking',
        'Multi-Device Support',
      ],
      screen: 'staff',
    },
  ] satisfies FeatureModule[],
};

/* -------------------------------------------------------------- offline */

export const offline = {
  eyebrow: 'No internet? No problem.',
  heading: 'Keep billing even without internet.',
  body: "SpotBill supports offline day-to-day billing, so you can keep serving customers when the connection drops. Your data syncs the moment you're back online.",
  toggleLabel: 'Wi-Fi',
  states: {
    offlineChip: 'Offline',
    onlineChip: 'Synced',
    queued: 'bills queued',
    syncing: 'Syncing…',
  },
  points: [
    'Bills, payments and stock updates keep working.',
    'Queued bills upload automatically on reconnect.',
    'Nothing is lost if the tower goes down mid-sale.',
  ],
};

/* -------------------------------------------------------------- printer */

export const printer = {
  eyebrow: 'Hardware',
  heading: 'Connect your thermal printer.',
  body: 'Bluetooth and USB thermal printers are supported out of the box. Print clean, professional receipts and invoices straight from your billing device.',
  cta: 'Print receipt',
  points: [
    'Bluetooth thermal printers — 58mm and 80mm.',
    'USB and OTG printers on phones and tablets.',
    'Kitchen KOT printing on a second printer.',
    'Barcode label printing from the same device.',
  ],
};

/* ---------------------------------------------------------------- setup */

export const setup = {
  eyebrow: 'Setup',
  heading: 'Turn your Android device into a POS.',
  sub: 'No complicated setup.',
  steps: [
    {
      num: '01',
      title: 'Download',
      body: 'Get SpotBill free from the Google Play Store.',
    },
    {
      num: '02',
      title: 'Add business',
      body: 'Enter your shop name, GST number and logo.',
    },
    {
      num: '03',
      title: 'Add products',
      body: 'Type them in, or scan barcodes to add in bulk.',
    },
    {
      num: '04',
      title: 'Start billing',
      body: "You're live. First bill in under five minutes.",
    },
  ],
};

/* ---------------------------------------------------------- perfect for */

export const perfectFor = {
  eyebrow: 'Who it is for',
  heading: 'Built for the way you actually work.',
  closing:
    "Whether you're running a small shop or a growing business, SpotBill simplifies your everyday billing and business management.",
  items: [
    {
      icon: 'Store',
      title: 'Retail Shops',
      body: 'Quick counter billing with barcode scanning.',
    },
    {
      icon: 'ShoppingCart',
      title: 'Supermarkets',
      body: 'Thousands of products, fast checkout queues.',
    },
    {
      icon: 'Carrot',
      title: 'Grocery Stores',
      body: 'Loose weight items and regular udhaar customers.',
    },
    {
      icon: 'Pill',
      title: 'Medical Stores',
      body: 'Batch-wise stock with clean GST invoices.',
    },
    {
      icon: 'UtensilsCrossed',
      title: 'Restaurants',
      body: 'Table orders, KOT printing and quick settlement.',
    },
    {
      icon: 'Coffee',
      title: 'Cafés',
      body: 'Fast repeat orders and UPI QR payments.',
    },
    {
      icon: 'Scissors',
      title: 'Salons',
      body: 'Service billing with staff-wise tracking.',
    },
    {
      icon: 'Warehouse',
      title: 'Wholesalers',
      body: 'Bulk rates, credit ledgers and purchase returns.',
    },
    {
      icon: 'Truck',
      title: 'Distributors',
      body: 'Route billing with stock moved per trip.',
    },
    {
      icon: 'Wrench',
      title: 'Service Businesses',
      body: 'Job-wise invoices with parts and labour.',
    },
  ],
};

/* ---------------------------------------------------------------- offer */

export const offer = {
  eyebrow: 'App Launching Offer',
  heading: '₹5,000/- Lifetime License',
  licenseLabel: 'Lifetime License',
  body: 'One payment. No monthly subscription. Every feature, for as long as you use it.',
  cta: 'Claim the launch offer',
  note: 'Launch pricing — limited period. Contact us to confirm current availability.',
  includes: [
    'Every feature, no add-on packs',
    'Free updates on the same licence',
    'All-Kerala service and setup help',
  ],
};

/* ------------------------------------------------------------------ faq */

export const faq = {
  eyebrow: 'Questions',
  heading: 'Before you download.',
  items: [
    {
      q: 'Does SpotBill work without internet?',
      a: 'Yes. Day-to-day billing keeps working when your connection drops, so you can carry on serving customers. Bills created offline are queued on the device and sync automatically the moment you are back online.',
    },
    {
      q: 'Are the GST invoices valid for my accounts?',
      a: 'SpotBill produces proper tax invoices with your GSTIN, HSN codes and a CGST/SGST or IGST split. You can export GST and HSN reports to Excel and hand them straight to your auditor at filing time.',
    },
    {
      q: 'Which thermal printers are supported?',
      a: 'Standard 58mm and 80mm Bluetooth thermal printers work out of the box, and USB or OTG printers are supported on phones and tablets. Restaurants can add a second printer in the kitchen for KOT printing.',
    },
    {
      q: 'Is my business data safe?',
      a: 'Your data sits on your device and is backed up to secure cloud storage, so a lost or damaged phone does not mean a lost business history. Restore on a new device by signing in with the same account.',
    },
    {
      q: 'How many devices can I use?',
      a: 'SpotBill supports multi-device use, so a counter tablet and the owner phone can work on the same business. Contact our team on WhatsApp and we will confirm the device count for your licence.',
    },
    {
      q: 'Can my staff use it without seeing everything?',
      a: 'Yes. Create staff accounts with role-based access so a cashier can bill without opening your profit reports or price settings. Super admin controls stay with the owner, and staff activity is tracked.',
    },
    {
      q: 'Does it handle restaurant KOT and table orders?',
      a: 'Restaurants and cafés get a dedicated POS workflow with table-wise ordering, fast order entry and KOT management. Kitchen tickets can print to a separate kitchen printer as orders are placed.',
    },
    {
      q: 'How do I get help if something goes wrong?',
      a: 'Message us on WhatsApp or call +91 88917 89407 and you will reach our Kerala team, not a call centre. We help with installation, printer pairing and first-time product setup.',
    },
  ],
  /** Appended only when `site.offerActive` is true. */
  offerItem: {
    q: 'What does the ₹5,000 lifetime licence include?',
    a: 'It is a one-time payment for the full app with no monthly subscription — every feature, for as long as you use it. This is launch pricing for a limited period, so message us to confirm it is still available.',
  },
};

/* ------------------------------------------------------------- download */

export const download = {
  eyebrow: 'Download',
  heading: 'Get SpotBill on your device.',
  scanLabel: 'Scan to download SpotBill now',
  note: 'Available on Google Play. Android phones and tablets.',
};

/* ------------------------------------------------------------ final cta */

export const finalCta = {
  heading: 'Ready to make your billing smarter?',
  body: 'Stop depending on manual billing. Bill faster, manage stock smarter, and grow your business with confidence.',
  callLabel: 'Call',
};

/* ----------------------------------------------------------------- foot */

export const footer = {
  productLinks: [
    { label: 'Features', href: '/#features' },
    { label: 'Restaurant POS', href: '/#restaurant-pos' },
    { label: 'Reports', href: '/#reports' },
    { label: 'Offline billing', href: '/#offline' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'FAQ', href: '/#faq' },
  ],
  supportHeading: 'Support',
  productHeading: 'Product',
  poweredHeading: 'Powered by',
  serviceLine: 'All Kerala Service',
  legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
  ],
};

/* ------------------------------------------------------------- support */

export const support = {
  title: 'Support',
  heading: 'Talk to a real person in Kerala.',
  sub: 'Installation, printer pairing, product setup or a question before you buy — message us and we will walk you through it.',
  hoursHeading: 'Support hours',
  hours: ['Monday – Saturday · 9:30 AM – 7:30 PM IST', 'Sunday · Closed'],
  printerHeading: 'Thermal printer setup help',
  printerSteps: [
    'Charge the printer and switch it on until the power light is steady.',
    'Turn on Bluetooth on your Android device and pair the printer once from Android Settings.',
    'Open SpotBill → Settings → Printer and select the paired device.',
    'Choose your paper width — 58mm or 80mm — and print a test receipt.',
    'For USB printers, connect through an OTG cable and allow the USB permission prompt.',
    'Still stuck? Send us a photo of the printer model on WhatsApp and we will confirm compatibility.',
  ],
};

/* ---------------------------------------------------------------- phone */
/**
 * Sample data for the in-page phone screens. Deliberately mirrors the app's
 * own demo catalogue so the site shows the product, not a mock-up of it.
 */
export const screens = {
  business: 'Kerala Super Store',
  gstin: '32AABCT1332L1ZZ',
  invoiceNo: 'INV-2417',

  billing: {
    title: 'New Bill',
    items: [
      { name: 'Croissant', qty: 1, rate: 175 },
      { name: 'Corndog', qty: 1, rate: 76 },
      { name: 'Burrito', qty: 1, rate: 50 },
      { name: 'Coffee', qty: 2, rate: 20 },
      { name: 'Tea', qty: 2, rate: 12 },
      { name: 'Salad', qty: 1, rate: 10 },
    ],
    taxRate: 0.05,
    taxLabel: 'GST 5%',
    subtotalLabel: 'Subtotal',
    totalLabel: 'Total',
    payLabel: 'Charge',
    upiLabel: 'UPI QR',
    customer: 'Walk-in customer',
  },

  inventory: {
    title: 'Inventory',
    searchPlaceholder: 'Search or scan barcode',
    lowLabel: 'Low',
    unitsLabel: 'units',
    items: [
      { name: 'Croissant', sku: '8901234501', stock: 42, low: false },
      { name: 'Corndog', sku: '8901234502', stock: 6, low: true },
      { name: 'Coffee 250g', sku: '8901234503', stock: 118, low: false },
      { name: 'Tea 500g', sku: '8901234504', stock: 260, low: false },
      { name: 'Salad Pack', sku: '8901234505', stock: 15, low: false },
    ],
  },

  credit: {
    title: 'Customer',
    name: 'Anees K',
    phone: '+91 98470 ·····',
    balanceLabel: 'Udhaar balance',
    balance: 2450,
    paidLabel: 'Paid',
    collectLabel: 'Collect payment',
    history: [
      { label: 'Bill INV-2402', amount: -1200, date: '18 Aug' },
      { label: 'Cash received', amount: 900, date: '16 Aug' },
      { label: 'Bill INV-2388', amount: -2150, date: '12 Aug' },
    ],
  },

  kot: {
    title: 'Restaurant POS',
    columns: ['Orders', 'Kitchen'],
    orders: [
      { table: 'Table 04', items: 3, note: 'Croissant, Coffee ×2' },
      { table: 'Table 09', items: 2, note: 'Burrito, Tea' },
      { table: 'Parcel 12', items: 1, note: 'Corndog' },
    ],
    kotLabel: 'KOT sent',
  },

  reports: {
    title: 'Daily Sales',
    dateLabel: 'Today',
    total: 18420,
    totalLabel: 'Total collected',
    bars: [
      { label: 'Cash', value: 7300 },
      { label: 'UPI', value: 9120 },
      { label: 'Card', value: 2000 },
    ],
    rows: [
      { label: 'Bills', value: '64' },
      { label: 'Items sold', value: '213' },
      { label: 'GST collected', value: '₹877' },
    ],
  },

  staff: {
    title: 'Staff',
    roles: ['Admin', 'Cashier'],
    members: [
      { name: 'Irfan S', initials: 'IS', role: 0, owner: true },
      { name: 'Fathima R', initials: 'FR', role: 1, owner: false },
      { name: 'Vishnu P', initials: 'VP', role: 1, owner: false },
    ],
    ownerLabel: 'Super admin',
    activityLabel: 'Last active',
  },

  receipt: {
    /** Static so server and client render identically — it is a sample bill. */
    date: '22/08/2026',
    time: '10:24',
    paidBy: 'Paid by UPI',
    thanks: 'Thank you · Visit again',
    upiNote: 'Scan to pay by UPI',
    cashierLabel: 'Cashier',
    cashier: 'Fathima R',
  },
} as const;

/* ---------------------------------------------------------------- legal */
/**
 * Genuine drafts, written to satisfy the Play Store's live-privacy-policy
 * requirement. They are NOT a substitute for legal advice — see NOTES.md,
 * which flags this for review before the site goes live.
 */
export const legal = {
  privacy: {
    title: 'Privacy Policy',
    intro:
      'This policy explains what SpotBill collects when you use the app, why we collect it, where it is stored and how you can have it removed. SpotBill is published by IT WORLD EXPERIENCE STORE, Kerala, India.',
    sections: [
      {
        h: 'Information we collect',
        p: [
          'Account details you give us when you register: your name, business name, mobile number and email address.',
          'Business data you enter into the app: products, prices, stock levels, customers, invoices, payments, expenses and staff accounts.',
          'Device and diagnostic information: app version, device model, operating system version and crash reports, used to fix faults.',
        ],
      },
      {
        h: 'How we use your information',
        p: [
          'To run the billing, inventory, reporting and staff features you asked for.',
          'To back up and restore your business data across your devices.',
          'To provide support when you contact us, and to diagnose and fix defects.',
          'To send service messages about your licence, updates or outages. We do not sell your data or use it for third-party advertising.',
        ],
      },
      {
        h: 'Cloud sync and where your data is stored',
        p: [
          'Bills you create offline are held on your device and uploaded when a connection returns. Synced business data is stored on managed cloud servers, encrypted in transit using HTTPS/TLS.',
          'Server locations may include data centres inside and outside India, depending on our hosting provider. Contact us if you need the current storage region for a compliance requirement.',
        ],
      },
      {
        h: 'Sharing',
        p: [
          'We share data only with service providers who host, back up or support the app, and only to the extent needed to run it. We may disclose information where we are legally required to.',
          'When you share a bill or report over WhatsApp, email or another app, that content leaves SpotBill and is governed by that service’s own terms.',
        ],
      },
      {
        h: 'Retention and deletion',
        p: [
          'We keep your business data while your account is active so your history stays available. You can ask us to delete your account and its data at any time by writing to itworldindia789@gmail.com from your registered address, or by messaging our support number.',
          'We will action verified deletion requests within 30 days, except where a record must be kept to meet a legal or tax obligation.',
        ],
      },
      {
        h: 'Security',
        p: [
          'Access is protected by your account credentials and by role-based permissions you set for staff. Keep your password private and use staff accounts rather than sharing the owner login.',
          'No system is perfectly secure, but we take reasonable technical and organisational measures to protect your data.',
        ],
      },
      {
        h: 'Permissions the app requests',
        p: [
          'Bluetooth and USB, to discover and print to your thermal printer. Camera, to scan barcodes. Storage, to save and share invoice PDFs and images. Each permission is used only for the stated feature.',
        ],
      },
      {
        h: 'Children',
        p: [
          'SpotBill is a business tool and is not directed at children under 13. We do not knowingly collect their information.',
        ],
      },
      {
        h: 'Changes to this policy',
        p: [
          'If we change this policy we will update the date below and, for significant changes, notify you in the app.',
        ],
      },
    ],
  },

  terms: {
    title: 'Terms of Service',
    intro:
      'These terms govern your use of the SpotBill Android application and this website, both provided by IT WORLD EXPERIENCE STORE, Kerala, India. By installing or using SpotBill you agree to them.',
    sections: [
      {
        h: 'Your licence',
        p: [
          'We grant you a non-exclusive, non-transferable licence to use SpotBill for your own business. You may not resell, sublicense, rent out or redistribute the app.',
          'Where a lifetime licence is purchased, it covers the licensed business for as long as the app is offered, on the device count agreed at purchase. It is not a promise that any specific feature or third-party integration will exist forever.',
        ],
      },
      {
        h: 'Launch pricing',
        p: [
          'Promotional pricing, including any launch offer shown on this site, is available for a limited period and may be withdrawn or changed at any time before purchase. Confirm current availability with us before paying.',
        ],
      },
      {
        h: 'Your responsibilities',
        p: [
          'You are responsible for the accuracy of the data you enter, including GST numbers, HSN codes, tax rates and prices, and for meeting your own tax and record-keeping obligations.',
          'You are responsible for keeping your account credentials secure and for the actions of staff accounts you create.',
          'You must not use SpotBill for unlawful purposes or attempt to reverse engineer, decompile or interfere with the app or our servers.',
        ],
      },
      {
        h: 'Availability and support',
        p: [
          'We aim to keep the service available but do not guarantee uninterrupted operation. Maintenance, network faults or issues at a third-party provider can cause downtime. Offline billing is designed to keep you working through connection loss.',
          'Support is provided by our Kerala team during published hours.',
        ],
      },
      {
        h: 'Backups',
        p: [
          'Cloud backup is provided as a convenience and we take reasonable care with it. We recommend you also export your reports periodically. We are not liable for loss of data beyond what a reasonable backup process would have prevented.',
        ],
      },
      {
        h: 'Third-party services',
        p: [
          'Distribution through Google Play, payments made through UPI or a bank, and messages sent through WhatsApp are governed by those providers’ terms, not ours.',
        ],
      },
      {
        h: 'Limitation of liability',
        p: [
          'To the extent permitted by law, our total liability arising from your use of SpotBill is limited to the amount you paid us for the licence. We are not liable for indirect or consequential loss, including lost profits or lost business.',
          'Nothing in these terms limits liability that cannot be limited under Indian law.',
        ],
      },
      {
        h: 'Termination',
        p: [
          'You may stop using SpotBill at any time. We may suspend access where these terms are breached, where use threatens the service, or where payment for a licence has not been completed.',
        ],
      },
      {
        h: 'Governing law',
        p: [
          'These terms are governed by the laws of India, and the courts of Kerala have jurisdiction over any dispute.',
        ],
      },
      {
        h: 'Changes',
        p: [
          'We may update these terms. Continued use after an update means you accept the revised terms.',
        ],
      },
    ],
  },

  /** Shown on both legal pages. */
  effectiveLabel: 'Last updated',
  effectiveDate: '22 August 2026',
  contactHeading: 'Contact us',
  contactBody:
    'Questions about this page, a data request or anything else — reach us on any of these.',
} as const;
