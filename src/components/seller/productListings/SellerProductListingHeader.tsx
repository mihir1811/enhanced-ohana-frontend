import React from 'react';

type SellerProductListingHeaderProps = {
  title: string;
  subtitle?: string;
  actions: React.ReactNode;
};

/**
 * Title + optional subtitle on the left; toolbar (buttons) on the right.
 * Wraps on small screens so the table toolbar stays usable on mobile.
 */
export function SellerProductListingHeader({ title, subtitle, actions }: SellerProductListingHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4 mb-5">
      <div className="min-w-0">
        <h2 className="text-lg font-semibold tracking-tight sm:text-xl" style={{ color: 'var(--foreground)' }}>
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-0.5 max-w-prose text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            {subtitle}
          </p>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:justify-end">{actions}</div>
    </div>
  );
}

type ToolbarGroupProps = { children: React.ReactNode; className?: string };

/** Visually groups related controls (e.g. list/grid + columns). */
export function SellerListingToolbarGroup({ children, className = '' }: ToolbarGroupProps) {
  return (
    <div
      className={`inline-flex flex-wrap items-center gap-1 rounded-lg border p-1 ${className}`}
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}
    >
      {children}
    </div>
  );
}

/** Vertical separator between primary and secondary toolbar actions. */
export function SellerListingToolbarDivider() {
  return (
    <div
      className="hidden h-8 w-px shrink-0 sm:block"
      style={{ backgroundColor: 'var(--border)' }}
      aria-hidden
    />
  );
}
