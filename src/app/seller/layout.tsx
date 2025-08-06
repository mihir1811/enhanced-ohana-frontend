// src/app/user/layout.tsx
import React from "react";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <main className="p-4">{children}</main>
    </div>
  );
}
