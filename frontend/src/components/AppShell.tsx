import React from "react";
import Header from "@/components/header";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background-light">
      <Header />
      <main className="px-4 py-6 md:px-6 lg:px-8">{children}</main>
    </div>
  );
}
