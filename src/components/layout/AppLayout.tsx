
"use client";

import React from "react";
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Sprout, 
  Settings, 
  Menu, 
  Bell, 
  User as UserIcon,
  LineChart,
  ClipboardCheck,
  Droplets,
  LogOut,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth, useUser } from "@/firebase";
import { signOut } from "firebase/auth";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Farm Map", href: "/map", icon: MapIcon },
  { name: "Water Intelligence", href: "/water-intelligence", icon: Droplets },
  { name: "Predictions", href: "/predict", icon: LineChart },
  { name: "Recommendations", href: "/recommendations", icon: Sprout },
  { name: "Plan Season", href: "/planner", icon: ClipboardCheck },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

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
              <SidebarContent pathname={pathname} user={user} />
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <Sprout className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-headline font-bold text-primary tracking-tight hidden sm:inline">
              AgriYield AI
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Link href="/notifications">
            <Button variant="ghost" size="icon" className="relative hidden sm:flex">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-accent rounded-full border-2 border-card" />
            </Button>
          </Link>

          {loading ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 flex items-center gap-2 px-2 hover:bg-muted/50 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {user.displayName?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-bold hidden md:inline-block max-w-[120px] truncate">
                    {user.displayName}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button size="sm" className="font-bold rounded-full px-6">
                Login
              </Button>
            </Link>
          )}
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 border-r bg-card sticky top-16 h-[calc(100vh-4rem)]">
          <SidebarContent pathname={pathname} user={user} />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
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

function SidebarContent({ pathname, user }: { pathname: string; user: any }) {
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
          Support
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
