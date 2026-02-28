"use client";

import React from "react";
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Sprout, 
  Settings, 
  Menu, 
  Bell, 
  User,
  LineChart,
  ClipboardCheck
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Farm Map", href: "/map", icon: MapIcon },
  { name: "Predictions", href: "/predict", icon: LineChart },
  { name: "Recommendations", href: "/recommendations", icon: Sprout },
  { name: "Plan Season", href: "/planner", icon: ClipboardCheck },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-body">
      {/* Top Header */}
      <header className="h-16 border-b bg-card flex items-center justify-between px-4 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SidebarContent pathname={pathname} />
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <Sprout className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-headline font-bold text-primary tracking-tight">
              AgriYield AI
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-accent rounded-full border-2 border-card" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 border-r bg-card sticky top-16 h-[calc(100vh-4rem)]">
          <SidebarContent pathname={pathname} />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation (Simpler Experience) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t flex items-center justify-around px-2 z-40">
        {navigation.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-full h-full",
                isActive ? "text-primary font-bold" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("h-6 w-6", isActive && "text-primary")} />
              <span className="text-[10px] uppercase tracking-wider">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function SidebarContent({ pathname }: { pathname: string }) {
  return (
    <div className="flex flex-col h-full py-4">
      <div className="px-4 mb-8">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
          Main Menu
        </p>
        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted text-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5", !isActive && "text-primary")} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="px-4 mt-auto">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
          Account
        </p>
        <div className="space-y-1">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-foreground transition-colors"
          >
            <Settings className="h-5 w-5 text-primary" />
            <span className="font-medium">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
