import { ReactNode } from "react";

interface MobileLayoutProps {
  children: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-muted flex items-start justify-center">
      <div className="w-full max-w-md bg-background min-h-screen shadow-xl">
        {children}
      </div>
    </div>
  );
}
