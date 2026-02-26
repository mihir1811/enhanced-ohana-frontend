/**
 * Share utilities for product links.
 * Uses NEXT_PUBLIC_SITE_URL for production shareable URLs (e.g. https://www.gemworld.in)
 */

import { SITE_URL } from './constants';

export type ProductType = 'diamond' | 'meleeDiamond' | 'gemstone' | 'jewellery' | 'watch' | 'bullion';

/**
 * Build the correct product detail path (e.g. /diamonds/123) for client-side routing.
 */
export function getProductPath(productType: ProductType, productId: string | number): string {
  const id = String(productId);
  switch (productType) {
    case 'diamond': return `/diamonds/${id}`;
    case 'meleeDiamond': return `/diamonds/melee/${id}`;
    case 'gemstone': return `/gemstones/single/${id}`;
    case 'jewellery': return `/product/jewelry/${id}`;
    case 'watch': return `/watches/${id}`;
    case 'bullion': return `/bullions/${id}`;
    default: return `/product/jewelry/${id}`;
  }
}

/**
 * Build the full shareable product URL (with SITE_URL) for copying/sharing.
 */
export function getProductUrl(productType: ProductType, productId: string | number): string {
  const base = SITE_URL.replace(/\/$/, '');
  const path = getProductPath(productType, productId);
  return `${base}${path}`;
}

/**
 * Copy product URL to clipboard and optionally show toast.
 * Returns true on success.
 */
export async function copyProductUrlToClipboard(
  productType: ProductType,
  productId: string | number
): Promise<boolean> {
  const url = getProductUrl(productType, productId);
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Share via Web Share API if available, otherwise fallback to clipboard.
 */
export async function shareProduct(
  productType: ProductType,
  productId: string | number,
  productName?: string
): Promise<{ success: boolean; method: 'share' | 'clipboard' }> {
  const url = getProductUrl(productType, productId);
  const title = productName || 'Product Details';

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title,
        url,
        text: productName ? `Check out ${productName}` : undefined,
      });
      return { success: true, method: 'share' };
    } catch (err) {
      // User cancelled or share failed - fallback to clipboard
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    return { success: true, method: 'clipboard' };
  } catch {
    return { success: false, method: 'clipboard' };
  }
}
