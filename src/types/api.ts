// Response shapes of the backend API (backend docs/API.md). Keep in sync with the backend.

export type PriceTier = 'retail' | 'business';
export type VariantOptions = Record<string, string | number>;

export interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  children: { id: string; name: string; slug: string; description: string | null }[];
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
}

export interface Tag {
  id: string;
  type: 'audience' | 'need';
  name: string;
  slug: string;
}

export interface ProductCard {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  categoryName: string;
  categorySlug: string;
  priceFrom: number;
  inStock: boolean;
  imageUrl: string | null;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  options: VariantOptions;
  price: number;
  retailPrice: number;
  inStock: boolean;
  availableQuantity: number;
  maxExtraBeads: number;
  extraBeadPrice: number | null;
}

export interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  material: string | null;
  specs: { label: string; value: string }[];
  usageGuide: string | null;
  seo: { title: string; description: string | null };
  breadcrumb: { name: string; slug: string }[];
  images: { id: string; url: string; alt: string | null }[];
  tags: { type: 'audience' | 'need'; name: string; slug: string }[];
  collections: { name: string; slug: string }[];
  priceTier: PriceTier;
  variants: ProductVariant[];
}

export interface CartItemInput {
  variantId: string;
  quantity: number;
  extraBeads: number;
}

export interface QuoteLine {
  variantId: string;
  productId: string;
  productName: string;
  productSlug: string;
  variantName: string;
  sku: string;
  options: VariantOptions;
  imageUrl: string | null;
  unitPrice: number;
  extraBeads: number;
  extraBeadUnitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface CartProblem {
  variantId: string;
  reason: 'unavailable' | 'insufficient_stock';
  availableQuantity: number;
}

export interface Quote {
  priceTier: PriceTier;
  lines: QuoteLine[];
  subtotal: number;
  shippingFee: number;
  total: number;
  problems: CartProblem[];
}

export type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';
export type FulfillmentStatus = 'unfulfilled' | 'packing' | 'shipped' | 'delivered' | 'returned';

export interface CustomerOrderView {
  code: string;
  createdAt: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  paymentMethod: 'cod';
  priceTier: PriceTier;
  customerName: string;
  carrier: string | null;
  trackingNumber: string | null;
  subtotal: number;
  shippingFee: number;
  discountTotal: number;
  total: number;
  canCancel: boolean;
  items: {
    productName: string;
    variantName: string;
    sku: string;
    options: VariantOptions;
    imageUrl: string | null;
    unitPrice: number;
    extraBeads: number;
    extraBeadUnitPrice: number;
    quantity: number;
    lineTotal: number;
  }[];
  shipping: { province: string; ward?: string; addressLine?: string; phone?: string; email?: string; note?: string | null };
  invoice: { companyName: string; taxCode: string; address: string } | null;
}

export interface Customer {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  accountType: 'personal' | 'business';
  businessStatus: 'pending' | 'approved' | 'rejected' | null;
  companyName: string | null;
  taxCode: string | null;
  invoiceAddress: string | null;
  priceTier: PriceTier;
}

export interface StoreInfo {
  storeName: string;
  hotline: string | null;
  email: string | null;
  address: string | null;
  businessInfo: string | null;
  facebookUrl: string | null;
  zaloUrl: string | null;
  shippingFee: number | null;
  freeShippingThreshold: number | null;
}
