// src/app/user/layout.tsx
import React from "react";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <main className="p-4">{children}</main>
    </div>
  );
}
