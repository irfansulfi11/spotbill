/**
 * Icon registry. `lib/content.ts` stays pure data by referring to icons by
 * name; this is the only place those names become components.
 */
import {
  Boxes,
  Carrot,
  ChartColumnBig,
  CloudUpload,
  Coffee,
  HandCoins,
  Pill,
  Printer,
  ReceiptText,
  ScanBarcode,
  Scissors,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Store,
  Truck,
  UtensilsCrossed,
  Wallet,
  Warehouse,
  WifiOff,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';

export const icons: Record<string, LucideIcon> = {
  Boxes,
  Carrot,
  ChartColumnBig,
  CloudUpload,
  Coffee,
  HandCoins,
  Pill,
  Printer,
  ReceiptText,
  ScanBarcode,
  Scissors,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Store,
  Truck,
  UtensilsCrossed,
  Wallet,
  Warehouse,
  WifiOff,
  Wrench,
  Zap,
};

export function getIcon(name: string): LucideIcon {
  return icons[name] ?? Zap;
}
