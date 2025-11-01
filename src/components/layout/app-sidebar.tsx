"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardCheck,
  MessageSquare,
  Calendar,
  User,
  PanelLeft,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Logo from "../logo";
import { paths } from "@/lib/paths";
import { cn } from "@/lib/utils";

const navItems = [
  { href: paths.dashboard, icon: LayoutDashboard, label: "Dashboard" },
  { href: paths.tasks, icon: ClipboardCheck, label: "Tasks" },
  { href: paths.chat, icon: MessageSquare, label: "Chat" },
  { href: paths.calendar, icon: Calendar, label: "Calendar" },
  { href: paths.profile, icon: User, label: "Profile" },
];

const NavContent = () => {
  const pathname = usePathname();

  return (
    <>
      <div className="p-4">
        <Logo />
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-accent",
              pathname === item.href && "bg-accent text-primary font-semibold"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
};

const AppSidebar = () => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-card">
        <NavContent />
      </aside>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50 bg-card">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle navigation</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-0 w-64 bg-card">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default AppSidebar;
